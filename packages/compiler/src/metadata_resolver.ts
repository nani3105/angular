/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as cpl from './compile_metadata';
import {Console, resolveForwardRef, stringify, syntaxError} from './util';
import {
    createAttribute,
    createHost, createInject, createInjectionToken, createOptional, createSelf, createSkipSelf, ModuleWithProviders,
    Provider, SchemaMetadata,
    Type
} from './core';
import {NgModuleResolver} from './ng_module_resolver';
import {StaticSymbol} from './aot/static_symbol';
import {CompileReflector} from './compile_reflector';
import {Identifiers} from './identifiers';
import {SummaryResolver} from './summary_resolver';
import {CompilerConfig} from './config';
import {getAllLifecycleHooks} from './lifecycle_reflector';

export type ErrorCollector = (error: any, type?: any) => void;

// Design notes:
// - don't lazily create metadata:
//   For some metadata, we need to do async work sometimes,
//   so the user has to kick off this loading.
//   But we want to report errors even when the async work is
//   not required to check that the user would have been able
//   to wait correctly.
export class CompileMetadataResolver {

    private _directiveCache = new Map<Type, cpl.CompileDirectiveMetadata>();
    private _pipeCache = new Map<Type, cpl.CompilePipeMetadata>();
    private _summaryCache = new Map<Type, cpl.CompileTypeSummary|null>();
    private _ngModuleCache = new Map<Type, cpl.CompileNgModuleMetadata>();

    constructor(
        private _config: CompilerConfig,
        private _summaryResolver: SummaryResolver<any>, private _console: Console,
        private _ngModuleResolver: NgModuleResolver, private _reflector: CompileReflector,
        private _errorCollector?: ErrorCollector
    ) {}

    // getNgModuleMetadata(
    //         moduleType: any, throwIfNotFound = true,
    //         alreadyCollecting: Set<any>|null = null): cpl.CompileNgModuleMetadata|null {
    //     moduleType = resolveForwardRef(moduleType);
    //     let compileMeta = this._ngModuleCache.get(moduleType);
    //     if (compileMeta) {
    //         return compileMeta;
    //     }
    //     const meta = this._ngModuleResolver.resolve(moduleType, throwIfNotFound);
    //     if (!meta) {
    //         return null;
    //     }
    //     const declaredDirectives: cpl.CompileIdentifierMetadata[] = [];
    //     const exportedNonModuleIdentifiers: cpl.CompileIdentifierMetadata[] = [];
    //     const declaredPipes: cpl.CompileIdentifierMetadata[] = [];
    //     const importedModules: cpl.CompileNgModuleSummary[] = [];
    //     const exportedModules: cpl.CompileNgModuleSummary[] = [];
    //     const providers: cpl.CompileProviderMetadata[] = [];
    //     const entryComponents: cpl.CompileEntryComponentMetadata[] = [];
    //     const bootstrapComponents: cpl.CompileIdentifierMetadata[] = [];
    //     const schemas: SchemaMetadata[] = [];

    //     if (meta.imports) {
    //         flattenAndDedupeArray(meta.imports).forEach((importedType) => {
    //             let importedModuleType: Type = undefined !;
    //             if (isValidType(importedType)) {
    //                 importedModuleType = importedType;
    //             } else if (importedType && importedType.ngModule) {
    //                 const moduleWithProviders: ModuleWithProviders = importedType;
    //                 importedModuleType = moduleWithProviders.ngModule;
    //                 if (moduleWithProviders.providers) {
    //                     providers.push(...this._getProvidersMetadata(moduleWithProviders.providers, entryComponents,
    //                         `provider for the NgModule '${stringifyType(importedModuleType)}'`, [],
    //                         importedType));
    //                 }
    //             }
    //         });
    //     }
    // }

    private _getProvidersMetadata(
        providers: Provider[], targetEntryComponents: cpl.CompileEntryComponentMetadata[],
        debugInfo?: string, compileProviders: cpl.CompileProviderMetadata[] = [],
        type?: any): cpl.CompileProviderMetadata[] {
        providers.forEach((provider: any, providerIdx: number) => {
            if (Array.isArray(provider)) {
                this._getProvidersMetadata(provider, targetEntryComponents, debugInfo, compileProviders);
            } else {
                provider = resolveForwardRef(provider);
                let providerMeta: cpl.ProviderMeta = undefined !;
                if (provider && typeof provider === 'object' && provider.hasOwnProperty('provide')) {
                    this._validateProvider(provider);
                    providerMeta = new cpl.ProviderMeta(provider.provide, provider);
                } else if (isValidType(provider)) {
                    providerMeta = new cpl.ProviderMeta(provider, {useClass: provider});
                } else if (provider === void 0) {
                    this._reportError(syntaxError(
                        `Encountered undefined provider! Usually this means you have a circular dependencies (might be caused by using 'barrel' index.ts files.`));
                    return;
                } else {
                    const providersInfo =
                        (<string[]>providers.reduce(
                            (soFar: string[], seenProvider: any, seenProviderIdx: number) => {
                                if (seenProviderIdx < providerIdx) {
                                    soFar.push(`${stringifyType(seenProvider)}`);
                                } else if (seenProviderIdx == providerIdx) {
                                    soFar.push(`?${stringifyType(seenProvider)}?`);
                                } else if (seenProviderIdx == providerIdx + 1) {
                                    soFar.push('...');
                                }
                                return soFar;
                            },
                            []))
                            .join(', ');
                    this._reportError(
                        syntaxError(
                            `Invalid ${debugInfo ? debugInfo : 'provider'} - only instances of Provider and Type are allowed, got: [${providersInfo}]`),
                        type);
                    return;
                }
                if (providerMeta.token ===
                    this._reflector.resolveExternalReference(Identifiers.ANALYZE_FOR_ENTRY_COMPONENTS)) {
                    targetEntryComponents.push(...this._getEntryComponentsFromProvider(providerMeta, type));
                } else {
                    compileProviders.push(this.getProviderMetadata(providerMeta));
                }
            }
        });
        return compileProviders;
    }

    /**
     * Gets the metadata for the given directive.
     * This assumes `loadNgModuleDirectiveAndPipeMetadata` has been called
     * first.
     */
    getDirectiveMetadata(directiveType: any): cpl.CompileDirectiveMetadata {
      const dirMeta = this._directiveCache.get(directiveType)!;
      if (!dirMeta) {
        this._reportError(
            syntaxError(
                `Illegal state: getDirectiveMetadata can only be called after loadNgModuleDirectiveAndPipeMetadata for a module that declares it. Directive ${stringifyType(directiveType)}.`),
            directiveType);
      }
      return dirMeta;
    }

    /**
     * Gets the metadata for the given pipe.
     * This assumes `loadNgModuleDirectiveAndPipeMetadata` has been called
     * first.
     */
    getPipeMetadata(pipeType: any): cpl.CompilePipeMetadata|null {
      const pipeMeta = this._pipeCache.get(pipeType);
      if (!pipeMeta) {
        this._reportError(
            syntaxError(
                `Illegal state: getPipeMetadata can only be called after loadNgModuleDirectiveAndPipeMetadata for a module that declares it. Pipe ${stringifyType(pipeType)}.`),
            pipeType);
      }
      return pipeMeta || null;
    }


    getProviderMetadata(provider: cpl.ProviderMeta): cpl.CompileProviderMetadata {
        let compileDeps: cpl.CompileDiDependencyMetadata[] = undefined !;
        let compileTypeMetadata: cpl.CompileTypeMetadata = null !;
        let compileFactoryMetadata: cpl.CompileFactoryMetadata = null !;
        let token: cpl.CompileTokenMetadata = this._getTokenMetadata(provider.token);

        if (provider.useClass) {
            compileTypeMetadata =
                this._getInjectableTypeMetadata(provider.useClass, provider.dependencies);
            compileDeps = compileTypeMetadata.diDeps;
        }
        return {} as cpl.CompileProviderMetadata;
    }

    private _getInjectableTypeMetadata(type: Type, dependencies: any[]|null = null):
    cpl.CompileTypeMetadata {
        const typeSummary = this._loadSummary(type, cpl.CompileSummaryKind.Injectable);
        if (typeSummary) {
            return typeSummary.type;
        }
        return this._getTypeMetadata(type, dependencies);
    }

    private _getEntryComponentsFromProvider(provider: cpl.ProviderMeta, type?: any): 
        cpl.CompileEntryComponentMetadata[] {
        return [] ;
    }

    private _getTypeMetadata(type: Type, dependencies: any[]|null = null, throwOnUnknownDeps = true):
    cpl.CompileTypeMetadata {
        const identifier = this._getIdentifierMetadata(type);
        return {
            reference: identifier.reference,
            diDeps: this._getDependenciesMetadata(identifier.reference, dependencies, throwOnUnknownDeps),
            lifecycleHooks: getAllLifecycleHooks(this._reflector, identifier.reference),
        };
    }

    private _getDependenciesMetadata(
        typeOrFunc: Type|Function, dependencies: any[]|null,
        throwOnUnknownDeps = true): cpl.CompileDiDependencyMetadata[] {
        let hasUnknownDeps = false;
        const params = dependencies || this._reflector.parameters(typeOrFunc) || [];

        const dependenciesMetadata: cpl.CompileDiDependencyMetadata[] = params.map((param) => {
            let isAttribute = false;
            let isHost = false;
            let isSelf = false;
            let isSkipSelf = false;
            let isOptional = false;
            let token: any = null;
            if (Array.isArray(param)) {
                param.forEach((paramEntry) => {
                    if (createHost.isTypeOf(paramEntry)) {
                        isHost = true;
                    } else if (createSelf.isTypeOf(paramEntry)) {
                        isSelf = true;
                    } else if (createSkipSelf.isTypeOf(paramEntry)) {
                        isSkipSelf = true;
                    } else if (createOptional.isTypeOf(paramEntry)) {
                        isOptional = true;
                    } else if (createAttribute.isTypeOf(paramEntry)) {
                        isAttribute = true;
                        token = paramEntry.attributeName;
                    } else if (createInject.isTypeOf(paramEntry)) {
                        token = paramEntry.token;
                    } else if (
                        createInjectionToken.isTypeOf(paramEntry) || paramEntry instanceof StaticSymbol) {
                        token = paramEntry;
                    } else if (isValidType(paramEntry) && token == null) {
                        token = paramEntry;
                    }
                });
            } else {
                token = param;
            }
            if (token == null) {
                hasUnknownDeps = true;
                return null !;
            }

            return {
                isAttribute,
                isHost,
                isSelf,
                isSkipSelf,
                isOptional,
                token: this._getTokenMetadata(token)
            };

        });

        if (hasUnknownDeps) {
            const depsTokens =
                dependenciesMetadata.map((dep) => dep ? stringifyType(dep.token) : '?').join(', ');
            const message =
                `Can't resolve all parameters for ${stringifyType(typeOrFunc)}: (${depsTokens}).`;
            if (throwOnUnknownDeps || this._config.strictInjectionParameters) {
                this._reportError(syntaxError(message), typeOrFunc);
            } else {
                this._console.warn(`Warning: ${message} This will become an error in Angular v6.x`);
            }
        }

        return dependenciesMetadata;
    }

    private _getIdentifierMetadata(type: Type): cpl.CompileIdentifierMetadata {
        type = resolveForwardRef(type);
        return {reference: type};
    }

    private _loadSummary(type: any, kind: cpl.CompileSummaryKind): cpl.CompileTypeSummary|null {
        let typeSummary = this._summaryCache.get(type);
        if (!typeSummary) {
            const summary = this._summaryResolver.resolveSummary(type);
            typeSummary = summary ? summary.type : null;
            this._summaryCache.set(type, typeSummary || null);
        }
        return typeSummary && typeSummary.summaryKind === kind ? typeSummary : null;
    }

    private _getTokenMetadata(token: any): cpl.CompileTokenMetadata {
        token = resolveForwardRef(token);
        let compileToken: cpl.CompileTokenMetadata;
        if (typeof token === 'string') {
            compileToken = {value: token};
        } else {
            compileToken = {identifier: {reference: token}};
        }
        return compileToken;
    }

    private _validateProvider(provider: any): void {
        if (provider.hasOwnProperty('useClass') && provider.useClass == null) {
            this._reportError(syntaxError(
                `Invalid provider for ${stringifyType(provider.provide)}. useClass cannot be ${provider.useClass}.
           Usually it happens when:
           1. There's a circular dependency (might be caused by using index.ts (barrel) files).
           2. Class was used before it was declared. Use forwardRef in this case.`));
        }
    }

    private _reportError(error: any, type?: any, otherType?: any) {
        if (this._errorCollector) {
            this._errorCollector(error, type);
            if (otherType) {
                this._errorCollector(error, otherType);
            }
        } else {
            throw error;
        }
    }
}

function flattenArray(tree: any[], out: Array<any> = []): Array<any> {
    if (tree) {
        for (let i = 0; i < tree.length; i++) {
            const item = resolveForwardRef(tree[i]);
            if (Array.isArray(item)) {
                flattenArray(item, out);
            } else {
                out.push(item);
            }
        }
    }
    return out;
}

function dedupeArray(array: any[]): Array<any> {
    if (array) {
        return Array.from(new Set(array));
    }
    return [];
}

function flattenAndDedupeArray(tree: any[]): Array<any> {
    return dedupeArray(flattenArray(tree));
}

function isValidType(value: any): boolean {
    return (value instanceof StaticSymbol) || (value instanceof Type);
}

function stringifyType(type: any): string {
    if (type instanceof StaticSymbol) {
        return `${type.name} in ${type.filePath}`;
    } else {
        return stringify(type);
    }
}

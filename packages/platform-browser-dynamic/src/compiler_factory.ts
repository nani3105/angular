/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Compiler, CompilerFactory, ComponentFactory, Optional, InjectionToken, Type, ModuleWithComponentFactories, CompilerOptions, ViewEncapsulation, isDevMode, NgModuleFactory, MissingTranslationStrategy, Injector, StaticProvider, ɵConsole as Console} from '@angular/core';
import {StaticSymbolCache, CompileReflector, CompilerConfig, ProviderMeta, ElementSchemaRegistry, DirectiveNormalizer, DirectiveResolver, PipeResolver, ResourceLoader, NgModuleResolver, HtmlParser, CompileMetadataResolver, ViewCompiler, StyleCompiler, TemplateParser, NgModuleCompiler, JitCompiler, JitSummaryResolver, SummaryResolver, Lexer, Parser} from '@angular/compiler';

import {JitReflector} from './compiler_reflector';

export const ERROR_COLLECTOR_TOKEN = new InjectionToken('ErrorCollector');

const _NO_RESOURCE_LOADER: ResourceLoader = {
    get(url: string): Promise<string>{
        throw new Error(
            `No ResourceLoader implementation has been provided. Can't read the url "${url}"`);}
};

export class CompilerImpl implements Compiler {
  private _delegate: JitCompiler;
  public readonly injector: Injector;
  constructor(
      injector: Injector, private _metadataResolver: CompileMetadataResolver,
      templateParser: TemplateParser, styleCompiler: StyleCompiler, viewCompiler: ViewCompiler,
      ngModuleCompiler: NgModuleCompiler, summaryResolver: SummaryResolver<Type<any>>,
      compileReflector: CompileReflector, compilerConfig: CompilerConfig, console: Console) {
    this._delegate = new JitCompiler(
        _metadataResolver, templateParser, styleCompiler, viewCompiler, ngModuleCompiler,
        summaryResolver, compileReflector, compilerConfig, console,
        this.getExtraNgModuleProviders.bind(this));
    this.injector = injector;
  }

  private getExtraNgModuleProviders() {
    return [this._metadataResolver.getProviderMetadata(
        new ProviderMeta(Compiler, {useValue: this}))];
  }

  compileModuleSync<T>(moduleType: Type<T>): NgModuleFactory<T> {
    return this._delegate.compileModuleSync(moduleType) as NgModuleFactory<T>;
  }
  compileModuleAsync<T>(moduleType: Type<T>): Promise<NgModuleFactory<T>> {
    return this._delegate.compileModuleAsync(moduleType) as Promise<NgModuleFactory<T>>;
  }
  compileModuleAndAllComponentsSync<T>(moduleType: Type<T>): ModuleWithComponentFactories<T> {
    const result = this._delegate.compileModuleAndAllComponentsSync(moduleType);
    return {
      ngModuleFactory: result.ngModuleFactory as NgModuleFactory<T>,
      componentFactories: result.componentFactories as ComponentFactory<any>[],
    };
  }
  compileModuleAndAllComponentsAsync<T>(moduleType: Type<T>):
      Promise<ModuleWithComponentFactories<T>> {
    return this._delegate.compileModuleAndAllComponentsAsync(moduleType)
        .then((result) => ({
                ngModuleFactory: result.ngModuleFactory as NgModuleFactory<T>,
                componentFactories: result.componentFactories as ComponentFactory<any>[],
              }));
  }
  loadAotSummaries(summaries: () => any[]) { this._delegate.loadAotSummaries(summaries); }
  hasAotSummary(ref: Type<any>): boolean { return this._delegate.hasAotSummary(ref); }
  getComponentFactory<T>(component: Type<T>): ComponentFactory<T> {
    return this._delegate.getComponentFactory(component) as ComponentFactory<T>;
  }
  clearCache(): void { this._delegate.clearCache(); }
  clearCacheFor(type: Type<any>) { this._delegate.clearCacheFor(type); }
}


/**
 * A set of providers that provide `JitCompiler` and its dependencies to use for
 * template compilation.
 */
export const COMPILER_PROVIDERS = <StaticProvider[]>[
    {provide: CompileReflector, useValue: new JitReflector()},
    {provide: ResourceLoader, useValue: _NO_RESOURCE_LOADER},
    {provide: JitSummaryResolver, deps: []},
    {provide: SummaryResolver, useExisting: JitSummaryResolver},
    {provide: Console, deps: []},
    {provide: Lexer, deps: []},
    {provide: Parser, deps: [Lexer]},
    { provide: CompileMetadataResolver, deps: [CompilerConfig, HtmlParser, NgModuleResolver,
        DirectiveResolver, PipeResolver,
        SummaryResolver,
        ElementSchemaRegistry,
        DirectiveNormalizer, Console,
        [Optional, StaticSymbolCache],
        CompileReflector,
        [Optional, ERROR_COLLECTOR_TOKEN]]},
    { provide: Compiler, useClass: CompilerImpl, deps: [Injector, CompileMetadataResolver,
        TemplateParser, StyleCompiler,
        ViewCompiler, NgModuleCompiler,
        SummaryResolver, CompileReflector, CompilerConfig,
        Console]},
];

/**
 * @experimental
 */
export class JitCompilerFactory implements CompilerFactory {
    private _defaultOptions: CompilerOptions[];

    /* @internal */
    constructor(defaultOptions: CompilerOptions[]) {
        const compilerOptions: CompilerOptions = {
            useJit: true,
            defaultEncapsulation: ViewEncapsulation.Emulated,
            missingTranslation: MissingTranslationStrategy.Warning,
        };

        this._defaultOptions = [compilerOptions, ...defaultOptions];
    }

    createCompiler(options: CompilerOptions[] = []): Compiler {
        const opts = _mergeOptions(this._defaultOptions.concat(options));
        const injector = Injector.create([
            COMPILER_PROVIDERS, {
                provide: CompilerConfig,
                useFactory: () => {
                    return new CompilerConfig({
                        // let explicit values from the compiler options overwrite options
                        // from the app providers
                        useJit: opts.useJit,
                        jitDevMode: isDevMode(),
                        // let explicit values from the compiler options overwrite options
                        // from the app providers
                        defaultEncapsulation: opts.defaultEncapsulation,
                        missingTranslation: opts.missingTranslation,
                        preserveWhitespaces: opts.preserveWhitespaces,
                    });
                },
                deps: []
            },
            opts.providers !
        ]);
        return injector.get(Compiler);
    }

}  

function _mergeOptions(optionsArr: CompilerOptions[]): CompilerOptions {
    return {
        useJit: _lastDefined(optionsArr.map(options => options.useJit)),
        defaultEncapsulation: _lastDefined(optionsArr.map(options => options.defaultEncapsulation)),
        providers: _mergeArrays(optionsArr.map(options => options.providers !)),
        missingTranslation: _lastDefined(optionsArr.map(options => options.missingTranslation)),
        preserveWhitespaces: _lastDefined(optionsArr.map(options => options.preserveWhitespaces)),
    };
}  

function _lastDefined<T>(args: T[]): T|undefined {
  for (let i = args.length - 1; i >= 0; i--) {
    if (args[i] !== undefined) {
      return args[i];
    }
  }
  return undefined;
}

function _mergeArrays(parts: any[][]): any[] {
  const result: any[] = [];
  parts.forEach((part) => part && result.push(...part));
  return result;
}
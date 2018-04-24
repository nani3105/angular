import {LifecycleHooks} from './lifecycle_reflector';
import {StaticSymbol} from './aot/static_symbol';
import {Type} from './core';

export interface CompileIdentifierMetadata { reference: any; }

export interface CompileDiDependencyMetadata {
    isAttribute?: boolean;
    isSelf?: boolean;
    isHost?: boolean;
    isSkipSelf?: boolean;
    isOptional?: boolean;
    isValue?: boolean;
    token?: CompileTokenMetadata;
    value?: any;
}

export enum CompileSummaryKind {
    Pipe,
    Directive,
    NgModule,
    Injectable
}

export interface CompileDiDependencyMetadata {
    isAttribute?: boolean;
    isSelf?: boolean;
    isHost?: boolean;
    isSkipSelf?: boolean;
    isOptional?: boolean;
    isValue?: boolean;
    token?: CompileTokenMetadata;
    value?: any;
}

/**
 * A CompileSummary is the data needed to use a directive / pipe / module
 * in other modules / components. However, this data is not enough to compile
 * the directive / module itself.
 */
export interface CompileTypeSummary {
    summaryKind: CompileSummaryKind|null;
    type: CompileTypeMetadata;
}


export interface CompileTokenMetadata {
    value?: any;
    identifier?: CompileIdentifierMetadata|CompileTypeMetadata;
}

/**
 * Metadata regarding compilation of a type.
 */
export interface CompileTypeMetadata extends CompileIdentifierMetadata {
    diDeps: CompileDiDependencyMetadata[];
    lifecycleHooks: LifecycleHooks[];
    reference: any;
}

export interface CompileProviderMetadata {
    token: CompileTokenMetadata;
    useClass?: CompileTypeMetadata;
    useValue?: any;
    useExisting?: CompileTokenMetadata;
    useFactory?: CompileFactoryMetadata;
    deps?: CompileDiDependencyMetadata[];
    multi?: boolean;
}

export interface CompileFactoryMetadata extends CompileIdentifierMetadata {
    diDeps: CompileDiDependencyMetadata[];
    reference: any;
}

export interface CompileEntryComponentMetadata {
    componentType: any;
    componentFactory: StaticSymbol|object;
}

export interface CompileProviderMetadata {
    token: CompileTokenMetadata;
    useClass?: CompileTypeMetadata;
    useValue?: any;
    useExisting?: CompileTokenMetadata;
    useFactory?: CompileFactoryMetadata;
    deps?: CompileDiDependencyMetadata[];
    multi?: boolean;
}

export class ProviderMeta {
    token: any;
    useClass: Type|null;
    useValue: any;
    useExisting: any;
    useFactory: Function|null;
    dependencies: Object[]|null;
    multi: boolean;

    constructor(token: any, {useClass, useValue, useExisting, useFactory, deps, multi}: {
        useClass?: Type,
        useValue?: any,
        useExisting?: any,
        useFactory?: Function|null,
        deps?: Object[]|null,
        multi?: boolean
    }) {
        this.token = token;
        this.useClass = useClass || null;
        this.useValue = useValue;
        this.useExisting = useExisting;
        this.useFactory = useFactory || null;
        this.dependencies = deps || null;
        this.multi = !!multi;
    }
}

// Note: This should only use interfaces as nested data types
// as we need to be able to serialize this from/to JSON!
export interface CompileNgModuleSummary extends CompileTypeSummary {
    type: CompileTypeMetadata;

    // Note: This is transitive over the exported modules.
    exportedDirectives: CompileIdentifierMetadata[];
    // Note: This is transitive over the exported modules.
    exportedPipes: CompileIdentifierMetadata[];

    // Note: This is transitive.
    entryComponents: CompileEntryComponentMetadata[];
    // Note: This is transitive.
    providers: {provider: CompileProviderMetadata, module: CompileIdentifierMetadata}[];
    // Note: This is transitive.
    modules: CompileTypeMetadata[];
}


/**
 * Metadata regarding compilation of a module.
 */
export class CompileNgModuleMetadata {
   type: CompileTypeMetadata;
}
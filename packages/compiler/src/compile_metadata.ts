/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {LifecycleHooks} from './lifecycle_reflector';
import {StaticSymbol} from './aot/static_symbol';
import {ChangeDetectionStrategy, SchemaMetadata, Type, ViewEncapsulation} from './core';
import {ParseTreeResult as HtmlParseTreeResult} from './ml_parser/parser';
import {splitAtColon, stringify} from './util';

// group 0: "[prop] or (event) or @trigger"
// group 1: "prop" from "[prop]"
// group 2: "event" from "(event)"
// group 3: "@trigger" from "@trigger"
const HOST_REG_EXP = /^(?:(?:\[([^\]]+)\])|(?:\(([^\)]+)\)))|(\@[-\w]+)$/;

export interface ProxyClass { setDelegate(delegate: any): void; }

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

export interface CompileQueryMetadata {
  selectors: Array<CompileTokenMetadata>;
  descendants: boolean;
  first: boolean;
  propertyName: string;
  read: CompileTokenMetadata;
}

/**
 * Metadata about a stylesheet
 */
export class CompileStylesheetMetadata {
  moduleUrl: string|null;
  styles: string[];
  styleUrls: string[];
  constructor(
      {moduleUrl, styles,
       styleUrls}: {moduleUrl?: string, styles?: string[], styleUrls?: string[]} = {}) {
    this.moduleUrl = moduleUrl || null;
    this.styles = _normalizeArray(styles);
    this.styleUrls = _normalizeArray(styleUrls);
  }
}

/**
 * Summary Metadata regarding compilation of a template.
 */
export interface CompileTemplateSummary {
  ngContentSelectors: string[];
  encapsulation: ViewEncapsulation|null;
}


/**
 * Metadata regarding compilation of a template.
 */
export class CompileTemplateMetadata {
  encapsulation: ViewEncapsulation|null;
  template: string|null;
  templateUrl: string|null;
  htmlAst: HtmlParseTreeResult|null;
  isInline: boolean;
  styles: string[];
  styleUrls: string[];
  externalStylesheets: CompileStylesheetMetadata[];
  animations: any[];
  ngContentSelectors: string[];
  interpolation: [string, string]|null;
  preserveWhitespaces: boolean;
  constructor({encapsulation, template, templateUrl, htmlAst, styles, styleUrls,
               externalStylesheets, animations, ngContentSelectors, interpolation, isInline,
               preserveWhitespaces}: {
    encapsulation: ViewEncapsulation | null,
    template: string|null,
    templateUrl: string|null,
    htmlAst: HtmlParseTreeResult|null,
    styles: string[],
    styleUrls: string[],
    externalStylesheets: CompileStylesheetMetadata[],
    ngContentSelectors: string[],
    animations: any[],
    interpolation: [string, string]|null,
    isInline: boolean,
    preserveWhitespaces: boolean
  }) {
    this.encapsulation = encapsulation;
    this.template = template;
    this.templateUrl = templateUrl;
    this.htmlAst = htmlAst;
    this.styles = _normalizeArray(styles);
    this.styleUrls = _normalizeArray(styleUrls);
    this.externalStylesheets = _normalizeArray(externalStylesheets);
    this.animations = animations ? flatten(animations) : [];
    this.ngContentSelectors = ngContentSelectors || [];
    if (interpolation && interpolation.length != 2) {
      throw new Error(`'interpolation' should have a start and an end symbol.`);
    }
    this.interpolation = interpolation;
    this.isInline = isInline;
    this.preserveWhitespaces = preserveWhitespaces;
  }

  toSummary(): CompileTemplateSummary {
    return {
      ngContentSelectors: this.ngContentSelectors,
      encapsulation: this.encapsulation,
    };
  }
}

// Note: This should only use interfaces as nested data types
// as we need to be able to serialize this from/to JSON!
export interface CompileDirectiveSummary extends CompileTypeSummary {
  type: CompileTypeMetadata;
  isComponent: boolean;
  selector: string|null;
  exportAs: string|null;
  inputs: {[key: string]: string};
  outputs: {[key: string]: string};
  hostListeners: {[key: string]: string};
  hostProperties: {[key: string]: string};
  hostAttributes: {[key: string]: string};
  providers: CompileProviderMetadata[];
  viewProviders: CompileProviderMetadata[];
  queries: CompileQueryMetadata[];
  guards: {[key: string]: any};
  viewQueries: CompileQueryMetadata[];
  entryComponents: CompileEntryComponentMetadata[];
  changeDetection: ChangeDetectionStrategy|null;
  template: CompileTemplateSummary|null;
  componentViewType: StaticSymbol|ProxyClass|null;
  rendererType: StaticSymbol|object|null;
  componentFactory: StaticSymbol|object|null;
}

export interface CompilePipeSummary extends CompileTypeSummary {
  type: CompileTypeMetadata;
  name: string;
  pure: boolean;
}

export class CompilePipeMetadata {
  type: CompileTypeMetadata;
  name: string;
  pure: boolean;

  constructor({type, name, pure}: {
    type: CompileTypeMetadata,
    name: string,
    pure: boolean,
  }) {
    this.type = type;
    this.name = name;
    this.pure = !!pure;
  }

  toSummary(): CompilePipeSummary {
    return {
      summaryKind: CompileSummaryKind.Pipe,
      type: this.type,
      name: this.name,
      pure: this.pure
    };
  }
}

/**
 * Metadata regarding compilation of a directive.
 */
export class CompileDirectiveMetadata {
  static create({isHost, type, isComponent, selector, exportAs, changeDetection, inputs, outputs,
                 host, providers, viewProviders, queries, guards, viewQueries, entryComponents,
                 template, componentViewType, rendererType, componentFactory}: {
    isHost: boolean,
    type: CompileTypeMetadata,
    isComponent: boolean,
    selector: string|null,
    exportAs: string|null,
    changeDetection: ChangeDetectionStrategy|null,
    inputs: string[],
    outputs: string[],
    host: {[key: string]: string},
    providers: CompileProviderMetadata[],
    viewProviders: CompileProviderMetadata[],
    queries: CompileQueryMetadata[],
    guards: {[key: string]: any};
    viewQueries: CompileQueryMetadata[],
    entryComponents: CompileEntryComponentMetadata[],
    template: CompileTemplateMetadata,
    componentViewType: StaticSymbol|ProxyClass|null,
    rendererType: StaticSymbol|object|null,
    componentFactory: StaticSymbol|object|null,
  }): CompileDirectiveMetadata {
    const hostListeners: {[key: string]: string} = {};
    const hostProperties: {[key: string]: string} = {};
    const hostAttributes: {[key: string]: string} = {};
    if (host != null) {
      Object.keys(host).forEach(key => {
        const value = host[key];
        const matches = key.match(HOST_REG_EXP);
        if (matches === null) {
          hostAttributes[key] = value;
        } else if (matches[1] != null) {
          hostProperties[matches[1]] = value;
        } else if (matches[2] != null) {
          hostListeners[matches[2]] = value;
        }
      });
    }
    const inputsMap: {[key: string]: string} = {};
    if (inputs != null) {
      inputs.forEach((bindConfig: string) => {
        // canonical syntax: `dirProp: elProp`
        // if there is no `:`, use dirProp = elProp
        const parts = splitAtColon(bindConfig, [bindConfig, bindConfig]);
        inputsMap[parts[0]] = parts[1];
      });
    }
    const outputsMap: {[key: string]: string} = {};
    if (outputs != null) {
      outputs.forEach((bindConfig: string) => {
        // canonical syntax: `dirProp: elProp`
        // if there is no `:`, use dirProp = elProp
        const parts = splitAtColon(bindConfig, [bindConfig, bindConfig]);
        outputsMap[parts[0]] = parts[1];
      });
    }

    return new CompileDirectiveMetadata({
      isHost,
      type,
      isComponent: !!isComponent, selector, exportAs, changeDetection,
      inputs: inputsMap,
      outputs: outputsMap,
      hostListeners,
      hostProperties,
      hostAttributes,
      providers,
      viewProviders,
      queries,
      guards,
      viewQueries,
      entryComponents,
      template,
      componentViewType,
      rendererType,
      componentFactory,
    });
  }
  isHost: boolean;
  type: CompileTypeMetadata;
  isComponent: boolean;
  selector: string|null;
  exportAs: string|null;
  changeDetection: ChangeDetectionStrategy|null;
  inputs: {[key: string]: string};
  outputs: {[key: string]: string};
  hostListeners: {[key: string]: string};
  hostProperties: {[key: string]: string};
  hostAttributes: {[key: string]: string};
  providers: CompileProviderMetadata[];
  viewProviders: CompileProviderMetadata[];
  queries: CompileQueryMetadata[];
  guards: {[key: string]: any};
  viewQueries: CompileQueryMetadata[];
  entryComponents: CompileEntryComponentMetadata[];

  template: CompileTemplateMetadata|null;

  componentViewType: StaticSymbol|ProxyClass|null;
  rendererType: StaticSymbol|object|null;
  componentFactory: StaticSymbol|object|null;

  constructor({isHost,
               type,
               isComponent,
               selector,
               exportAs,
               changeDetection,
               inputs,
               outputs,
               hostListeners,
               hostProperties,
               hostAttributes,
               providers,
               viewProviders,
               queries,
               guards,
               viewQueries,
               entryComponents,
               template,
               componentViewType,
               rendererType,
               componentFactory}: {
    isHost: boolean,
    type: CompileTypeMetadata,
    isComponent: boolean,
    selector: string|null,
    exportAs: string|null,
    changeDetection: ChangeDetectionStrategy|null,
    inputs: {[key: string]: string},
    outputs: {[key: string]: string},
    hostListeners: {[key: string]: string},
    hostProperties: {[key: string]: string},
    hostAttributes: {[key: string]: string},
    providers: CompileProviderMetadata[],
    viewProviders: CompileProviderMetadata[],
    queries: CompileQueryMetadata[],
    guards: {[key: string]: any},
    viewQueries: CompileQueryMetadata[],
    entryComponents: CompileEntryComponentMetadata[],
    template: CompileTemplateMetadata|null,
    componentViewType: StaticSymbol|ProxyClass|null,
    rendererType: StaticSymbol|object|null,
    componentFactory: StaticSymbol|object|null,
  }) {
    this.isHost = !!isHost;
    this.type = type;
    this.isComponent = isComponent;
    this.selector = selector;
    this.exportAs = exportAs;
    this.changeDetection = changeDetection;
    this.inputs = inputs;
    this.outputs = outputs;
    this.hostListeners = hostListeners;
    this.hostProperties = hostProperties;
    this.hostAttributes = hostAttributes;
    this.providers = _normalizeArray(providers);
    this.viewProviders = _normalizeArray(viewProviders);
    this.queries = _normalizeArray(queries);
    this.guards = guards;
    this.viewQueries = _normalizeArray(viewQueries);
    this.entryComponents = _normalizeArray(entryComponents);
    this.template = template;

    this.componentViewType = componentViewType;
    this.rendererType = rendererType;
    this.componentFactory = componentFactory;
  }

  toSummary(): CompileDirectiveSummary {
    return {
      summaryKind: CompileSummaryKind.Directive,
      type: this.type,
      isComponent: this.isComponent,
      selector: this.selector,
      exportAs: this.exportAs,
      inputs: this.inputs,
      outputs: this.outputs,
      hostListeners: this.hostListeners,
      hostProperties: this.hostProperties,
      hostAttributes: this.hostAttributes,
      providers: this.providers,
      viewProviders: this.viewProviders,
      queries: this.queries,
      guards: this.guards,
      viewQueries: this.viewQueries,
      entryComponents: this.entryComponents,
      changeDetection: this.changeDetection,
      template: this.template && this.template.toSummary(),
      componentViewType: this.componentViewType,
      rendererType: this.rendererType,
      componentFactory: this.componentFactory
    };
  }
}

function _normalizeArray(obj: any[] | undefined | null): any[] {
  return obj || [];
}

export function flatten<T>(list: Array<T|T[]>): T[] {
  return list.reduce((flat: any[], item: T | T[]): T[] => {
    const flatItem = Array.isArray(item) ? flatten(item) : item;
    return (<T[]>flat).concat(flatItem);
  }, []);
}
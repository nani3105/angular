import {Type} from '../core';
import {Console, SyncAsync} from '../util';
import {CompileMetadataResolver} from '../metadata_resolver';
import {TemplateParser} from '../template_parser/template_parser';
import { StyleCompiler} from '../style_compiler';
import {ViewCompiler} from '../view_compiler/view_compiler';
import {NgModuleCompiler} from '../ng_module_compiler';
import {SummaryResolver} from '../summary_resolver';
import {CompileReflector} from '../compile_reflector';
import {CompilerConfig} from '../config';
import {CompileProviderMetadata} from '../compile_metadata';

export interface ModuleWithComponentFactories {
  ngModuleFactory: object;
  componentFactories: object[];
}

/**
 * An internal module of the Angular compiler that begins with component types,
 * extracts templates, and eventually produces a compiled version of the
 * component ready for linking into an application.
 *
 * @security  When compiling templates at runtime, you must ensure that the
 * entire template comes from a trusted source. Attacker-controlled data
 * introduced by a template could expose your application to XSS risks.  For
 * more detail, see the [Security Guide](http://g.co/ng/security).
 */
export class JitCompiler {
  constructor(
      private _metadataResolver: CompileMetadataResolver,
      private _templateParser: TemplateParser,
      private _styleCompiler: StyleCompiler,
      private _viewCompiler: ViewCompiler,
      private _ngModuleCompiler: NgModuleCompiler,
      private _summaryResolver: SummaryResolver<Type>,
      private _reflector: CompileReflector,
      private _compilerConfig: CompilerConfig, private _console: Console,
      private getExtraNgModuleProviders:
          (ngModule: any) => CompileProviderMetadata[]) {}

  compileModuleSync(moduleType: Type): object {
    return SyncAsync.assertSync(
        this._compileModuleAndComponents(moduleType, true));
  }

  compileModuleAsync(moduleType: Type): Promise<object> {
    return Promise.resolve(this._compileModuleAndComponents(moduleType, false));
  }

  compileModuleAndAllComponentsSync(moduleType: Type): ModuleWithComponentFactories {
    return SyncAsync.assertSync(
         this._compileModuleAndAllComponents(moduleType, true));
  }

  compileModuleAndAllComponentsAsync(moduleType: Type): Promise<ModuleWithComponentFactories> {
    return Promise.resolve(
         this._compileModuleAndAllComponents(moduleType, false));
  }

  getComponentFactory(component: Type): object {
    const summary = {componentFactory: {}}; //this._metadataResolver.getDirectiveSummary(component);
    return summary.componentFactory as object;
  }

  loadAotSummaries(summaries: () => any[]) {
    this.clearCache();
    //this._addAotSummaries(summaries);
  }

  hasAotSummary(ref: Type) {
    return !!this._summaryResolver.resolveSummary(ref);
  }

  private _compileModuleAndAllComponents(moduleType: Type, isSync: boolean):
      SyncAsync<ModuleWithComponentFactories> {
    return SyncAsync.then(this._loadModules(moduleType, isSync), () => {
      const componentFactories: object[] = [];
      //this._compileComponents(moduleType, componentFactories);
      return {
        ngModuleFactory: {},
        componentFactories: componentFactories
      };
    });
  }

  private _compileModuleAndComponents(moduleType: Type, isSync: boolean): any {
    return SyncAsync.then(this._loadModules(moduleType, isSync), () => {});
  }

  private _loadModules(mainModule: any, isSync: boolean): SyncAsync<any> {
    const loading: Promise<any>[] = [];
    // const mainNgModule =
    // this._metadataResolver.getNgModuleMetadata(mainModule) !;
    return SyncAsync.all(loading);
  }

  clearCacheFor(type: Type) {}


  clearCache(): void {}
}
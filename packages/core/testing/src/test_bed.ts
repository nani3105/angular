/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ApplicationInitStatus, Injector, Type, Provider, CompilerOptions, Component, Directive, StaticProvider, SchemaMetadata, NgModuleFactory, NgZone, NgModuleRef, NgModule, Pipe, PlatformRef, ɵAPP_ROOT as APP_ROOT, ɵoverrideComponentView as overrideComponentView, ɵstringify as stringify} from '@angular/core';
import {AsyncTestCompleter} from './async_test_completer';
import {ComponentFixture} from './component_fixture';
import {MetadataOverride} from './metadata_override';
import {TestingCompiler, TestingCompilerFactory} from './test_compiler';

/**
 * @experimental
 */
export type TestModuleMetadata = {
    providers?: any[],
    declarations?: any[],
    imports?: any[],
    schemas?: Array<SchemaMetadata|any[]>,
    aotSummaries?: () => any[],
};


/**
 * @whatItDoes Configures and initializes environment for unit testing and provides methods for
 * creating components and services in unit tests.
 * @description
 *
 * TestBed is the primary api for writing unit tests for Angular applications and libraries.
 *
 * @stable
 */
export class TestBed implements Injector {

    /**
     * Allows overriding default providers, directives, pipes, modules of the test injector,
     * which are defined in test_injector.js
     */
    static configureTestingModule(moduleDef: TestModuleMetadata): typeof TestBed {
        getTestBed().configureTestingModule(moduleDef);
        return TestBed;
    }

    /**
    * Allows overriding default compiler providers and settings
    * which are defined in test_injector.js
    */
    static configureCompiler(config: {providers?: any[]; useJit?: boolean;}): typeof TestBed {
        getTestBed().configureCompiler(config);
        return TestBed;
    }

    private _instantiated: boolean = false;

    private _compiler: TestingCompiler = null !;
    private _moduleRef: NgModuleRef<any> = null !;
    private _moduleFactory: NgModuleFactory<any> = null !;
  
    private _compilerOptions: CompilerOptions[] = [];
  
    private _moduleOverrides: [Type<any>, MetadataOverride<NgModule>][] = [];
    private _componentOverrides: [Type<any>, MetadataOverride<Component>][] = [];
    private _directiveOverrides: [Type<any>, MetadataOverride<Directive>][] = [];
    private _pipeOverrides: [Type<any>, MetadataOverride<Pipe>][] = [];
  
    private _providers: Provider[] = [];
    private _declarations: Array<Type<any>|any[]|any> = [];
    private _imports: Array<Type<any>|any[]|any> = [];
    private _schemas: Array<SchemaMetadata|any[]> = [];
    private _activeFixtures: ComponentFixture<any>[] = [];
  
    private _testEnvAotSummaries: () => any[] = () => [];
    private _aotSummaries: Array<() => any[]> = [];
    private _templateOverrides: Array<{component: Type<any>, templateOf: Type<any>}> = [];
  
    private _isRoot: boolean = true;
    private _rootProviderOverrides: Provider[] = [];
  
    platform: PlatformRef = null !;
  
    ngModule: Type<any>|Type<any>[] = null !;

    configureTestingModule(moduleDef: TestModuleMetadata) {
        this._assertNotInstantiated('TestBed.configureTestingModule', 'configure the test module');
        if (moduleDef.providers) {
            this._providers.push(...moduleDef.providers);
        }
        if (moduleDef.declarations) {
            this._declarations.push(...moduleDef.declarations);
        }
        if (moduleDef.imports) {
            this._imports.push(...moduleDef.imports);
        }
        if (moduleDef.schemas) {
            this._schemas.push(...moduleDef.schemas);
        }
        if (moduleDef.aotSummaries) {
            this._aotSummaries.push(moduleDef.aotSummaries);
        }
    }

    configureCompiler(config: {providers?: any[], useJit?: boolean}) {
        this._assertNotInstantiated('TestBed.configureCompiler', 'configure the compiler');
        this._compilerOptions.push(config);
    }

    execute(tokens: any[], fn: Function, context?: any): any {
        this._initIfNeeded();
        const params = tokens.map(t => this.get(t));
        return fn.apply(context, params);
    }

    private _createCompilerAndModule(): Type<any> {
        const providers = this._providers.concat([{provide: TestBed, useValue: this}]);
        const declarations =
            [...this._declarations, ...this._templateOverrides.map(entry => entry.templateOf)];
        
        const rootScopeImports = [];
        const rootProviderOverrides = this._rootProviderOverrides;
        if (this._isRoot) {
            @NgModule({
              providers: [
                ...rootProviderOverrides,
              ],
            })
            class RootScopeModule {
            }
            rootScopeImports.push(RootScopeModule);
        }
        providers.push({provide: APP_ROOT, useValue: this._isRoot});
      
        const imports = [rootScopeImports, this.ngModule, this._imports];
        const schemas = this._schemas;
      
        @NgModule({providers, declarations, imports, schemas})
        class DynamicTestModule {
        }
        const compilerFactory: TestingCompilerFactory =
            this.platform.injector.get(TestingCompilerFactory);
        this._compiler = compilerFactory.createTestingCompiler(this._compilerOptions);
        for (const summary of [this._testEnvAotSummaries, ...this._aotSummaries]) {
          this._compiler.loadAotSummaries(summary);
        }
        this._moduleOverrides.forEach((entry) => this._compiler.overrideModule(entry[0], entry[1]));
        this._componentOverrides.forEach(
            (entry) => this._compiler.overrideComponent(entry[0], entry[1]));
        this._directiveOverrides.forEach(
            (entry) => this._compiler.overrideDirective(entry[0], entry[1]));
        this._pipeOverrides.forEach((entry) => this._compiler.overridePipe(entry[0], entry[1]));
        return DynamicTestModule;
    }

    compileComponents(): Promise<any> {
        if (this._moduleFactory || this._instantiated) {
          return Promise.resolve(null);
        }
    
        const moduleType = this._createCompilerAndModule();
        return this._compiler.compileModuleAndAllComponentsAsync(moduleType)
            .then((moduleAndComponentFactories) => {
              this._moduleFactory = moduleAndComponentFactories.ngModuleFactory;
            });
    }

    private _initIfNeeded() {
        if (this._instantiated) {
          return;
        }
        if (!this._moduleFactory) {
          try {
            const moduleType = this._createCompilerAndModule();
            this._moduleFactory =
                this._compiler.compileModuleAndAllComponentsSync(moduleType).ngModuleFactory;
          } catch (e) {
            const errorCompType = this._compiler.getComponentFromError(e);
            if (errorCompType) {
              throw new Error(
                  `This test module uses the component ${stringify(errorCompType)} which is using a "templateUrl" or "styleUrls", but they were never compiled. ` +
                  `Please call "TestBed.compileComponents" before your test.`);
            } else {
              throw e;
            }
          }
        }
        for (const {component, templateOf} of this._templateOverrides) {
          const compFactory = this._compiler.getComponentFactory(templateOf);
          overrideComponentView(component, compFactory);
        }
    
        const ngZone = new NgZone({enableLongStackTrace: true});
        const providers: StaticProvider[] = [{provide: NgZone, useValue: ngZone}];
        const ngZoneInjector = Injector.create({
          providers: providers,
          parent: this.platform.injector,
          name: this._moduleFactory.moduleType.name
        });
        this._moduleRef = this._moduleFactory.create(ngZoneInjector);
        // ApplicationInitStatus.runInitializers() is marked @internal to core. So casting to any
        // before accessing it.
        (this._moduleRef.injector.get(ApplicationInitStatus) as any).runInitializers();
        this._instantiated = true;
    }
    
    

    get(token: any, notFoundValue?: any): any {
        return null;
    }

    private _assertNotInstantiated(methodName: string, methodDescription: string) {
        if (this._instantiated) {
            throw new Error(
                `Cannot ${methodDescription} when the test module has already been instantiated. ` +
                `Make sure you are not using \`inject\` before \`${methodName}\`.`);
        }
    }
}

let _testBed: TestBed = null !;

/**
 * Allows injecting dependencies in `beforeEach()` and `it()`.
 *
 * Example:
 *
 * ```
 * beforeEach(inject([Dependency, AClass], (dep, object) => {
 *   // some code that uses `dep` and `object`
 *   // ...
 * }));
 *
 * it('...', inject([AClass], (object) => {
 *   object.doSomething();
 *   expect(...);
 * })
 * ```
 *
 * Notes:
 * - inject is currently a function because of some Traceur limitation the syntax should
 * eventually
 *   becomes `it('...', @Inject (object: AClass, async: AsyncTestCompleter) => { ... });`
 *
 *
 */
export function inject(tokens: any[], fn: Function): () => any {
    const testBed = getTestBed();
    if (tokens.indexOf(AsyncTestCompleter) >= 0) {
      // Not using an arrow function to preserve context passed from call site
      return function() {
        // Return an async test method that returns a Promise if AsyncTestCompleter is one of
        // the injected tokens.
        return testBed.compileComponents().then(() => {
          const completer: AsyncTestCompleter = testBed.get(AsyncTestCompleter);
          testBed.execute(tokens, fn, this);
          return completer.promise;
        });
      };
    } else {
      // Not using an arrow function to preserve context passed from call site
      return function() { return testBed.execute(tokens, fn, this); };
    }
}

/**
 * @experimental
 */
export function getTestBed() {
    return _testBed = _testBed || new TestBed();
}

import {Injector, Type, Pro} from '@angular/core';
import {SchemaMetadata} from '@angular/compiler/src/core';




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

    private _instantiated: boolean = false;

    private _providers: Provider[] = [];
    private _declarations: Array<Type<any>|any[]|any> = [];
    private _imports: Array<Type<any>|any[]|any> = [];
    private _schemas: Array<SchemaMetadata|any[]> = [];

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
 * @experimental
 */
export function getTestBed() {
    return _testBed = _testBed || new TestBed();
}

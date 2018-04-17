import {Type} from '../core';
import {SyncAsync} from '../util';
import {CompileMetadataResolver} from '../metadata_resolver';

/**
 * An internal module of the Angular compiler that begins with component types,
 * extracts templates, and eventually produces a compiled version of the component
 * ready for linking into an application.
 *
 * @security  When compiling templates at runtime, you must ensure that the entire template comes
 * from a trusted source. Attacker-controlled data introduced by a template could expose your
 * application to XSS risks.  For more detail, see the [Security Guide](http://g.co/ng/security).
 */
export class JitCompiler {

    constructor(
        private _metadataResolver: CompileMetadataResolver
    ) {}

    compileModuleAsync(moduleType: Type): Promise<object> {
        return Promise.resolve(this._compileModuleAndComponents(moduleType, false));
    }

    private _compileModuleAndComponents(moduleType: Type, ieSync: boolean): SyncAsync<object> {
        return SyncAsync.then(this._loadModules(moduleType, isSync), () => {});
    }

    private _loadModules(mainModule: any, isSync: boolean): SyncAsync<any> {
        const loading: Promise<any>[] = [];
        const mainNgModule = this._metadataResolver.getNgModuleMetadata(mainModule) !;
    }
}
import {CompileReflector, ExternalReference, getUrlScheme, syntaxError} from '@angular/compiler';
import {Component, ɵReflectionCapabilities as ReflectionCapabilities, ɵstringify as stringify} from '@angular/core';

const builtinExternalReferences = createBuiltinExternalReferencesMap();
export const MODULE_SUFFIX = '';

export class JitReflector implements CompileReflector {
    private reflectionCapabilities: ReflectionCapabilities;
    constructor() { this.reflectionCapabilities = new ReflectionCapabilities(); }
    componentModuleUrl(type: any, cmpMetadata: Component): string {
        const moduleId = cmpMetadata.moduleId;

        if (typeof moduleId === 'string') {
            const scheme = getUrlScheme(moduleId);
            return scheme ? moduleId : `package:${moduleId}${MODULE_SUFFIX}`;
        } else if (moduleId !== null && moduleId !== void 0) {
            throw syntaxError(
                `moduleId should be a string in "${stringify(type)}". See https://goo.gl/wIDDiL for more information.\n` +
                `If you're using Webpack you should inline the template and the styles, see https://goo.gl/X2J8zc.`);
        }

        return `./${stringify(type)}`;
    }
    parameters(typeOrFunc: /*Type*/ any): any[][] {
        return this.reflectionCapabilities.parameters(typeOrFunc);
    }
    tryAnnotations(typeOrFunc: /*Type*/ any): any[] { return this.annotations(typeOrFunc); }
    annotations(typeOrFunc: /*Type*/ any): any[] {
        return this.reflectionCapabilities.annotations(typeOrFunc);
    }
    shallowAnnotations(typeOrFunc: /*Type*/ any): any[] {
        throw new Error('Not supported in JIT mode');
    }
    propMetadata(typeOrFunc: /*Type*/ any): {[key: string]: any[]} {
        return this.reflectionCapabilities.propMetadata(typeOrFunc);
    }
    hasLifecycleHook(type: any, lcProperty: string): boolean {
        return this.reflectionCapabilities.hasLifecycleHook(type, lcProperty);
    }
    guards(type: any): {[key: string]: any} { return this.reflectionCapabilities.guards(type); }

    resolveExternalReference(ref: ExternalReference): any {
        return builtinExternalReferences.get(ref) || ref.runtime;
    }
}

function createBuiltinExternalReferencesMap() {
    const map = new Map<ExternalReference, any>();
    return map;
}
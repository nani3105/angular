import * as o from './output/output_ast';

/**
 * Provides access to reflection data about symbols that the compiler needs.
 */
export abstract class CompileReflector {
    abstract parameters(typeOrFunc: /*Type*/ any): any[][];
    abstract annotations(typeOrFunc: /*Type*/ any): any[];
    abstract shallowAnnotations(typeOrFunc: /*Type*/ any): any[];
    abstract tryAnnotations(typeOrFunc: /*Type*/ any): any[];
    abstract propMetadata(typeOrFunc: /*Type*/ any): {[key: string]: any[]};
    abstract hasLifecycleHook(type: any, lcProperty: string): boolean;
    abstract guards(typeOrFunc: /* Type */ any): {[key: string]: any};
    abstract resolveExternalReference(ref: o.ExternalReference): any;
}
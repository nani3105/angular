import {Type} from '../type';
import {PlatformReflectionCapabilities} from './platform_reflection_capabilities';

/**
 * Provides access to reflection data about symbols. Used internally by Angular
 * to power dependency injection and compilation.
 */
export class Reflector {
    constructor(public reflectionCapabilities: PlatformReflectionCapabilities) {}

    factory(type: Type<any>): Function { return this.reflectionCapabilities.factory(type); }

    parameters(typeOrFunc: Type<any>): any[][] {
        return this.reflectionCapabilities.parameters(typeOrFunc);
    }

    propMetadata(typeOrFunc: Type<any>): {[key: string]: any[]} {
        return this.reflectionCapabilities.propMetadata(typeOrFunc);
    }

}
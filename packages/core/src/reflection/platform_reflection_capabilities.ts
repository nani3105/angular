import {Type} from '../type';
import {GetterFn, MethodFn, SetterFn} from './types';

export interface PlatformReflectionCapabilities {
    isReflectionEnabled(): boolean;
    factory(type: Type<any>): Function;

    /**
     * Return a list of annotations/types for constructor parameters
     */
    parameters(type: Type<any>): any[][];

    /**
     * Return a object literal which describes the annotations on Class fields/properties.
     */
    propMetadata(typeOrFunc: Type<any>): {[key: string]: any[]};


}
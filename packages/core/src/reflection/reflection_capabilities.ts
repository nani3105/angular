import {PlatformReflectionCapabilities} from './platform_reflection_capabilities';
import {global, stringify} from '../util';
import {Type, isType} from '../type';
import {ANNOTATIONS, PARAMETERS, PROP_METADATA} from '../util/decorators';

/**
 * Attention: These regex has to hold even if the code is minified!
 */
export const DELEGATE_CTOR = /^function\s+\S+\(\)\s*{[\s\S]+\.apply\(this,\s*arguments\)/;
export const INHERITED_CLASS = /^class\s+[A-Za-z\d$_]*\s*extends\s+[A-Za-z\d$_]+\s*{/;
export const INHERITED_CLASS_WITH_CTOR =
    /^class\s+[A-Za-z\d$_]*\s*extends\s+[A-Za-z\d$_]+\s*{[\s\S]*constructor\s*\(/;

export class ReflectionCapabilities implements PlatformReflectionCapabilities {
    private _reflect: any;

    constructor(reflect?: any) { this._reflect = reflect || global['Reflect']; }

    isReflectionEnabled(): boolean { return true; }

    factory<T>(t: Type<T>): (args: any[]) => T { return (...args: any[]) => new t(...args); }

    /** @internal */
    _zipTypesAndAnnotations(paramTypes: any[], paramAnnotations: any[]): any[][] {
        let result: any[][];

        if (typeof paramTypes === 'undefined') {
            result = new Array(paramAnnotations.length);
        } else {
            result = new Array(paramTypes.length);
        }

        for (let i = 0; i < result.length; i++) {
            // TS outputs Object for parameters without types, while Traceur omits
            // the annotations. For now we preserve the Traceur behavior to aid
            // migration, but this can be revisited.
            if (typeof paramTypes === 'undefined') {
                result[i] = [];
            } else if (paramTypes[i] != Object) {
                result[i] = [paramTypes[i]];
            } else {
                result[i] = [];
            }
            if (paramAnnotations && paramAnnotations[i] != null) {
                result[i] = result[i].concat(paramAnnotations[i]);
            }
        }
        return result;
    }

    parameters(type: Type<any>): any[][] {
        // Note: only report metadata if we have at least one class decorator
        // to stay in sync with the static reflector.
        if (!isType(type)) {
            return [];
        }
        const parentCtor = getParentCtor(type);
        let parameters = this._ownParameters(type, parentCtor);
        if (!parameters && parentCtor !== Object) {
            parameters = this.parameters(parentCtor);
        }
        return parameters || [];
    }

    private _ownParameters(type: Type<any>, parentCtor: any): any[][]|null {
        const typeStr = type.toString();
        // If we have no decorators, we only have function.length as metadata.
        // In that case, to detect whether a child class declared an own constructor or not,
        // we need to look inside of that constructor to check whether it is
        // just calling the parent.
        // This also helps to work around for https://github.com/Microsoft/TypeScript/issues/12439
        // that sets 'design:paramtypes' to []
        // if a class inherits from another class but has no ctor declared itself.
        if (DELEGATE_CTOR.exec(typeStr) ||
            (INHERITED_CLASS.exec(typeStr) && !INHERITED_CLASS_WITH_CTOR.exec(typeStr))) {
            return null;
        }

        // Prefer the direct API.
        if ((<any>type).parameters && (<any>type).parameters !== parentCtor.parameters) {
            return (<any>type).parameters;
        }

        // API of tsickle for lowering decorators to properties on the class.
        const tsickleCtorParams = (<any>type).ctorParameters;
        if (tsickleCtorParams && tsickleCtorParams !== parentCtor.ctorParameters) {
            // Newer tsickle uses a function closure
            // Retain the non-function case for compatibility with older tsickle
            const ctorParameters =
                typeof tsickleCtorParams === 'function' ? tsickleCtorParams() : tsickleCtorParams;
            const paramTypes = ctorParameters.map((ctorParam: any) => ctorParam && ctorParam.type);
            const paramAnnotations = ctorParameters.map(
                (ctorParam: any) =>
                    ctorParam && convertTsickleDecoratorIntoMetadata(ctorParam.decorators));
            return this._zipTypesAndAnnotations(paramTypes, paramAnnotations);
        }

        // API for metadata created by invoking the decorators.
        const paramAnnotations = type.hasOwnProperty(PARAMETERS) && (type as any)[PARAMETERS];
        const paramTypes = this._reflect && this._reflect.getOwnMetadata &&
            this._reflect.getOwnMetadata('design:paramtypes', type);
        if (paramTypes || paramAnnotations) {
            return this._zipTypesAndAnnotations(paramTypes, paramAnnotations);
        }

        // If a class has no decorators, at least create metadata
        // based on function.length.
        // Note: We know that this is a real constructor as we checked
        // the content of the constructor above.
        return new Array((<any>type.length)).fill(undefined);
    }
}

function convertTsickleDecoratorIntoMetadata(decoratorInvocations: any[]): any[] {
    if (!decoratorInvocations) {
        return [];
    }
    return decoratorInvocations.map(decoratorInvocation => {
        const decoratorType = decoratorInvocation.type;
        const annotationCls = decoratorType.annotationCls;
        const annotationArgs = decoratorInvocation.args ? decoratorInvocation.args : [];
        return new annotationCls(...annotationArgs);
    });
}

function getParentCtor(ctor: Function): Type<any> {
    const parentProto = ctor.prototype ? Object.getPrototypeOf(ctor.prototype) : null;
    const parentCtor = parentProto ? parentProto.constructor : null;
    // Note: We always use `Object` as the null value
    // to simplify checking later on.
    return parentCtor || Object;
}
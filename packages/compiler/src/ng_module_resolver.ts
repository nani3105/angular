import {CompileReflector} from './compile_reflector';
import {NgModule, Type, createNgModule} from './core';
import {findLast} from './directive_resolver';
import {stringify} from './util';

/**
 * Resolves types to {@link NgModule}.
 */
export class NgModuleResolver {
    constructor(private _reflector: CompileReflector) {}

    isNgModule(type: any) { return this._reflector.annotations(type).some(createNgModule.isTypeOf); }

    resolve(type: Type, throwIfNotFound = true): NgModule|null {
        const ngModuleMeta: NgModule =
            findLast(this._reflector.annotations(type), createNgModule.isTypeOf);

        if (ngModuleMeta) {
            return ngModuleMeta;
        } else {
            if (throwIfNotFound) {
                throw new Error(`No NgModule metadata found for '${stringify(type)}'.`);
            }
            return null;
        }
    }
}
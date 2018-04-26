/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

export interface Inject { token: any; }
export const createInject = makeMetadataFactory<Inject>('Inject', (token: any) => ({token}));
export const createInjectionToken = makeMetadataFactory<object>(
    'InjectionToken', (desc: string) => ({_desc: desc, ngInjectableDef: undefined}));

export interface Attribute { attributeName?: string; }
export const createAttribute =
    makeMetadataFactory<Attribute>('Attribute', (attributeName?: string) => ({attributeName}));

export interface Type extends Function { new (...args: any[]): any;}
export const Type = Function;

export interface NgModule {
    providers?: Provider[];
    declarations?: Array<Type|any[]>;
    imports?: Array<Type|ModuleWithProviders|any[]>;
    exports?: Array<Type|any[]>;
    entryComponents?: Array<Type|any[]>;
    bootstrap?: Array<Type|any[]>;
    schemas?: Array<SchemaMetadata|any[]>;
    id?: string;
}

export const createNgModule =
    makeMetadataFactory<NgModule>('NgModule', (ngModule: NgModule) => ngModule);

export interface SchemaMetadata { name: string; }

export interface ModuleWithProviders {
    ngModule: Type;
    providers?: Provider[];
}

export enum ViewEncapsulation {
  Emulated = 0,
  Native = 1,
  None = 2
}

export enum ChangeDetectionStrategy {
  OnPush = 0,
  Default = 1
}

export type Provider = any;

export const createOptional = makeMetadataFactory('Optional');
export const createSelf = makeMetadataFactory('Self');
export const createSkipSelf = makeMetadataFactory('SkipSelf');
export const createHost = makeMetadataFactory('Host');

export interface MetadataFactory<T> {
    (...args: any[]): T;
    isTypeOf(obj: any): obj is T;
    ngMetadataName: string;
}


function makeMetadataFactory<T>(name: string, props?: (...args: any[]) => T): MetadataFactory<T> {
    const factory: any = (...args: any[]) => {
        const values = props ? props(...args) : {};
        return {
            ngMetadataName: name,
            ...values,
        };
    };

    factory.isTypeOf = (obj: any) => obj && obj.ngMetadataName === name;
    factory.ngMetadataName = name;
    return factory;
}
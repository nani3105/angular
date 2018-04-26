/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */


/**
 * @module
 * @description
 * The `di` module provides dependency injection container services.
 */

export * from './di/metadata';

export {Injectable, InjectableDecorator, InjectableProvider} from './di/injectable';
export {inject, InjectFlags, INJECTOR, Injector} from './di/injector';
export {StaticProvider, ValueProvider, ExistingProvider, FactoryProvider, Provider, TypeProvider, ClassProvider} from './di/provider';
export {InjectionToken} from './di/injection_token';


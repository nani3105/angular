/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Type} from '../type';
import {ComponentFactory, ComponentRef} from './component_factory';
import {stringify} from '../util';

export function noComponentFactoryError(component: Function) {
  const error = Error(
      `No component factory found for ${stringify(component)}. Did you add it to @NgModule.entryComponents?`);
  (error as any)[ERROR_COMPONENT] = component;
  return error;
}

const ERROR_COMPONENT = 'ngComponent';

class _NullComponentFactoryResolver implements ComponentFactoryResolver {
  resolveComponentFactory<T>(component: {new (...args: any[]): T}): ComponentFactory<T> {
    throw noComponentFactoryError(component);
  }
}

/**
 *
 */
export abstract class ComponentFactoryResolver {
  static NULL: ComponentFactoryResolver = new _NullComponentFactoryResolver();
  abstract resolveComponentFactory<T>(component: Type<T>): ComponentFactory<T>;
}

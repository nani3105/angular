/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {ComponentFactory} from '../linker/component_factory';
import {Type} from '../type';

export interface Services {
    overrideComponentView(compType: Type<any>, compFactory: ComponentFactory<any>): void;
}

/**
 * This object is used to prevent cycles in the source files and to have a place where
 * debug mode can hook it. It is lazily filled when `isDevMode` is known.
 */
export const Services: Services = {
  overrideComponentView: undefined !,
};
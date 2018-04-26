/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ComponentFactory} from '../linker/component_factory';
import {Type} from '../type';
import {Services} from './types';
import {initServicesIfNeeded} from './services';

export function overrideComponentView(comp: Type<any>, componentFactory: ComponentFactory<any>) {
  initServicesIfNeeded();
  return Services.overrideComponentView(comp, componentFactory);
}

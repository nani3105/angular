
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {isDevMode} from '../application_ref';

let initialized = false;

export function initServicesIfNeeded() {
  if (initialized) {
    return;
  }
  initialized = true;
}
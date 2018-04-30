/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Resolve a `Type` for {@link Pipe}.
 *
 * This interface can be overridden by the application developer to create custom behavior.
 *
 * See {@link Compiler}
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {CompileReflector} from './compile_reflector';
import {Pipe, Type} from './core';

export class PipeResolver {

  constructor(private _reflector: CompileReflector) {}  

  /**
   * Return {@link Pipe} for a given `Type`.
   */
  resolve(type: Type, throwIfNotFound = true): Pipe|null {
      return null;
  }
}
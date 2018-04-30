/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {CompileReflector} from './compile_reflector';
import {Component, Directive, Type, createComponent} from './core';


/*
 * Resolve a `Type` for {@link Directive}.
 *
 * This interface can be overridden by the application developer to create custom behavior.
 *
 * See {@link Compiler}
 */
export class DirectiveResolver {

  constructor(private _reflector: CompileReflector) {}

  /**
   * Return {@link Directive} for a given `Type`.
   */
  resolve(type: Type): Directive;
  resolve(type: Type, throwIfNotFound: true): Directive;
  resolve(type: Type, throwIfNotFound: boolean): Directive|null;
  resolve(type: Type, throwIfNotFound = true): Directive|null {
    return null;
  }
}

export function findLast<T>(arr: T[], condition: (value: T) => boolean): T|null {
    for (let i = arr.length - 1; i >=0; i--) {
        if (condition(arr[i])) {
            return arr[i];
        }
    }
    return null;
}
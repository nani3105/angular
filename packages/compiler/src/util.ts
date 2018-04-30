/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ParseError} from './parse_util';

export function splitAtColon(input: string, defaultValues: string[]): string[] {
  return _splitAt(input, ':', defaultValues);
}

function _splitAt(input: string, character: string, defaultValues: string[]): string[] {
  const characterIndex = input.indexOf(character);
  if (characterIndex == -1) return defaultValues;
  return [input.slice(0, characterIndex).trim(), input.slice(characterIndex + 1).trim()];
}

export type SyncAsync<T> = T | Promise<T>;

export const SyncAsync = {
  assertSync: <T>(value: SyncAsync<T>): T => {
    if (isPromise(value)) {
      throw new Error(`Illegal state: value cannot be a promise`);
    }
    return value;
  },
  then: <T, R>(value: SyncAsync<T>, cb: (value: T) => R | Promise<R>| SyncAsync<R>):
            SyncAsync<R> => { return isPromise(value) ? value.then(cb) : cb(value);},
  all: <T>(syncAsyncValues: SyncAsync<T>[]): SyncAsync<T[]> => {
    return syncAsyncValues.some(isPromise) ? Promise.all(syncAsyncValues) : syncAsyncValues as T[];
  }
};

export function noUndefined<T>(val: T | undefined): T {
    return val === undefined ? null ! : val;
}

/**
 * Determine if the argument is shaped like a Promise
 */
export function isPromise(obj: any): obj is Promise<any> {
    // allow any Promise/A+ compliant thenable.
    // It's up to the caller to ensure that obj.then conforms to the spec
    return !!obj && typeof obj.then === 'function';
}

/**
 * Lazily retrieves the reference value from a forwardRef.
 */
export function resolveForwardRef(type: any): any {
    if (typeof type === 'function' && type.hasOwnProperty('__forward_ref__')) {
        return type();
    } else {
        return type;
    }
}

const MAX_LENGTH_STRINGIFY = 100;

export function stringify(token: any): string {
    if (typeof token === 'string') {
        return token;
    }

    if (token instanceof Array) {
        return '[' + token.map(stringify).join(', ') + ']';
    }

    if (token == null) {
        return '' + token;
    }

    if (token.overriddenName) {
        return `${token.overriddenName}`;
    }

    if (token.name) {
        return `${token.name}`;
    }

    let res;
    try {
        res = JSON.stringify(token);
    } catch {
        res = token.toString();
    }

    if (res == null) {
        return '' + res;
    }

    const newLineIndex = res.indexOf('\n');
    if (0 < newLineIndex) {
        res = res.substring(0, newLineIndex);
    }

    if (MAX_LENGTH_STRINGIFY < res.length) {
        res = res.substring(0, MAX_LENGTH_STRINGIFY) + '...';
    }

    return res;
}

export function syntaxError(msg: string, parseErrors?: ParseError[]): Error {
    const error = Error(msg);
    (error as any)[ERROR_SYNTAX_ERROR] = true;
    if (parseErrors) (error as any)[ERROR_PARSE_ERRORS] = parseErrors;
    return error;
}

const ERROR_SYNTAX_ERROR = 'ngSyntaxError';
const ERROR_PARSE_ERRORS = 'ngParseErrors';

export interface Console {
    log(message: string): void;
    warn(message: string): void;
}
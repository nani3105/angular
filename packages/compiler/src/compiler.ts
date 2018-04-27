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
 * Entry point for all APIs of the compiler package.
 *
 * <div class="callout is-critical">
 *   <header>Unstable APIs</header>
 *   <p>
 *     All compiler apis are currently considered experimental and private!
 *   </p>
 *   <p>
 *     We expect the APIs in this package to keep on changing. Do not rely on them.
 *   </p>
 * </div>
 */

export {CompilerConfig, preserveWhitespacesDefault} from './config';

export * from './resource_loader';
import * as core from './core';
export * from './compile_reflector';
export {ExternalReference} from './output/output_ast';
export { syntaxError} from './util';
export * from './summary_resolver';
export {core};
export * from './url_resolver';
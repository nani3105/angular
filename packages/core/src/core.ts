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
 * Entry point from which you should import all public core APIs.
 */
export * from './metadata';
export * from './di';

export * from './change_detection';
export {Type} from './type';
export * from './zone';
export {PlatformRef} from './application_ref';
export * from './linker';
export { ApplicationInitStatus} from './application_init';
export * from './core_private_export';
export {Sanitizer, SecurityContext} from './sanitization/security';
export * from './platform_core_providers';
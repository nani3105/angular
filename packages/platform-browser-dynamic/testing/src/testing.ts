/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {NgModule, PlatformRef, StaticProvider, createPlatformFactory} from '@angular/core';
import {TestComponentRenderer} from '@angular/core/testing';
import {BrowserTestingModule} from '@angular/platform-browser/testing';
import {DOMTestComponentRenderer} from './dom_test_component_renderer';

/**
 * NgModule for testing.
 *
 *
 */
@NgModule({
    exports: [BrowserTestingModule],
    providers: [
        {provide: TestComponentRenderer, useClass: DOMTestComponentRenderer},
    ]
})
export class BrowserDynamicTestingModule {
}
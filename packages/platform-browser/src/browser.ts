/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {PlatformLocation, ɵPLATFORM_BROWSER_ID as PLATFORM_BROWSER_ID} from '@angular/common';
import {PLATFORM_ID, PLATFORM_INITIALIZER, PlatformRef, NgModule, Sanitizer, StaticProvider, createPlatformFactory, platformCore, ɵAPP_ROOT as APP_ROOT} from '@angular/core';
import {DOCUMENT} from './dom/dom_tokens';
import {DomSanitizer, DomSanitizerImpl} from './security/dom_sanitization_service';
import {BrowserDomAdapter} from './browser/browser_adapter';
import {BrowserGetTestability} from './browser/testability';
import {BrowserPlatformLocation} from './browser/location/browser_platform_location';


export const INTERNAL_BROWSER_PLATFORM_PROVIDERS: StaticProvider[] = [
  {provide: PLATFORM_ID, useValue: PLATFORM_BROWSER_ID},
  {provide: PLATFORM_INITIALIZER, useValue: initDomAdapter, multi: true},
  {provide: PlatformLocation, useClass: BrowserPlatformLocation, deps: [DOCUMENT]},
  {provide: DOCUMENT, useFactory: _document, deps: []},
];

/**
 *
 */
export const platformBrowser: (extraProviders?: StaticProvider[]) => PlatformRef =
    createPlatformFactory(platformCore, 'browser', INTERNAL_BROWSER_PLATFORM_PROVIDERS);

/**
 * @security Replacing built-in sanitization providers exposes the application to XSS risks.
 * Attacker-controlled data introduced by an unsanitized provider could expose your
 * application to XSS risks. For more detail, see the [Security Guide](http://g.co/ng/security).
 * @experimental
 */
export const BROWSER_SANITIZATION_PROVIDERS: StaticProvider[] = [
    {provide: Sanitizer, useExisting: DomSanitizer},
    {provide: DomSanitizer, useClass: DomSanitizerImpl, deps: [DOCUMENT]},
];

export function initDomAdapter() {
  BrowserDomAdapter.makeCurrent();
  BrowserGetTestability.init();
}

export function _document(): any {
  return document;
}


/**
 * The ng module for the browser.
 *
 *
 */
@NgModule({
    providers: [
        {provide: APP_ROOT, useValue: true}
    ]
})
export class BrowserModule {}
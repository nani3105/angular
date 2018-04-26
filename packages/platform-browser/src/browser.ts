/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {DOCUMENT} from './dom/dom_tokens';
import { NgModule, Sanitizer, StaticProvider, ɵAPP_ROOT as APP_ROOT } from '@angular/core';
import {DomSanitizer, DomSanitizerImpl} from './security/dom_sanitization_service';

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
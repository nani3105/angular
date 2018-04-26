/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import * as t from '@angular/core/testing/src/testing_internal';

import {_sanitizeUrl, sanitizeSrcset} from '../../src/sanitization/url_sanitizer';

{
    t.describe('URL sanitizer', () => {
        let logMsgs: string[];
        let originalLog: (msg: any) => any;

        t.beforeEach(() => {
            logMsgs = [];
            originalLog = console.warn;  // Monkey patch DOM.log.
            console.warn = (msg: any) => logMsgs.push(msg);
        });

        afterEach(() => { console.warn = originalLog; });

        t.it('reports unsafe URLs', () => {
            t.expect(_sanitizeUrl('javascript:evil()')).toBe('unsafe:javascript:evil()');
            t.expect(logMsgs.join('\n')).toMatch(/sanitizing unsafe URL value/);
        });
    });
}
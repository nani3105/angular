/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ɵgetDOM as getDOM} from '@angular/platform-browser';

export let browserDetection: BrowserDetection;

export class BrowserDetection {
    private _overrideUa: string|null;

    private get _ua(): string {
        if (typeof this._overrideUa === 'string') {
            return this._overrideUa;
        }

        return getDOM() ? getDOM().getUserAgent() : '';
    }

    static setup() { browserDetection = new BrowserDetection(null); }

    constructor(ua: string|null) { this._overrideUa = ua; }
    get isFirefox(): boolean { return this._ua.indexOf('Firefox') > -1; }

    get isAndroid(): boolean {
        return this._ua.indexOf('Mozilla/5.0') > -1 && this._ua.indexOf('Android') > -1 &&
            this._ua.indexOf('AppleWebKit') > -1 && this._ua.indexOf('Chrome') == -1 &&
            this._ua.indexOf('IEMobile') == -1;
    }

    get isEdge(): boolean { return this._ua.indexOf('Edge') > -1; }

    get isIE(): boolean { return this._ua.indexOf('Trident') > -1; }

    get isWebkit(): boolean {
        return this._ua.indexOf('AppleWebKit') > -1 && this._ua.indexOf('Edge') == -1 &&
            this._ua.indexOf('IEMobile') == -1;
    }

    get isIOS7(): boolean {
        return (this._ua.indexOf('iPhone OS 7') > -1 || this._ua.indexOf('iPad OS 7') > -1) &&
            this._ua.indexOf('IEMobile') == -1;
    }

    get isSlow(): boolean { return this.isAndroid || this.isIE || this.isIOS7; }

    // The Intl API is only natively supported in Chrome, Firefox, IE11 and Edge.
    // This detector is needed in tests to make the difference between:
    // 1) IE11/Edge: they have a native Intl API, but with some discrepancies
    // 2) IE9/IE10: they use the polyfill, and so no discrepancies
    get supportsNativeIntlApi(): boolean {
        return !!(<any>global).Intl && (<any>global).Intl !== (<any>global).IntlPolyfill;
    }

    get isChromeDesktop(): boolean {
        return this._ua.indexOf('Chrome') > -1 && this._ua.indexOf('Mobile Safari') == -1 &&
            this._ua.indexOf('Edge') == -1;
    }

    // "Old Chrome" means Chrome 3X, where there are some discrepancies in the Intl API.
    // Android 4.4 and 5.X have such browsers by default (respectively 30 and 39).
    get isOldChrome(): boolean {
        return this._ua.indexOf('Chrome') > -1 && this._ua.indexOf('Chrome/3') > -1 &&
            this._ua.indexOf('Edge') == -1;
    }
}

BrowserDetection.setup();
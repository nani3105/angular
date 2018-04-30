/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {GetTestability, Testability, TestabilityRegistry, setTestabilityGetter} from '@angular/core';

export class BrowserGetTestability implements GetTestability {
    
    static init() { setTestabilityGetter(new BrowserGetTestability()); }

    addToWindow(registry: TestabilityRegistry): void {
        throw new Error("Method not implemented.");
    }
    findTestabilityInTree(registry: TestabilityRegistry, elem: any, findInAncestors: boolean): Testability | null {
        throw new Error("Method not implemented.");
    }
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Injectable} from '../di';

/**
 * Testability API.
 * `declare` keyword causes tsickle to generate externs, so these methods are
 * not renamed by Closure Compiler.
 * @experimental
 */
export declare interface PublicTestability {
  isStable(): boolean;
  whenStable(callback: Function, timeout?: number, updateCallback?: Function): void;
  findProviders(using: any, provider: string, exactMatch: boolean): any[];
}

/**
 * A global registry of {@link Testability} instances for specific elements.
 * @experimental
 */
@Injectable()
export class TestabilityRegistry {}

/**
 * The Testability service provides testing hooks that can be accessed from
 * the browser and by services such as Protractor. Each bootstrapped Angular
 * application on the page will have an instance of Testability.
 * @experimental
 */
@Injectable()
export class Testability implements PublicTestability {
    isStable(): boolean {
        throw new Error("Method not implemented.");
    }
    whenStable(callback: Function, timeout?: number | undefined, updateCallback?: Function | undefined): void {
        throw new Error("Method not implemented.");
    }
    findProviders(using: any, provider: string, exactMatch: boolean): any[] {
        throw new Error("Method not implemented.");
    }
}

/**
 * Adapter interface for retrieving the `Testability` service associated for a
 * particular context.
 *
 * @experimental Testability apis are primarily intended to be used by e2e test tool vendors like
 * the Protractor team.
 */
export interface GetTestability {
  addToWindow(registry: TestabilityRegistry): void;
  findTestabilityInTree(registry: TestabilityRegistry, elem: any, findInAncestors: boolean):
      Testability|null;
}

class _NoopGetTestability implements GetTestability {
  addToWindow(registry: TestabilityRegistry): void {}
  findTestabilityInTree(registry: TestabilityRegistry, elem: any, findInAncestors: boolean):
      Testability|null {
    return null;
  }
}

/**
 * Set the {@link GetTestability} implementation used by the Angular testing framework.
 * @experimental
 */
export function setTestabilityGetter(getter: GetTestability): void {
  _testabilityGetter = getter;
}

let _testabilityGetter: GetTestability = new _NoopGetTestability();
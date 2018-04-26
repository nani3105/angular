/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ɵisPromise as isPromise} from '@angular/core';
import {AsyncTestCompleter} from './async_test_completer';
import {getTestBed, inject} from './test_bed';

export {AsyncTestCompleter} from './async_test_completer';

const _global = <any>(typeof window === 'undefined' ? global : window);

export const expect: (actual: any) => jasmine.Matchers = _global.expect;

const jsmBeforeEach = _global.beforeEach;
const jsmDescribe = _global.describe;
const jsmIt = _global.it;

const runnerStack: BeforeEachRunner[] = [];
jasmine.DEFAULT_TIMEOUT_INTERVAL = 3000;
const globalTimeOut = jasmine.DEFAULT_TIMEOUT_INTERVAL;

const testBed = getTestBed();

/**
 * Mechanism to run `beforeEach()` functions of Angular tests.
 *
 * Note: Jasmine own `beforeEach` is used by this library to handle DI providers.
 */
class BeforeEachRunner {
    private _fns: Array<Function> = [];

    constructor(private _parent: BeforeEachRunner) {}

    beforeEach(fn: Function): void { this._fns.push(fn); }

    run(): void {
        if (this._parent) this._parent.run();
        this._fns.forEach((fn) => { fn(); });
    }
}

function _describe(jsmFn: Function, ...args: any[]) {
    const parentRunner = runnerStack.length === 0 ? null : runnerStack[runnerStack.length - 1];
    const runner = new BeforeEachRunner(parentRunner !);
    runnerStack.push(runner);
    const suite = jsmFn(...args);
    runnerStack.pop();
    return suite;
}


export function describe(...args: any[]): void {
    return _describe(jsmDescribe, ...args);
}

export function beforeEach(fn: Function): void {
    if (runnerStack.length > 0) {
        // Inside a describe block, beforeEach() uses a BeforeEachRunner
        runnerStack[runnerStack.length - 1].beforeEach(fn);
    } else {
        // Top level beforeEach() are delegated to jasmine
        jsmBeforeEach(fn);
    }
}

function _it(jsmFn: Function, name: string, testFn: Function, testTimeOut: number): void {
    if (runnerStack.length == 0) {
        // This left here intentionally, as we should never get here, and it aids debugging.
        debugger;
        throw new Error('Empty Stack!');
    }
    const runner = runnerStack[runnerStack.length - 1];
    const timeOut = Math.max(globalTimeOut, testTimeOut);

    jsmFn(name, (done: any) => {
        const completerProvider = {
            provide: AsyncTestCompleter,
            useFactory: () => {
                // Mark the test as async when an AsyncTestCompleter is injected in an it()
                return new AsyncTestCompleter();
            }
        };
        testBed.configureTestingModule({providers: [completerProvider]});
        runner.run();

        if (testFn.length == 0) {
            const retVal = testFn();
            if (isPromise(retVal)) {
                // Asynchronous test function that returns a Promise - wait for completion.
                (<Promise<any>>retVal).then(done, done.fail);
            } else {
                // Synchronous test function - complete immediately.
                done();
            }
        } else {
            // Asynchronous test function that takes in 'done' parameter.
            testFn(done);
        }
    }, timeOut);
}

export function it(name: any, fn: any, timeOut: any = null): void {
    return _it(jsmIt, name, fn, timeOut);
}
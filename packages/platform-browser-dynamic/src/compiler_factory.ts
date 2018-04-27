/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Compiler, CompilerFactory, CompilerOptions, ViewEncapsulation, isDevMode, MissingTranslationStrategy, Injector, StaticProvider, ɵConsole as Console} from '@angular/core';
import {CompileReflector, CompilerConfig, ResourceLoader, JitSummaryResolver, SummaryResolver, Lexer, Parser} from '@angular/compiler';

import {JitReflector} from './compiler_reflector';

const _NO_RESOURCE_LOADER: ResourceLoader = {
    get(url: string): Promise<string>{
        throw new Error(
            `No ResourceLoader implementation has been provided. Can't read the url "${url}"`);}
};


/**
 * A set of providers that provide `JitCompiler` and its dependencies to use for
 * template compilation.
 */
export const COMPILER_PROVIDERS = <StaticProvider[]>[
    {provide: CompileReflector, useValue: new JitReflector()},
    {provide: ResourceLoader, useValue: _NO_RESOURCE_LOADER},
    {provide: JitSummaryResolver, deps: []},
    {provide: SummaryResolver, useExisting: JitSummaryResolver},
    {provide: Console, deps: []},
    {provide: Lexer, deps: []},
    {provide: Parser, deps: [Lexer]},
];

/**
 * @experimental
 */
export class JitCompilerFactory implements CompilerFactory {
    private _defaultOptions: CompilerOptions[];

    /* @internal */
    constructor(defaultOptions: CompilerOptions[]) {
        const compilerOptions: CompilerOptions = {
            useJit: true,
            defaultEncapsulation: ViewEncapsulation.Emulated,
            missingTranslation: MissingTranslationStrategy.Warning,
        };

        this._defaultOptions = [compilerOptions, ...defaultOptions];
    }

    createCompiler(options: CompilerOptions[] = []): Compiler {
        const opts = _mergeOptions(this._defaultOptions.concat(options));
        const injector = Injector.create([
            COMPILER_PROVIDERS, {
                provide: CompilerConfig,
                useFactory: () => {
                    return new CompilerConfig({
                        // let explicit values from the compiler options overwrite options
                        // from the app providers
                        useJit: opts.useJit,
                        jitDevMode: isDevMode(),
                        // let explicit values from the compiler options overwrite options
                        // from the app providers
                        defaultEncapsulation: opts.defaultEncapsulation,
                        missingTranslation: opts.missingTranslation,
                        preserveWhitespaces: opts.preserveWhitespaces,
                    });
                },
                deps: []
            },
            opts.providers !
        ]);
        return injector.get(Compiler);
    }

}  

function _mergeOptions(optionsArr: CompilerOptions[]): CompilerOptions {
    return {
        useJit: _lastDefined(optionsArr.map(options => options.useJit)),
        defaultEncapsulation: _lastDefined(optionsArr.map(options => options.defaultEncapsulation)),
        providers: _mergeArrays(optionsArr.map(options => options.providers !)),
        missingTranslation: _lastDefined(optionsArr.map(options => options.missingTranslation)),
        preserveWhitespaces: _lastDefined(optionsArr.map(options => options.preserveWhitespaces)),
    };
}  

function _lastDefined<T>(args: T[]): T|undefined {
  for (let i = args.length - 1; i >= 0; i--) {
    if (args[i] !== undefined) {
      return args[i];
    }
  }
  return undefined;
}

function _mergeArrays(parts: any[][]): any[] {
  const result: any[] = [];
  parts.forEach((part) => part && result.push(...part));
  return result;
}
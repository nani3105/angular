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
 * Entry point for all APIs of the compiler package.
 *
 * <div class="callout is-critical">
 *   <header>Unstable APIs</header>
 *   <p>
 *     All compiler apis are currently considered experimental and private!
 *   </p>
 *   <p>
 *     We expect the APIs in this package to keep on changing. Do not rely on them.
 *   </p>
 * </div>
 */

export {CompilerConfig, preserveWhitespacesDefault} from './config';

export * from './resource_loader';
import * as core from './core';
export * from './compile_reflector';
export {ExternalReference} from './output/output_ast';
export * from './expression_parser/lexer';
export * from './expression_parser/parser';
export { syntaxError} from './util';
export * from './summary_resolver';
export {core};
export * from './url_resolver';
export * from './style_compiler';
export * from './template_parser/template_parser';
export {ViewCompiler} from './view_compiler/view_compiler';
export {JitCompiler} from './jit/compiler';
export * from './compile_metadata';
export {NgModuleResolver} from './ng_module_resolver';
export * from './metadata_resolver';
export {NgModuleCompiler} from './ng_module_compiler';
export {DirectiveResolver} from './directive_resolver';
export {PipeResolver} from './pipe_resolver';
export * from './aot/static_symbol';
export * from './schema/element_schema_registry';
export * from './ml_parser/html_parser';
export * from './directive_normalizer';

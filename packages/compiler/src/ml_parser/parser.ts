/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as html from './ast';
import {ParseError} from '../parse_util';

export class ParseTreeResult {
  constructor(public rootNodes: html.Node[], public errors: ParseError[]) {}
}

export class Parser {}
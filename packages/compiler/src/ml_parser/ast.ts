
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {ParseSourceSpan} from '../parse_util';

export interface Node {
  sourceSpan: ParseSourceSpan;
  visit(visitor: Visitor, context: any): any;
}

export interface Visitor {
    // Returning a truthy value from `visit()` will prevent `visitAll()` from the call to the typed
    // method and result returned will become the result included in `visitAll()`s result array.
}
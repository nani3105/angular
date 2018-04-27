/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import * as chars from '../chars';

export class Lexer {
    tokenize(text: string): Token[] {
        const scanner = new _Scanner(text);
        const tokens: Token[] = [];
        let token = scanner.scanToken();
        while (token != null) {
            tokens.push(token);
            token = scanner.scanToken();
        }
        return tokens;
    }
}

export class Token {}

class _Scanner {
    length: number;
    peek: number = 0;
    index: number = -1;

    constructor(public input: string) {
        this.length = input.length;
        this.advance();
    }

    advance() {
        this.peek = ++this.index >= this.length ? chars.$EOF : this.input.charCodeAt(this.index);
    }


    scanToken(): Token|null {
        const input = this.input, length = this.length;
        let peek = this.peek, index = this.index;

        //skip whitespace
        while(peek <= chars.$SPACE) {
            if (++index >= length) {
                peek = chars.$EOF;
                break;
            } else {
                peek = input.charCodeAt(index);
            }
        }

        this.peek = peek;
        this.index = index;

        if (index >= length) {
            return null;
        }

        // Handle identifiers and numbers.
        if (isIdentifierStart(peek)) return this.scanIdentifier();
    }
}

function isIdentifierStart(code: number): boolean {
    return (chars.$a <= code && code <= chars.$z) || (chars.$A <= code && code <= chars.$Z) ||
        (code == chars.$_) || (code == chars.$$);
}

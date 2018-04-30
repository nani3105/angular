/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Lexer, Token} from '@angular/compiler/src/expression_parser/lexer';

function lex(text: string): any[] {
  return new Lexer().tokenize(text);
}

function expectToken(token: any, index: number) {
  expect(token instanceof Token).toBe(true);
  expect(token.index).toEqual(index);
}

function expectIdentifierToken(token: any, index: number, identifier: string) {
  expectToken(token, index);
  expect(token.isIdentifier()).toBe(true);
  expect(token.toString()).toEqual(identifier);
}

function expectKeywordToken(token: any, index: number, keyword: string) {
  expectToken(token, index);
  expect(token.isKeyword()).toBe(true);
  expect(token.toString()).toEqual(keyword);
}

function expectCharacterToken(token: any, index: number, character: string) {
  expect(character.length).toBe(1);
  expectToken(token, index);
  expect(token.isCharacter(character.charCodeAt(0))).toBe(true);
}

function expectOperatorToken(token: any, index: number, operator: string) {
  expectToken(token, index);
  expect(token.isOperator(operator)).toBe(true);
}

{
    describe('lexer', () => {
      describe('token', () => {
        it('should tokenize a simple identifier', () => {
            const tokens: number[] = lex('j');
            expect(tokens.length).toEqual(1);
            expectIdentifierToken(tokens[0], 0, 'j');
        });

        it('should tokenize "this"', () => {
            const tokens: number[] = lex('this');
            expect(tokens.length).toEqual(1);
            expectKeywordToken(tokens[0], 0, 'this');
        });

        it('should tokenize a dotted identifier', () => {
            const tokens: number[] = lex('j.k');
            expect(tokens.length).toEqual(3);
            expectIdentifierToken(tokens[0], 0, 'j');
            expectCharacterToken(tokens[1], 1, '.');
            expectIdentifierToken(tokens[2], 2, 'k');
        });

        it('should tokenize an operator', () => {
            const tokens: number[] = lex('j-k');
            expect(tokens.length).toEqual(3);
            expectOperatorToken(tokens[1], 1, '-');
        });

        it('should tokenize an indexed operator', () => {
            const tokens: number[] = lex('j[k]');
            expect(tokens.length).toEqual(4);
            expectCharacterToken(tokens[1], 1, '[');
            expectCharacterToken(tokens[3], 3, ']');
        });
      });
    });
}
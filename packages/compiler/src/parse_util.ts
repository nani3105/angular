
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

export class ParseError {}

export class ParseLocation {
    constructor(
        public file: ParseSourceFile, public offset: number, public line: number,
        public col: number) {}
}

export class ParseSourceFile {
  constructor(public content: string, public url: string) {}
}

export class ParseSourceSpan {
  constructor(
      public start: ParseLocation, public end: ParseLocation, public details: string|null = null) {}

  toString(): string {
    return this.start.file.content.substring(this.start.offset, this.end.offset);
  }
}
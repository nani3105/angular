/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {TestBed, inject} from '@angular/core/testing';
import {TEST_COMPILER_PROVIDERS} from './test_bindings';
import {CompileMetadataResolver} from '../src/metadata_resolver';
import { Component, Directive, Injectable, ChangeDetectionStrategy, NgModule, Pipe, ViewEncapsulation, ɵstringify as stringify} from '@angular/core';

{
    describe('CompileMetadataResolver', () => {
        beforeEach(() => { TestBed.configureCompiler({providers: TEST_COMPILER_PROVIDERS}); });

        it('should throw on the getDirectiveMetadata/getPipeMetadata methods if the module has not been loaded yet',
            inject([CompileMetadataResolver], (resolver: CompileMetadataResolver) => {
              @NgModule({})
              class SomeModule {
              }
     
              @Pipe({name: 'pipe'})
              class SomePipe {
              }
     
              expect(() => resolver.getDirectiveMetadata(ComponentWithEverythingInline))
                  .toThrowError(/Illegal state/);
              expect(() => resolver.getPipeMetadata(SomePipe)).toThrowError(/Illegal state/);
        }));
    });
}

@Component({
  selector: 'someSelector',
  inputs: ['someProp'],
  outputs: ['someEvent'],
  host: {
    '[someHostProp]': 'someHostPropExpr',
    '(someHostListener)': 'someHostListenerExpr',
    'someHostAttr': 'someHostAttrValue'
  },
  exportAs: 'someExportAs',
  moduleId: 'someModuleId',
  changeDetection: ChangeDetectionStrategy.Default,
  template: 'someTemplate',
  encapsulation: ViewEncapsulation.Emulated,
  styles: ['someStyle'],
  interpolation: ['{{', '}}']
})
class ComponentWithEverythingInline {
  ngOnInit(): void {}
  ngDoCheck(): void {}
  ngOnDestroy(): void {}
  ngAfterContentInit(): void {}
  ngAfterContentChecked(): void {}
  ngAfterViewInit(): void {}
  ngAfterViewChecked(): void {}
}
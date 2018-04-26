/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Type} from '../type';
import {ClassSansProvider, ConstructorProvider, ConstructorSansProvider, ExistingProvider, ExistingSansProvider, FactoryProvider, FactorySansProvider, StaticClassProvider, StaticClassSansProvider, ValueProvider, ValueSansProvider} from './provider';
import {makeDecorator, makeParamDecorator} from '../util/decorators';
import {InjectableDef, InjectableType, defineInjectable} from './defs';

/**
 * Injectable providers used in `@Injectable` decorator.
 *
 * @experimental
 */
export type InjectableProvider = ValueSansProvider | ExistingSansProvider |
    StaticClassSansProvider | ConstructorSansProvider | FactorySansProvider | ClassSansProvider;

/**
 * Type of the Injectable decorator / constructor function.
 *
 *
 */
export interface InjectableDecorator {
  /**
   * @usageNotes
   * ```
   * @Injectable()
   * class Car {}
   * ```
   *
   * @description
   * A marker metadata that marks a class as available to {@link Injector} for creation.
   *
   * For more details, see the {@linkDocs guide/dependency-injection "Dependency Injection Guide"}.
   *
   * ### Example
   *
   * {@example core/di/ts/metadata_spec.ts region='Injectable'}
   *
   * {@link Injector} will throw an error when trying to instantiate a class that
   * does not have `@Injectable` marker, as shown in the example below.
   *
   * {@example core/di/ts/metadata_spec.ts region='InjectableThrows'}
   *
   *
   */
  (): any;
  (options?: {providedIn: Type<any>| 'root' | null}&InjectableProvider): any;
  new (): Injectable;
  new (options?: {providedIn: Type<any>| 'root' | null}&InjectableProvider): Injectable;
}

/**
 * Type of the Injectable metadata.
 *
 * @experimental
 */
export interface Injectable {
  providedIn?: Type<any>|'root'|null;
  factory: () => any;
}


export function convertInjectableProviderToFactory(
    type: Type<any>, provider?: InjectableProvider): () => any {
        return () => {};
}

/**
* Injectable decorator and metadata.
*
*
* @Annotation
*/
export const Injectable: InjectableDecorator = makeDecorator(
    'Injectable', undefined, undefined, undefined,
    (injectableType: InjectableType<any>,
     options: {providedIn?: Type<any>| 'root' | null} & InjectableProvider) => {
      if (options && options.providedIn !== undefined &&
          injectableType.ngInjectableDef === undefined) {
        injectableType.ngInjectableDef = defineInjectable({
          providedIn: options.providedIn,
          factory: convertInjectableProviderToFactory(injectableType, options)
        });
      }
    });

/**
 * Type representing injectable service.
 *
 * @experimental
 */
export interface InjectableType<T> extends Type<T> { ngInjectableDef: InjectableDef<T>; }
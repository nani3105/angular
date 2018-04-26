
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */


/**
 * Describes within the change detector which strategy will be used the next time change
 * detection is triggered.
 *
 */
export enum ChangeDetectionStrategy {
  /**
   * `OnPush` means that the change detector's mode will be initially set to `CheckOnce`.
   */
  OnPush = 0,

  /**
   * `Default` means that the change detector's mode will be initially set to `CheckAlways`.
   */
  Default = 1,
}

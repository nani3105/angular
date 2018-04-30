/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {setRootDomAdapter} from '../dom/dom_adapter';

import {GenericBrowserDomAdapter} from './generic_browser_adapter';

/**
 * A `DomAdapter` powered by full browser DOM APIs.
 *
 * @security Tread carefully! Interacting with the DOM directly is dangerous and
 * can introduce XSS risks.
 */
/* tslint:disable:requireParameterType no-console */
export class BrowserDomAdapter extends GenericBrowserDomAdapter {
    static makeCurrent() { setRootDomAdapter(new BrowserDomAdapter()); }
    hasProperty(element: any, name: string): boolean {
        throw new Error("Method not implemented.");
    }
    setProperty(el: Element, name: string, value: any) {
        throw new Error("Method not implemented.");
    }
    getProperty(el: Element, name: string) {
        throw new Error("Method not implemented.");
    }
    invoke(el: Element, methodName: string, args: any[]) {
        throw new Error("Method not implemented.");
    }
    logError(error: any) {
        throw new Error("Method not implemented.");
    }
    log(error: any) {
        throw new Error("Method not implemented.");
    }
    logGroup(error: any) {
        throw new Error("Method not implemented.");
    }
    logGroupEnd() {
        throw new Error("Method not implemented.");
    }
    contains(nodeA: any, nodeB: any): boolean {
        throw new Error("Method not implemented.");
    }
    parse(templateHtml: string) {
        throw new Error("Method not implemented.");
    }
    querySelector(el: any, selector: string) {
        throw new Error("Method not implemented.");
    }
    querySelectorAll(el: any, selector: string): any[] {
        throw new Error("Method not implemented.");
    }
    on(el: any, evt: any, listener: any) {
        throw new Error("Method not implemented.");
    }
    onAndCancel(el: any, evt: any, listener: any): Function {
        throw new Error("Method not implemented.");
    }
    dispatchEvent(el: any, evt: any) {
        throw new Error("Method not implemented.");
    }
    createMouseEvent(eventType: any) {
        throw new Error("Method not implemented.");
    }
    createEvent(eventType: string) {
        throw new Error("Method not implemented.");
    }
    preventDefault(evt: any) {
        throw new Error("Method not implemented.");
    }
    isPrevented(evt: any): boolean {
        throw new Error("Method not implemented.");
    }
    getInnerHTML(el: any): string {
        throw new Error("Method not implemented.");
    }
    getTemplateContent(el: any) {
        throw new Error("Method not implemented.");
    }
    getOuterHTML(el: any): string {
        throw new Error("Method not implemented.");
    }
    nodeName(node: any): string {
        throw new Error("Method not implemented.");
    }
    nodeValue(node: any): string | null {
        throw new Error("Method not implemented.");
    }
    type(node: any): string {
        throw new Error("Method not implemented.");
    }
    content(node: any) {
        throw new Error("Method not implemented.");
    }
    firstChild(el: any): Node | null {
        throw new Error("Method not implemented.");
    }
    nextSibling(el: any): Node | null {
        throw new Error("Method not implemented.");
    }
    parentElement(el: any): Node | null {
        throw new Error("Method not implemented.");
    }
    childNodes(el: any): Node[] {
        throw new Error("Method not implemented.");
    }
    childNodesAsList(el: any): Node[] {
        throw new Error("Method not implemented.");
    }
    clearNodes(el: any) {
        throw new Error("Method not implemented.");
    }
    appendChild(el: any, node: any) {
        throw new Error("Method not implemented.");
    }
    removeChild(el: any, node: any) {
        throw new Error("Method not implemented.");
    }
    replaceChild(el: any, newNode: any, oldNode: any) {
        throw new Error("Method not implemented.");
    }
    remove(el: any): Node {
        throw new Error("Method not implemented.");
    }
    insertBefore(parent: any, ref: any, node: any) {
        throw new Error("Method not implemented.");
    }
    insertAllBefore(parent: any, ref: any, nodes: any) {
        throw new Error("Method not implemented.");
    }
    insertAfter(parent: any, el: any, node: any) {
        throw new Error("Method not implemented.");
    }
    setInnerHTML(el: any, value: any) {
        throw new Error("Method not implemented.");
    }
    getText(el: any): string | null {
        throw new Error("Method not implemented.");
    }
    setText(el: any, value: string) {
        throw new Error("Method not implemented.");
    }
    getValue(el: any): string {
        throw new Error("Method not implemented.");
    }
    setValue(el: any, value: string) {
        throw new Error("Method not implemented.");
    }
    getChecked(el: any): boolean {
        throw new Error("Method not implemented.");
    }
    setChecked(el: any, value: boolean) {
        throw new Error("Method not implemented.");
    }
    createComment(text: string) {
        throw new Error("Method not implemented.");
    }
    createTemplate(html: any): HTMLElement {
        throw new Error("Method not implemented.");
    }
    createElement(tagName: any, doc?: any): HTMLElement {
        throw new Error("Method not implemented.");
    }
    createElementNS(ns: string, tagName: string, doc?: any): Element {
        throw new Error("Method not implemented.");
    }
    createTextNode(text: string, doc?: any): Text {
        throw new Error("Method not implemented.");
    }
    createScriptTag(attrName: string, attrValue: string, doc?: any): HTMLElement {
        throw new Error("Method not implemented.");
    }
    createStyleElement(css: string, doc?: any): HTMLStyleElement {
        throw new Error("Method not implemented.");
    }
    createShadowRoot(el: any) {
        throw new Error("Method not implemented.");
    }
    getShadowRoot(el: any) {
        throw new Error("Method not implemented.");
    }
    getHost(el: any) {
        throw new Error("Method not implemented.");
    }
    getDistributedNodes(el: any): Node[] {
        throw new Error("Method not implemented.");
    }
    clone(node: Node): Node {
        throw new Error("Method not implemented.");
    }
    getElementsByClassName(element: any, name: string): HTMLElement[] {
        throw new Error("Method not implemented.");
    }
    getElementsByTagName(element: any, name: string): HTMLElement[] {
        throw new Error("Method not implemented.");
    }
    classList(element: any): any[] {
        throw new Error("Method not implemented.");
    }
    addClass(element: any, className: string) {
        throw new Error("Method not implemented.");
    }
    removeClass(element: any, className: string) {
        throw new Error("Method not implemented.");
    }
    hasClass(element: any, className: string): boolean {
        throw new Error("Method not implemented.");
    }
    setStyle(element: any, styleName: string, styleValue: string) {
        throw new Error("Method not implemented.");
    }
    removeStyle(element: any, styleName: string) {
        throw new Error("Method not implemented.");
    }
    getStyle(element: any, styleName: string): string {
        throw new Error("Method not implemented.");
    }
    hasStyle(element: any, styleName: string, styleValue?: string | undefined): boolean {
        throw new Error("Method not implemented.");
    }
    tagName(element: any): string {
        throw new Error("Method not implemented.");
    }
    attributeMap(element: any): Map<string, string> {
        throw new Error("Method not implemented.");
    }
    hasAttribute(element: any, attribute: string): boolean {
        throw new Error("Method not implemented.");
    }
    hasAttributeNS(element: any, ns: string, attribute: string): boolean {
        throw new Error("Method not implemented.");
    }
    getAttribute(element: any, attribute: string): string | null {
        throw new Error("Method not implemented.");
    }
    getAttributeNS(element: any, ns: string, attribute: string): string {
        throw new Error("Method not implemented.");
    }
    setAttribute(element: any, name: string, value: string) {
        throw new Error("Method not implemented.");
    }
    setAttributeNS(element: any, ns: string, name: string, value: string) {
        throw new Error("Method not implemented.");
    }
    removeAttribute(element: any, attribute: string) {
        throw new Error("Method not implemented.");
    }
    removeAttributeNS(element: any, ns: string, attribute: string) {
        throw new Error("Method not implemented.");
    }
    templateAwareRoot(el: any) {
        throw new Error("Method not implemented.");
    }
    createHtmlDocument(): HTMLDocument {
        throw new Error("Method not implemented.");
    }
    getDefaultDocument(): Document {
        throw new Error("Method not implemented.");
    }
    getBoundingClientRect(el: any) {
        throw new Error("Method not implemented.");
    }
    getTitle(doc: Document): string {
        throw new Error("Method not implemented.");
    }
    setTitle(doc: Document, newTitle: string) {
        throw new Error("Method not implemented.");
    }
    elementMatches(n: any, selector: string): boolean {
        throw new Error("Method not implemented.");
    }
    isTemplateElement(el: any): boolean {
        throw new Error("Method not implemented.");
    }
    isTextNode(node: any): boolean {
        throw new Error("Method not implemented.");
    }
    isCommentNode(node: any): boolean {
        throw new Error("Method not implemented.");
    }
    isElementNode(node: any): boolean {
        throw new Error("Method not implemented.");
    }
    hasShadowRoot(node: any): boolean {
        throw new Error("Method not implemented.");
    }
    isShadowRoot(node: any): boolean {
        throw new Error("Method not implemented.");
    }
    importIntoDoc(node: Node): Node {
        throw new Error("Method not implemented.");
    }
    adoptNode(node: Node): Node {
        throw new Error("Method not implemented.");
    }
    getHref(element: any): string {
        throw new Error("Method not implemented.");
    }
    getEventKey(event: any): string {
        throw new Error("Method not implemented.");
    }
    resolveAndSetHref(element: any, baseUrl: string, href: string) {
        throw new Error("Method not implemented.");
    }
    supportsDOMEvents(): boolean {
        throw new Error("Method not implemented.");
    }
    supportsNativeShadowDOM(): boolean {
        throw new Error("Method not implemented.");
    }
    getGlobalEventTarget(doc: Document, target: string) {
        throw new Error("Method not implemented.");
    }
    getHistory(): History {
        throw new Error("Method not implemented.");
    }
    getLocation(): Location {
        throw new Error("Method not implemented.");
    }
    getBaseHref(doc: Document): string | null {
        throw new Error("Method not implemented.");
    }
    resetBaseElement(): void {
        throw new Error("Method not implemented.");
    }
    getUserAgent(): string {
        throw new Error("Method not implemented.");
    }
    setData(element: any, name: string, value: string) {
        throw new Error("Method not implemented.");
    }
    getComputedStyle(element: any) {
        throw new Error("Method not implemented.");
    }
    getData(element: any, name: string): string | null {
        throw new Error("Method not implemented.");
    }
    supportsWebAnimation(): boolean {
        throw new Error("Method not implemented.");
    }
    performanceNow(): number {
        throw new Error("Method not implemented.");
    }
    getAnimationPrefix(): string {
        throw new Error("Method not implemented.");
    }
    getTransitionEnd(): string {
        throw new Error("Method not implemented.");
    }
    supportsAnimation(): boolean {
        throw new Error("Method not implemented.");
    }
    supportsCookies(): boolean {
        throw new Error("Method not implemented.");
    }
    getCookie(name: string): string | null {
        throw new Error("Method not implemented.");
    }
    setCookie(name: string, value: string) {
        throw new Error("Method not implemented.");
    }
}
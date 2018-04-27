import {CompileReflector, ExternalReference, Identifiers, getUrlScheme, syntaxError} from '@angular/compiler';

export class JitReflector implements CompileReflector {
    private reflectionCapabilities: ReflectionCapabilities;
    constructor() { this.reflectionCapabilities = new ReflectionCapabilities(); }
}
export class ExternalReference {
    constructor(public moduleName: string|null, public name: string|null, public runtime?: any|null) {
    }
    // Note: no isEquivalent method here as we use this as an interface too.
}
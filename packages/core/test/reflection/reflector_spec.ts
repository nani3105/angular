import {Reflector} from '@angular/core/src/reflection/reflector';
import { ReflectionCapabilities } from '@angular/core/src/reflection/reflection_capabilities';

class TestObj {
    constructor(public a: any, public b: any) {}

    identity(arg: any) { return arg; }
}

{
    describe('Reflector', () => {
        let reflector: Reflector;

        beforeEach(() => { reflector = new Reflector(new ReflectionCapabilities()); });

        describe('factory', () => {
            it('should create a factory for the given type', () => {
                const obj = reflector.factory(TestObj)(1, 2);
                expect(obj.a).toEqual(1);
                expect(obj.b).toEqual(2);
            });
        });

    });
}
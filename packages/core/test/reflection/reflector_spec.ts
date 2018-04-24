import {Reflector} from '@angular/core/src/reflection/reflector';
import { ReflectionCapabilities } from '@angular/core/src/reflection/reflection_capabilities';
import {makeDecorator, makeParamDecorator, makePropDecorator} from '@angular/core/src/util/decorators';

interface ClassDecoratorFactory {
    (data: ClassDecorator): any;
    new (data: ClassDecorator): ClassDecorator;
}

interface ClassDecorator {
    value: any;
}

interface ParamDecorator {
    value: any;
}

interface PropDecorator {
    value: any;
}

/** @Annotation */ const ClassDecorator =
    <ClassDecoratorFactory>makeDecorator('ClassDecorator', (data: any) => data);
/** @Annotation */ const ParamDecorator =
    makeParamDecorator('ParamDecorator', (value: any) => ({value}));
/** @Annotation */ const PropDecorator =
    makePropDecorator('PropDecorator', (value: any) => ({value}));

class AType {
    constructor(public value: any) {}
}

@ClassDecorator({value: 'class'})
class ClassWithDecorators {
    @PropDecorator('p1') @PropDecorator('p2') a: AType;

    b: AType;

    @PropDecorator('p3')
    set c(value: any) {}

    @PropDecorator('p4')
    someMethod() {}

    constructor(@ParamDecorator('a') a: AType, @ParamDecorator('b') b: AType) {
        this.a = a;
        this.b = b;
    }
}

class ClassWithoutDecorators {
    constructor(a: any, b: any) {}
}

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

        describe('parameters', () => {
            it('should return an array of parameters for a type', () => {
                const p = reflector.parameters(ClassWithDecorators);
                expect(p).toEqual([[AType, new ParamDecorator('a')], [AType, new ParamDecorator('b')]]);
            });

            it('should work for a class without annotations', () => {
                const p = reflector.parameters(ClassWithoutDecorators);
                expect(p.length).toEqual(2);
            });
        });

    });
}
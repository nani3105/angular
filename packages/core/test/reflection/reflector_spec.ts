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

            // See https://github.com/angular/tsickle/issues/261
            it('should read forwardRef down-leveled type', () => {
                class Dep {}
                class ForwardLegacy {
                    constructor(d: Dep) {}
                    // Older tsickle had a bug: wrote a forward reference
                    static ctorParameters = [{type: Dep}];
                }
                expect(reflector.parameters(ForwardLegacy)).toEqual([[Dep]]);
                class Forward {
                    constructor(d: Dep) {}
                    // Newer tsickle generates a functionClosure
                    static ctorParameters = () => [{type: ForwardDep}];
                }
                class ForwardDep {}
                expect(reflector.parameters(Forward)).toEqual([[ForwardDep]]);
            });
        });

        describe('propMetadata', () => {
            it('should return a string map of prop metadata for the given class', () => {
                const p = reflector.propMetadata(ClassWithDecorators);
                expect(p['a']).toEqual([new PropDecorator('p1'), new PropDecorator('p2')]);
                expect(p['c']).toEqual([new PropDecorator('p3')]);
                expect(p['someMethod']).toEqual([new PropDecorator('p4')]);
            });

            it('should also return metadata if the class has no decorator', () => {
                class Test {
                    @PropDecorator('test')
                    prop: any;
                }

                expect(reflector.propMetadata(Test)).toEqual({'prop': [new PropDecorator('test')]});
            });
        });

        describe('annotations', () => {
            it('should return an array of annotations for a type', () => {
                const p = reflector.annotations(ClassWithDecorators);
                expect(p).toEqual([new ClassDecorator({value: 'class'})]);
            });

            it('should work for a class without annotations', () => {
                const p = reflector.annotations(ClassWithoutDecorators);
                expect(p).toEqual([]);
            });
        });

        describe('getter', () => {
            it('returns a function reading a property', () => {
                const getA = reflector.getter('a');
                expect(getA(new TestObj(1, 2))).toEqual(1);
            });
        });

        describe('setter', () => {
            it('returns a function setting a property', () => {
                const setA = reflector.setter('a');
                const obj = new TestObj(1, 2);
                setA(obj, 100);
                expect(obj.a).toEqual(100);
            });
        });

        describe('method', () => {
            it('returns a function invoking a method', () => {
                const func = reflector.method('identity');
                const obj = new TestObj(1, 2);
                expect(func(obj, ['value'])).toEqual('value');
            });
        });


    });
}
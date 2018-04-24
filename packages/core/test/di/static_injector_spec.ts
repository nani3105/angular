import {Injector, Optional} from '@angular/core';
import {expect} from '@angular/platform-browser/testing/src/matchers';
import {InjectionToken} from '@angular/core/src/di/injection_token';

import {stringify} from '../../src/util';

class Engine {
    static PROVIDER = {provide: Engine, useClass: Engine, deps: []};
}


class Car {
    static PROVIDER = {provide: Car, useClass: Car, deps: [Engine]};
    constructor(public engine: Engine) {}
}

class CarWithOptionalEngine {
    static PROVIDER = {
        provide: CarWithOptionalEngine,
        useClass: CarWithOptionalEngine,
        deps: [[new Optional(), Engine]]
    };
    constructor(public engine: Engine) {}
}

class SportsCar extends Car {
    static PROVIDER = {provide: Car, useClass: SportsCar, deps: [Engine]};
}


{
    describe(`StaticInjector`, () => {
        it('should instantiate a class without dependencies', () => {
            const injector = Injector.create([Engine.PROVIDER]);
            const engine = injector.get(Engine);

            expect(engine).toBeAnInstanceOf(Engine);
        });

        it('should resolve dependencies based on type information', () => {
            const injector = Injector.create([Engine.PROVIDER, Car.PROVIDER]);
            const car = injector.get<Car>(Car);

            expect(car).toBeAnInstanceOf(Car);
            expect(car.engine).toBeAnInstanceOf(Engine);
        });

        it('should cache instances', () => {
            const injector = Injector.create([Engine.PROVIDER]);

            const e1 = injector.get(Engine);
            const e2 = injector.get(Engine);

            expect(e1).toBe(e2);
        });

        it('should provide to a value', () => {
            const injector = Injector.create([{provide: Engine, useValue: 'fake engine'}]);

            const engine = injector.get(Engine);
            expect(engine).toEqual('fake engine');
        });

        it('should inject dependencies instance of InjectionToken', () => {
            const TOKEN = new InjectionToken<string>('token');

            const injector = Injector.create([
                {provide: TOKEN, useValue: 'by token'},
                {provide: Engine, useFactory: (v: string) => v, deps: [[TOKEN]]},
            ]);

            const engine = injector.get(Engine);
            expect(engine).toEqual('by token');
        });

        it('should provide to a factory', () => {
            function sportsCarFactory(e: any) { return new SportsCar(e); }

            const injector = Injector.create(
                [Engine.PROVIDER, {provide: Car, useFactory: sportsCarFactory, deps: [Engine]}]);

            const car = injector.get<Car>(Car);
            expect(car).toBeAnInstanceOf(SportsCar);
            expect(car.engine).toBeAnInstanceOf(Engine);
        });

        it('should supporting provider to null', () => {
            const injector = Injector.create([{provide: Engine, useValue: null}]);
            const engine = injector.get(Engine);
            expect(engine).toBeNull();
        });

        it('should provide to an alias', () => {
            const injector = Injector.create([
                Engine.PROVIDER, {provide: SportsCar, useClass: SportsCar, deps: [Engine]},
                {provide: Car, useExisting: SportsCar}
            ]);

            const car = injector.get(Car);
            const sportsCar = injector.get(SportsCar);
            expect(car).toBeAnInstanceOf(SportsCar);
            expect(car).toBe(sportsCar);
        });

        it('should support multiProviders', () => {
            const injector = Injector.create([
                Engine.PROVIDER, {provide: Car, useClass: SportsCar, deps: [Engine], multi: true},
                {provide: Car, useClass: CarWithOptionalEngine, deps: [Engine], multi: true}
            ]);

            const cars = injector.get(Car) as any as Car[];
            expect(cars.length).toEqual(2);
            expect(cars[0]).toBeAnInstanceOf(SportsCar);
            expect(cars[1]).toBeAnInstanceOf(CarWithOptionalEngine);
        });

        it('should throw when the aliased provider does not exist', () => {
            const injector = Injector.create([{provide: 'car', useExisting: SportsCar}]);
            const e =
                `StaticInjectorError[car -> ${stringify(SportsCar)}]: \n  NullInjectorError: No provider for ${stringify(SportsCar)}!`;
            expect(() => injector.get('car')).toThrowError(e);
        });
    });
}
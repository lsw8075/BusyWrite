import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store, StoreModule } from '@ngrx/store';
import { Document } from '../models/document';
import { MainPageComponent } from './main-page.component';


import * as fromFile from '../reducers/reducer';
import * as FileAction from '../actions/file-action';
import * as RouterAction from '../../shared/route/route-action';
import { FileReducer } from '../reducers/reducer';

describe('MainPageComponent', () => {
    let comp: MainPageComponent;
    let fixture: ComponentFixture<MainPageComponent>;
    let store: Store<fromFile.State>;
    let dispatchSpy;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ MainPageComponent ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
            ],
            imports: [
                StoreModule.forRoot({
                    'file': FileReducer
                }),
            ]
        });
    }));

    beforeEach(async(() => {
        fixture = TestBed.createComponent(MainPageComponent);
        comp = fixture.componentInstance;
        store = fixture.debugElement.injector.get(Store);
        dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
        fixture.detectChanges();
    }));

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

    describe('open', () => {
        it('makes expected calls', fakeAsync(() => {
            comp.open(new Document(1, ''));
            tick();
            // expect(dispatchSpy.dispatch).toHaveBeenCalled();
        }));
    });

    describe('ngOnInit', () => {
        it('makes expected calls', () => {
            comp.ngOnInit();
            // expect(dispatchSpy.dispatch).toHaveBeenCalled();
        });
    });

    describe('create', () => {
        it('makes expected calls', () => {
            comp.create();
            // expect(dispatchSpy.dispatch).toHaveBeenCalled();
        });
    });

});

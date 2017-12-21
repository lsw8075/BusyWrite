import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store, StoreModule } from '@ngrx/store';
import { MatSnackBar } from '@angular/material';
import { SignUpComponent } from './sign-up.component';
import { FormsModule } from '@angular/forms';

import * as fromUser from '../../reducers/reducer';
import { UserReducer } from '../../reducers/reducer';



const matSnackBarStub = {
    open: () => ({})
};

describe('SignUpComponent', () => {
    let comp: SignUpComponent;
    let fixture: ComponentFixture<SignUpComponent>;
    let store: Store<fromUser.State>;

    beforeEach(() => {

        TestBed.configureTestingModule({
            declarations: [ SignUpComponent ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: MatSnackBar, useValue: matSnackBarStub },
            ],
            imports: [
                StoreModule.forRoot({
                    'user': UserReducer
                }),
                FormsModule
            ]
        });
        spyOn(SignUpComponent.prototype, 'showErrorMsg');
        fixture = TestBed.createComponent(SignUpComponent);
        comp = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

    // describe('onSubmit', () => {
    //     it('makes expected calls', () => {
    //         const storeStub = fixture.debugElement.injector.get(Store);
    //         spyOn(storeStub, 'dispatch');
    //         comp.onSubmit(NgFormStub);
    //         expect(storeStub.dispatch).toHaveBeenCalled();
    //     });
    // });

    // describe('constructor', () => {
    //     it('makes expected calls', () => {
    //         expect(comp.showErrorMsg).toHaveBeenCalled();
    //     });
    // });

});

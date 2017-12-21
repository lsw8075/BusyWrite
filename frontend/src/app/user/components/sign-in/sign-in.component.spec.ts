import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { MatSnackBar } from '@angular/material';
import { SignInComponent } from './sign-in.component';

import { Component, OnInit } from '@angular/core';
import * as fromUser from '../../reducers/reducer';
import { UserReducer } from '../../reducers/reducer';

const matSnackBarStub = {
    open: () => ({})
};

describe('SignInComponent', () => {
    let comp: SignInComponent;
    let fixture: ComponentFixture<SignInComponent>;

    beforeEach(() => {

        TestBed.configureTestingModule({
            declarations: [ SignInComponent ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: MatSnackBar, useValue: matSnackBarStub }
            ],
            imports: [
                StoreModule.forRoot({
                    'user': UserReducer
                }),
                FormsModule
            ]
        });
        spyOn(SignInComponent.prototype, 'showErrorMsg');
        fixture = TestBed.createComponent(SignInComponent);
        comp = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

    describe('onSubmit', () => {

    });

    describe('constructor', () => {
        it('makes expected calls', () => {

        });
    });

    describe('signup', () => {

    });

});

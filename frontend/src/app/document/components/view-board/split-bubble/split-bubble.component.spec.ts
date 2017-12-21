import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BubbleService } from '../service';
import { EventBubbleService } from '../service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Store, StoreModule } from '@ngrx/store';
import { SplitBubbleComponent } from './split-bubble.component';

import * as fromDocument from '../../../reducers/reducer';
import * as DocumentAction from '../../../actions/bubble-action';
import * as RouterAction from '../../../../shared/route/route-action';
import { reducer } from '../../../reducers/reducer';

describe('SplitBubbleComponent', () => {
    let comp: SplitBubbleComponent;
    let fixture: ComponentFixture<SplitBubbleComponent>;

    beforeEach(() => {
        const bubbleServiceStub = {};
        const eventBubbleServiceStub = {};
        const bsModalRefStub = {};
        const storeStub = {
            dispatch: () => ({})
        };
        TestBed.configureTestingModule({
            declarations: [ SplitBubbleComponent ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: BubbleService, useValue: bubbleServiceStub },
                { provide: EventBubbleService, useValue: eventBubbleServiceStub },
                { provide: BsModalRef, useValue: bsModalRefStub },
            ],
            imports: [
                StoreModule.forRoot({
                    'document': reducer
                }),
            ]
        });
        fixture = TestBed.createComponent(SplitBubbleComponent);
        comp = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

    it('mouseDown defaults to: false', () => {
        expect(comp.mouseDown).toEqual(false);
    });

    it('highlightOffset defaults to: 0', () => {
        expect(comp.highlightOffset).toEqual(0);
    });

});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BubbleService } from '../service';
import { EventBubbleService } from '../service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { SplitBubbleComponent } from './split-bubble.component';

describe('SplitBubbleComponent', () => {
    let comp: SplitBubbleComponent;
    let fixture: ComponentFixture<SplitBubbleComponent>;

    beforeEach(() => {
        const bubbleServiceStub = {};
        const eventBubbleServiceStub = {};
        const bsModalRefStub = {};
        TestBed.configureTestingModule({
            declarations: [ SplitBubbleComponent ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: BubbleService, useValue: bubbleServiceStub },
                { provide: EventBubbleService, useValue: eventBubbleServiceStub },
                { provide: BsModalRef, useValue: bsModalRefStub }
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

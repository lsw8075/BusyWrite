import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BubbleService } from '../service';
import { BoardService } from '../../../service/board.service';
import { PreviewComponent } from './preview.component';

describe('PreviewComponent', () => {
    let comp: PreviewComponent;
    let fixture: ComponentFixture<PreviewComponent>;

    beforeEach(() => {
        const bubbleServiceStub = {
            getRootBubble: () => ({
                then: () => ({})
            })
        };
        const boardServiceStub = {
            previewUpdateEvent$: {
                subscribe: () => ({})
            }
        };
        TestBed.configureTestingModule({
            declarations: [ PreviewComponent ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: BubbleService, useValue: bubbleServiceStub },
                { provide: BoardService, useValue: boardServiceStub }
            ]
        });
        spyOn(PreviewComponent.prototype, 'refreshList');
        fixture = TestBed.createComponent(PreviewComponent);
        comp = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

    describe('constructor', () => {
        it('makes expected calls', () => {
            expect(PreviewComponent.prototype.refreshList).toHaveBeenCalled();
        });
    });

    describe('ngOnInit', () => {
        it('makes expected calls', () => {
            (<jasmine.Spy>comp.refreshList).calls.reset();
            comp.ngOnInit();
            expect(comp.refreshList).toHaveBeenCalled();
        });
    });

    describe('refreshList', () => {
        it('makes expected calls', () => {
            const bubbleServiceStub: BubbleService = fixture.debugElement.injector.get(BubbleService);
            spyOn(bubbleServiceStub, 'getRootBubble');
            (<jasmine.Spy>comp.refreshList).and.callThrough();
            comp.refreshList();
            expect(bubbleServiceStub.getRootBubble).toHaveBeenCalled();
        });
    });

});

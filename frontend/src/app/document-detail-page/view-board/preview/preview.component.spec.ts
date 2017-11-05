import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BubbleService } from '../view-board.component';
import { Bubble } from '../view-board.component';
import { PreviewComponent } from './preview.component';

describe('PreviewComponent', () => {
    let comp: PreviewComponent;
    let fixture: ComponentFixture<PreviewComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ PreviewComponent ],
            providers: [
            ]
        });
        fixture = TestBed.createComponent(PreviewComponent);
        comp = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

    it('contentList defaults to: []', () => {
        expect(comp.contentList).toEqual([]);
    });

});

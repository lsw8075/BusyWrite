import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BubbleService, BoardService, EditItem } from '../../service';
import { Bubble, BubbleType, LeafBubble, InternalBubble } from '../../../models/bubble';
import { Component } from '@angular/core';
import { PreviewComponent } from './preview.component';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

const mockLeafBubble = {
  id: 2,
  type: BubbleType.leafBubble,
  location: 0,
  owner: 0,
  editLock: false,
  content: 'mock leaf bubble',
  parentID: 1,
  parentBubble: null,
  suggestBubbles: null,
  comments: null,
};

const mockInternalBubble = {
  id: 1,
  type: BubbleType.internalBubble,
  location: 0,
  editLock: false,

  parentID: 0,
  parentBubble: null,
  suggestBubbles: null,
  childBubbles: [2],
  childBubbleList: [mockLeafBubble],
  comments: null
};

class MockBubbleService {
  getRootBubble() {}
}

class MockBoardService {

  private previewUpdateEventSource = new Subject<void>();
  private createBubbleEventSource = new Subject<EditItem>();
  private finishBubbleEditEventSource = new Subject<Bubble>();

  previewUpdateEvent$ = this.previewUpdateEventSource.asObservable();
  createBubbleEvent$ = this.createBubbleEventSource.asObservable();
  finishBubbleEditEvent$ = this.finishBubbleEditEventSource.asObservable();

}

describe('PreviewComponent', () => {
  let comp: PreviewComponent;
  let fixture: ComponentFixture<PreviewComponent>;
  let bubbleService: BubbleService;
  let boardService: BoardService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PreviewComponent
      ],
      providers: [
        {provide: BubbleService, useClass: MockBubbleService},
        { provide: BoardService, useClass: MockBoardService },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewComponent);
    comp = fixture.componentInstance;
    bubbleService = fixture.debugElement.injector.get(BubbleService);
    boardService = fixture.debugElement.injector.get(BoardService);

    spyOn(boardService, 'previewUpdateEvent$').and.returnValue(Observable.of(null));
  });

  it('can instantiate it', () => {
    expect(comp).not.toBeNull();
  });


});

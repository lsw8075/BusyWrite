import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Bubble } from '../../../models/bubble';
import { Component, Input } from '@angular/core';

import { BubbleMenuComponent } from './bubble-menu.component';
import { MenuType } from '../service';
import { BubbleService, EventBubbleService, BoardService } from '../service';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

class MockBubbleService {

}

class MockEventBubbleService {

  openSangjunBoard() {}
  splitBubble() {}
  popBubble() {}
  wrapBubble() {}
  createBubble() {}
  editBubble() {}
  flattenBubble() {}
  deleteBubble() {}

  }

describe('BubbleMenuComponent', () => {
    let comp: BubbleMenuComponent;
    let fixture: ComponentFixture<BubbleMenuComponent>;
    let bubbleService: BubbleService;
    let eventBubbleService: EventBubbleService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ BubbleMenuComponent ],
            providers: [
              { provide: BubbleService, useClass: MockBubbleService },
              { provide: EventBubbleService, useClass: MockEventBubbleService },
            ]
        }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(BubbleMenuComponent);
      comp = fixture.componentInstance;
      bubbleService = fixture.debugElement.injector.get(BubbleService);
      eventBubbleService = fixture.debugElement.injector.get(EventBubbleService);
    });

    it('can instantiate it', () => {
      expect(comp).not.toBeNull();
    });

    it('should create the app', () => {
      expect(comp).toBeTruthy();
    });
    describe('openSangjunBoard', () => {
      it('makes expected calls', () => {
          spyOn(eventBubbleService, 'openSangjunBoard');
          comp.openSangjunBoard();
          expect(eventBubbleService.openSangjunBoard).toHaveBeenCalled();
      });
  });

  describe('splitBubble', () => {
      it('makes expected calls', () => {
          spyOn(eventBubbleService, 'splitBubble');
          comp.splitBubble();
          expect(eventBubbleService.splitBubble).toHaveBeenCalled();
      });
  });

  describe('wrapBubble', () => {
      it('makes expected calls', () => {
          spyOn(eventBubbleService, 'wrapBubble');
          comp.wrapBubble();
          expect(eventBubbleService.wrapBubble).toHaveBeenCalled();
      });
  });

  describe('createBubble', () => {
      it('makes expected calls', () => {
          spyOn(eventBubbleService, 'createBubble');
          comp.createBubble();
          expect(eventBubbleService.createBubble).toHaveBeenCalled();
      });
  });

  describe('deleteBubble', () => {
      it('makes expected calls', () => {
          spyOn(eventBubbleService, 'deleteBubble');
          comp.deleteBubble();
          expect(eventBubbleService.deleteBubble).toHaveBeenCalled();
      });
  });

  describe('flattenBubble', () => {
      it('makes expected calls', () => {
          spyOn(eventBubbleService, 'flattenBubble');
          comp.flattenBubble();
          expect(eventBubbleService.flattenBubble).toHaveBeenCalled();
      });
  });

});

import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Bubble, BubbleService } from '../service';
import { Component, Input } from '@angular/core';

import { BubbleMenuComponent } from './bubble-menu.component';
import { MenuType } from '../service';

class MockBubbleService {

}

describe('BubbleMenuComponent', () => {
    let comp: BubbleMenuComponent;
    let fixture: ComponentFixture<BubbleMenuComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ BubbleMenuComponent ],
            providers: [
              { provide: BubbleService, useClass: MockBubbleService },
            ]
        }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(BubbleMenuComponent);
      comp = fixture.componentInstance;
    });

    it('can instantiate it', () => {
      expect(comp).not.toBeNull();
    });

    it('should create the app', () => {
      expect(comp).toBeTruthy();
    });

    // it('should set menuType and bubble when showMenu is called', () => {
    //   const menuType = MenuType.borderMenu;
    //   const bubble = new LeafBubble();
    //   const item = {
    //     menuType, bubble
    //   };
    //   comp.showMenu(item);
    //   fixture.detectChanges();
    //   expect(comp.bubble).toEqual(bubble);
    //   expect(comp.menuType).toEqual(menuType);
    // });

    // it('isBorderMenu should return true if menutype is border menu', () => {
    //   const menuType = MenuType.borderMenu;
    //   const bubble = null;
    //   const item = {
    //     menuType, bubble
    //   };
    //   comp.showMenu(item);
    //   fixture.detectChanges();
    //   expect(comp.isBorderMenu()).toBeTruthy();
    // });

    // it('isBorderMenu should return false if menutype is not border menu', () => {
    //   const menuType = MenuType.bubbleMenu;
    //   const bubble = null;
    //   const item = {
    //     menuType, bubble
    //   };
    //   comp.showMenu(item);
    //   expect(comp.isBorderMenu()).toBeFalsy();
    // });

    // it('isLeafBubbleMenu should return true if menutype is bubble menu and bubble is leaf bubble', () => {
    //   const menuType = MenuType.bubbleMenu;
    //   const bubble = new LeafBubble();
    //   const item = {
    //     menuType, bubble
    //   };
    //   comp.showMenu(item);
    //   expect(comp.isLeafBubbleMenu()).toBeTruthy();
    // });

    // it('isLeafBubbleMenu should return false if menutype is bubble menu and bubble is internal bubble', () => {
    //   const menuType = MenuType.bubbleMenu;
    //   const bubble = new InternalBubble();
    //   const item = {
    //     menuType, bubble
    //   };
    //   comp.showMenu(item);
    //   expect(comp.isLeafBubbleMenu()).toBeFalsy();
    // });

    // it('isLeafBubbleMenu should return false if menutype is border menu and bubble is leaf bubble', () => {
    //   const menuType = MenuType.borderMenu;
    //   const bubble = new LeafBubble();
    //   const item = {
    //     menuType, bubble
    //   };
    //   comp.showMenu(item);
    //   expect(comp.isLeafBubbleMenu()).toBeFalsy();
    // });

    // it('isLeafBubbleMenu should return false if menutype is border menu and bubble is internal bubble', () => {
    //   const menuType = MenuType.borderMenu;
    //   const bubble = new InternalBubble();
    //   const item = {
    //     menuType, bubble
    //   };
    //   comp.showMenu(item);
    //   expect(comp.isLeafBubbleMenu()).toBeFalsy();
    // });

    // it('isInternalBubbleMenu should return true if menutype is bubble menu and bubble is internal bubble', () => {
    //   const menuType = MenuType.bubbleMenu;
    //   const bubble = new InternalBubble();
    //   const item = {
    //     menuType, bubble
    //   };
    //   comp.showMenu(item);
    //   expect(comp.isInternalBubbleMenu()).toBeTruthy();
    // });

    // it('isInternalBubbleMenu should return false if menutype is bubble menu and bubble is leaf bubble', () => {
    //   const menuType = MenuType.bubbleMenu;
    //   const bubble = new LeafBubble();
    //   const item = {
    //     menuType, bubble
    //   };
    //   comp.showMenu(item);
    //   expect(comp.isInternalBubbleMenu()).toBeFalsy();
    // });

    // it('isInternalBubbleMenu should return false if menutype is border menu ', () => {
    //   const menuType = MenuType.borderMenu;
    //   const bubble = null;
    //   const item = {
    //     menuType, bubble
    //   };
    //   comp.showMenu(item);
    //   expect(comp.isInternalBubbleMenu()).toBeFalsy();
    // });

});

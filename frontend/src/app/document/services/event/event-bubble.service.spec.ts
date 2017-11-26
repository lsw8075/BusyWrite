import { async, inject, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { Observable } from 'rxjs/Observable';

import { EventBubbleService, ActionType, MenuType } from './event-bubble.service';
import { BubbleService } from '../bubble.service';

describe('EventBubbleService', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        EventBubbleService,
      ]
    });
  }));

  it('can instantiate service when injecting service',
  inject([EventBubbleService], (service: EventBubbleService) => {
    expect(service instanceof EventBubbleService).toBe(true);
  }));

  it('can set state with new nextState',
  inject([EventBubbleService], (service: EventBubbleService) => {
    service.setState(ActionType.wrap);
    expect(service.getActionState()).toEqual(ActionType.wrap);
    service.setState(ActionType.create);
  }));

  it('can clear state',
  inject([EventBubbleService], (service: EventBubbleService) => {
    service.clearState();
    expect(service.getActionState()).toEqual(ActionType.none);
  }));

  it('can select bubble in single select mode',
  fakeAsync(() => {
    const bubbleService = new BubbleService();
    const eventBubbleService = new EventBubbleService();
    tick();
    let bubble = bubbleService.getBubbleById(2);
    eventBubbleService.setState(ActionType.create);
    eventBubbleService.selectBubble(bubble, MenuType.leafMenu);
    expect(eventBubbleService.getActionState()).toEqual(ActionType.create);
  }));

  it('can select bubble in multiple select mode',
  fakeAsync(() => {
    const bubbleService = new BubbleService();
    const eventBubbleService = new EventBubbleService();
    eventBubbleService.setState(ActionType.wrap);
    tick();
    let b1 = bubbleService.getBubbleById(15);
    eventBubbleService.wrapBubbles = [b1];
    eventBubbleService.selectBubble(b1, MenuType.leafMenu);
  }));

  it('can select bubble in multiple select mode',
  fakeAsync(() => {
    const bubbleService = new BubbleService();
    const eventBubbleService = new EventBubbleService();
    eventBubbleService.setState(ActionType.wrap);
    tick();
    let b1 = bubbleService.getBubbleById(15);
    let b2 = bubbleService.getBubbleById(8);
    eventBubbleService.wrapBubbles = [b1];
    eventBubbleService.selectBubble(b2, MenuType.leafMenu);
  }));

  it('can select bubble in multiple select mode',
  fakeAsync(() => {
    const bubbleService = new BubbleService();
    const eventBubbleService = new EventBubbleService();
    eventBubbleService.setState(ActionType.wrap);
    tick();
    let b1 = bubbleService.getBubbleById(15);
    let b2 = bubbleService.getBubbleById(1);
    eventBubbleService.wrapBubbles = [b1];
    eventBubbleService.selectBubble(b2, MenuType.leafMenu);
  }));

  it('can get wheter bubble is selected or not in singleSelect',
  fakeAsync(() => {
    const bubbleService = new BubbleService();
    const eventBubbleService = new EventBubbleService();
    tick();
    let bubble = bubbleService.getBubbleById(2);
    eventBubbleService.setState(ActionType.create);
    eventBubbleService.selectBubble(bubble, MenuType.leafMenu);
    eventBubbleService.selectedBubble = bubble;
    expect(eventBubbleService.isBubbleSelected(bubble)).toBeTruthy();
  }));

  it('can get wheter bubble is selected or not in multipleSelect',
  fakeAsync(() => {
    const bubbleService = new BubbleService();
    const eventBubbleService = new EventBubbleService();
    eventBubbleService.setState(ActionType.wrap);
    tick();
    let b1 = bubbleService.getBubbleById(15);
    let b2 = bubbleService.getBubbleById(8);
    eventBubbleService.wrapBubbles = [b1];
    expect(eventBubbleService.isBubbleSelected(b2)).toBeFalsy();
    eventBubbleService.selectBubble(b2, MenuType.leafMenu);
    expect(eventBubbleService.isBubbleSelected(b2)).toBeFalsy();
  }));

  it('can get wheter bubble is being editted or not',
  fakeAsync(() => {
    const bubbleService = new BubbleService();
    const eventBubbleService = new EventBubbleService();
    eventBubbleService.setState(ActionType.wrap);
    tick();
    let b1 = bubbleService.getBubbleById(1);
    eventBubbleService.edittedBubble = b1;
    expect(eventBubbleService.isBeingEditted(b1)).toBeTruthy();
    eventBubbleService.edittedBubble = null;
    expect(eventBubbleService.isBeingEditted(b1)).toBeFalsy();
  }));

  it('can not get wheter menu is being opened or not when multipleSelect',
  fakeAsync(() => {
    const bubbleService = new BubbleService();
    const eventBubbleService = new EventBubbleService();
    eventBubbleService.setState(ActionType.wrap);
    tick();
    let b1 = bubbleService.getBubbleById(1);
    expect(eventBubbleService.isMenuOpen(b1, MenuType.multipleBubble)).toBeFalsy();
  }));

  it('can get wheter menu is being opened or not when singleSelect',
  fakeAsync(() => {
    const bubbleService = new BubbleService();
    const eventBubbleService = new EventBubbleService();
    tick();
    let b1 = bubbleService.getBubbleById(1);
    eventBubbleService.setState(ActionType.create);
    eventBubbleService.selectBubble(b1, MenuType.leafMenu);
    expect(eventBubbleService.isMenuOpen(b1, MenuType.multipleBubble)).toBeFalsy();
    expect(eventBubbleService.isMenuOpen(b1, MenuType.leafMenu)).toBeTruthy();
  }));

  it('can openSangjunBoard',
  fakeAsync(() => {
    const bubbleService = new BubbleService();
    const eventBubbleService = new EventBubbleService();
    tick();
    let b1 = bubbleService.getBubbleById(1);
    eventBubbleService.openSangjunBoard(b1);
  }));

  it('can splitBubble',
  fakeAsync(() => {
    const bubbleService = new BubbleService();
    const eventBubbleService = new EventBubbleService();
    tick();
    let b1 = bubbleService.getBubbleById(1);
    eventBubbleService.splitBubble(b1);
  }));

  it('can popBubble',
  fakeAsync(() => {
    const bubbleService = new BubbleService();
    const eventBubbleService = new EventBubbleService();
    tick();
    let b1 = bubbleService.getBubbleById(1);
    eventBubbleService.popBubble(b1);
  }));

  it('can wrapBubble',
  fakeAsync(() => {
    const bubbleService = new BubbleService();
    const eventBubbleService = new EventBubbleService();
    tick();
    let b1 = bubbleService.getBubbleById(1);
    eventBubbleService.wrapBubble(b1);
  }));

  it('can createBubble',
  fakeAsync(() => {
    const bubbleService = new BubbleService();
    const eventBubbleService = new EventBubbleService();
    tick();
    let b1 = bubbleService.getBubbleById(1);
    eventBubbleService.createBubble(b1, MenuType.leafMenu);
  }));

  it('can editBubble',
  fakeAsync(() => {
    const bubbleService = new BubbleService();
    const eventBubbleService = new EventBubbleService();
    tick();
    let b1 = bubbleService.getBubbleById(1);
    eventBubbleService.editBubble(b1);
  }));

  it('can deleteBubble',
  fakeAsync(() => {
    const bubbleService = new BubbleService();
    const eventBubbleService = new EventBubbleService();
    tick();
    let b1 = bubbleService.getBubbleById(1);
    eventBubbleService.deleteBubble(b1);
  }));

  it('can flattenBubble',
  fakeAsync(() => {
    const bubbleService = new BubbleService();
    const eventBubbleService = new EventBubbleService();
    tick();
    let b1 = bubbleService.getBubbleById(1);
    eventBubbleService.flattenBubble(b1);
  }));

});

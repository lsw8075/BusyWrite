import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { SuggestBubbleTemp } from '../../models/bubble-temp';

@Injectable()
export class EventSangjunBoardService {

  private _backButtonClickEventSource = new Subject<void>();
  private _switchClickEventSource = new Subject<SuggestBubbleTemp>();
  private _editClickEventSource = new Subject<SuggestBubbleTemp>();
  private _deleteClickEventSource = new Subject<SuggestBubbleTemp>();
  private _thumbsUpClickEventSource = new Subject<SuggestBubbleTemp>();

  _backButtonClickEvent$ = this._backButtonClickEventSource.asObservable();
  _switchClickEvent$ = this._switchClickEventSource.asObservable();
  _editClickEvent$ = this._editClickEventSource.asObservable();
  _deleteClickEvent$ = this._deleteClickEventSource.asObservable();
  _thumbsUpClickEvent$ = this._thumbsUpClickEventSource.asObservable();

  constructor() {
  }

  public clickBackButton() {
    this._backButtonClickEventSource.next();
  }

  public clickSwitch(suggestBubble: SuggestBubbleTemp) {
    this._switchClickEventSource.next(suggestBubble);
  }

  public clickEdit(suggestBubble: SuggestBubbleTemp) {
    this._editClickEventSource.next(suggestBubble);
  }

  public clickDelete(suggestBubble: SuggestBubbleTemp) {
    this._deleteClickEventSource.next(suggestBubble);
  }

  public clickThumbsUp(suggestBubble: SuggestBubbleTemp) {
    this._thumbsUpClickEventSource.next(suggestBubble);
  }

}

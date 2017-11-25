import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { SuggestBubble } from '../../model/bubble';

@Injectable()
export class EventSangjunBoardService {

  private _backButtonClickEventSource = new Subject<void>();
  private _switchClickEventSource = new Subject<SuggestBubble>();
  private _editClickEventSource = new Subject<SuggestBubble>();
  private _deleteClickEventSource = new Subject<SuggestBubble>();
  private _thumbsUpClickEventSource = new Subject<SuggestBubble>();

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

  public clickSwitch(suggestBubble: SuggestBubble) {
    this._switchClickEventSource.next(suggestBubble);
  }

  public clickEdit(suggestBubble: SuggestBubble) {
    this._editClickEventSource.next(suggestBubble);
  }

  public clickDelete(suggestBubble: SuggestBubble) {
    this._deleteClickEventSource.next(suggestBubble);
  }

  public clickThumbsUp(suggestBubble: SuggestBubble) {
    this._thumbsUpClickEventSource.next(suggestBubble);
  }

}

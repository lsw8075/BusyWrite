import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class EventSangjunBoardService {

  private _backButtonClickEventSource = new Subject<void>();

  _backButtonClickEvent$ = this._backButtonClickEventSource.asObservable();

  constructor() {
  }

  public clickBackButton() {
    this._backButtonClickEventSource.next();
  }
  
}

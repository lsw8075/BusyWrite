import { Component, OnInit } from '@angular/core';
import { DirectoryService } from '../services/directory.service';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromFile from '../reducers/reducer';
import * as FileAction from '../actions/file-action';
import * as RouterAction from '../../shared/route/route-action';

import { FileSystemEntity } from '../models/file-system-entity';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

    fileList$: Observable<FileSystemEntity[]>;

    constructor(private _store: Store<fromFile.State>) {
        this.fileList$ = this._store.select(fromFile.getFileList);
    }

    ngOnInit() {
        this._store.dispatch(new FileAction.Load());
    }

    public open(document: FileSystemEntity) {
        this._store.dispatch(new RouterAction.GoByUrl(`/documents/${document.id}`));
    }

    public create() {
        this._store.dispatch(new FileAction.Create());
    }

}

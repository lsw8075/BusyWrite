import { Component, OnInit } from '@angular/core';
import { AlertService } from '../service/alert.service';
import { DirectoryService } from '../service/directory.service';
import { DocumentService } from '../service/document.service';
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

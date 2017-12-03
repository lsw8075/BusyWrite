import { async, inject, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { DocumentService } from './document.service';

describe('DocumentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DocumentService
      ]
    });
  });

  it('can instantiate service when injecting service',
  inject([DocumentService], (service: DocumentService) => {
    expect(service instanceof DocumentService).toBe(true);
  }));

  it('can get title',
  inject([DocumentService], (service: DocumentService) => {
    service.getTitle().then((title) => expect(title).toEqual('BusyWrite Demo Document'));
  }));

  it('can not set invalid title',
  fakeAsync(() => {
    const service = new DocumentService();
    tick();
    expect(function() { service.setTitle(''); tick(); }).toThrowError();
  }));

  it('can set title',
  inject([DocumentService], (service: DocumentService) => {
    service.setTitle('BusyWrite').then((res) => expect(res).toBeUndefined());
  }));

  it('can not set title when its length is over 60',
  inject([DocumentService], (service: DocumentService) => {
    service.setTitle('BusyWrite is the perfect solution for team writing. The concept of writing as a team has been around for a long time, by services like Google Docs, but the approaches are impractical and unproductive.').then((res) => expect(res).toBeFalsy());
  }));

});

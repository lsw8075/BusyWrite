import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {

  @Output()
  public appClickOutside = new EventEmitter<void>();

  constructor(private _elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!this._elementRef.nativeElement.contains(event.target)) {
      this.appClickOutside.emit(null);
    }
  }
}

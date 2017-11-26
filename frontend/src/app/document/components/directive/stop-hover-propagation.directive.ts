import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appStopHoverPropagation]'
})
export class StopHoverPropagationDirective {

  @HostListener('mouseover', ['$event'])
  public onClick(event: any): void {
      event.stopPropagation();
  }
}

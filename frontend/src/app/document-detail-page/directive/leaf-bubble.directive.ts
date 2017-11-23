import { Directive, ElementRef, Renderer2, HostListener, HostBinding, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { EventBubbleService } from '../service';
import { Bubble } from '../service';

@Directive({
  selector: '[appLeafBubble]'
})
export class LeafBubbleDirective implements OnInit {

  @Input() appLeafBubble: Bubble;

  private lineWidth = 2;
  private selectedColor = `rgb(157, 172, 255)`;
  private editColor = `red`;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private _eventBubbleService: EventBubbleService) {}

  ngOnInit() {
    this.setLeafBubbleStyle();
  }

  @HostBinding('style.background-color')
  public get backgroundColor(): string {
    if (this._eventBubbleService.isBubbleSelected(this.appLeafBubble)) {
      return this.selectedColor;
    }
    if (this._eventBubbleService.isBeingEditted(this.appLeafBubble)) {
      return this.editColor;
    }
  }

  public setLeafBubbleStyle(): void {
    this.renderer.setStyle(this.el.nativeElement, 'border-left-width', `${this.lineWidth}px`);
    this.renderer.setStyle(this.el.nativeElement, 'border-right-width', `${this.lineWidth}px`);
  }

  @HostListener('mouseenter') onMouseEnter() {

  }

  @HostListener('mouseleave') onMouseLeave() {

  }

}

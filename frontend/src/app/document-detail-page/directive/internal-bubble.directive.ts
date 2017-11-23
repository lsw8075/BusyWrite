import { Directive, ElementRef, Renderer2, HostListener, HostBinding, Input, OnInit } from '@angular/core';
import { EventBubbleService } from '../service';
import { Bubble } from '../service';

@Directive({
  selector: '[appInternalBubble]'
})
export class InternalBubbleDirective implements OnInit {

  @Input() appInternalBubble: Bubble;

  private lineWidth = 2;
  private space = 8;
  private offset = -5;
  private selectedColor = `rgb(157, 172, 255)`;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private _eventBubbleService: EventBubbleService) {}

  ngOnInit() {
    this.setInternalBubbleStyle();
  }

  @HostBinding('style.background-color')
  public get backgroundColor(): string {
    if (this._eventBubbleService.isBubbleSelected(this.appInternalBubble)) {
      return this.selectedColor;
    }
  }

  @HostBinding('style.margin')
  public get margin(): string {
    const height = this.appInternalBubble.getHeight();
    return `0px -${this.offset + height * this.space}px`;
  }

  @HostBinding('style.padding')
  public get padding(): string {
    const height = this.appInternalBubble.getHeight();
    return `0px ${this.offset + height * this.space - this.lineWidth}px`;
  }

  public setInternalBubbleStyle(): void {
    this.renderer.setStyle(this.el.nativeElement, 'border-left-width', `${this.lineWidth}px`);
    this.renderer.setStyle(this.el.nativeElement, 'border-right-width', `${this.lineWidth}px`);
  }

}

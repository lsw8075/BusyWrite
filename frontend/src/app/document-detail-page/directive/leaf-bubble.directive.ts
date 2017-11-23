import { Directive, ElementRef, Renderer2, HostListener, HostBinding, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { EventBubbleService } from '../service';
import { Bubble } from '../service';

@Directive({
  selector: '[appLeafBubble]'
})
export class LeafBubbleDirective implements OnInit {

  @Input() appLeafBubble: Bubble;

  private lineWidth = 3;
  private selectedColor = `rgb(157, 172, 255)`;
  private editColor = `rgb(100, 100, 100)`;

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

  @HostBinding('style.color')
  public get color(): string {
    if (this._eventBubbleService.isBeingEditted(this.appLeafBubble)) {
      return 'white';
    }
  }

  public setLeafBubbleStyle(): void {
    this.renderer.setStyle(this.el.nativeElement, 'border-left-width', `${this.lineWidth}px`);
    this.renderer.setStyle(this.el.nativeElement, 'border-right-width', `${this.lineWidth}px`);
    if (!this.isBubbleContentShown(this.appLeafBubble)) {
      this.renderer.setStyle(this.el.nativeElement, 'background-color', '#aaa');
      this.renderer.setStyle(this.el.nativeElement, 'color', 'white');
    }
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.renderer.setStyle(this.el.nativeElement, 'background-color', `rgba(157, 172, 255, 0.4)`);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (this._eventBubbleService.isBubbleSelected(this.appLeafBubble)) {
      this.renderer.setStyle(this.el.nativeElement, 'background-color', this.selectedColor);
    } else if (this._eventBubbleService.isBeingEditted(this.appLeafBubble)) {
      this.renderer.setStyle(this.el.nativeElement, 'background-color', this.editColor);
    } else if (!this.isBubbleContentShown(this.appLeafBubble)) {
      this.renderer.setStyle(this.el.nativeElement, 'background-color', '#aaa');
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'background-color', `transparent`);
    }
  }

  @HostListener('mouseup')
  private showSelectedText(bubble: Bubble) {
    let text = '';
    let startOffset = 0;
    if (window.getSelection) {
        text = window.getSelection().toString();
        startOffset = window.getSelection().getRangeAt(0).startOffset;
        console.log(window.getSelection().getRangeAt(0));
    } else if ((document as any).selection && (document as any).selection.type !== 'Control') {
        text = (document as any).selection.createRange().text;
        startOffset = (document as any).selection.createRange().startOffset;
    }
    console.log(text, startOffset);
    this._eventBubbleService.hightlightedText = text;
    this._eventBubbleService.highlightOffset = startOffset;
  }

  public isBubbleContentShown(bubble): boolean {
    return (bubble.whoIsEditting() === -1) ||
           (bubble.whoIsEditting() === 1);
  }
}

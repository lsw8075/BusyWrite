import { Directive, ElementRef, Renderer2, HostListener, HostBinding, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { EventBubbleService } from '../service';
import { Bubble, LeafBubble } from '../../models/bubble';

@Directive({
    selector: '[appLeafBubble]'
})
export class LeafBubbleDirective implements OnInit {

    @Input() appLeafBubble: LeafBubble;
    @Input() isSelected: boolean;

    private selectedColor = `rgb(157, 172, 255)`;
    private editColor = `rgb(200, 230, 200)`;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private _eventBubbleService: EventBubbleService) {}

    ngOnInit() {}

    @HostBinding('style.background-color')
    public get backgroundColor(): string {
        if (this.isSelected) {
        return this.selectedColor;
        }
        if (this._isBeingEditted()) {
            return this.editColor;
        }
    }

    @HostListener('mouseenter')
    onMouseEnter() {
        this.renderer.setStyle(this.el.nativeElement, 'background-color', `rgba(157, 172, 255, 0.4)`);
    }

  @HostListener('mouseleave')
    onMouseLeave() {
        if (this.isSelected) {
            this.renderer.setStyle(this.el.nativeElement, 'background-color', this.selectedColor);
        } else if (this._isBeingEditted()) {
            this.renderer.setStyle(this.el.nativeElement, 'background-color', this.editColor);
        } else {
            this.renderer.setStyle(this.el.nativeElement, 'background-color', `transparent`);
        }
    }

    private _isBeingEditted(): boolean {
        return this.appLeafBubble.editLockHolder !== null;
    }

}

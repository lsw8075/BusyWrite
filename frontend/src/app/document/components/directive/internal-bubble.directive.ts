import { Directive, ElementRef, Renderer2, HostListener, HostBinding, Input, OnInit } from '@angular/core';
import { EventBubbleService } from '../service';
import { Bubble, InternalBubble, BubbleType, LeafBubble } from '../../models/bubble';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromBubble from '../../reducers/bubble-reducer';
import * as fromDocument from '../../reducers/reducer';
import * as BubbleAction from '../../actions/bubble-action';

import { getBubbleById } from '../../reducers/bubble-operation';

@Directive({
  selector: '[appInternalBubble]'
})
export class InternalBubbleDirective implements OnInit {

    @Input() appInternalBubble: InternalBubble;
    @Input() bubbleList: Array<Bubble>;
    @Input() isSelected: boolean;
    @Input() isHover: boolean;

    private lineWidth = 3;
    private space = 10;
    private offset = -5;
    private selectedColor = `rgb(157, 172, 255)`;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private _store: Store<fromDocument.State>,
        private _eventBubbleService: EventBubbleService) {}

    ngOnInit() {
        this.setInternalBubbleStyle();
    }

    @HostBinding('style.background-color')
    public get backgroundColor(): string {
        if (this.isSelected) {
            return this.selectedColor;
        }
    }

    @HostBinding('style.border-left-color')
    public get borderLeftColor(): string {
        if (this._isBeingEditted(this.appInternalBubble)) {
            return `green`;
        } else if (this._isParentRoot(this.appInternalBubble)) {
            return this.selectedColor;
        } else {
            return (this.isHover) ? this.selectedColor : 'transparent';
        }
    }

    @HostBinding('style.border-right-color')
    public get borderRightColor(): string {
        if (this._isBeingEditted(this.appInternalBubble)) {
            return `green`;
        } else if (this._isParentRoot(this.appInternalBubble)) {
            return this.selectedColor;
        } else {
            return (this.isHover) ? this.selectedColor : 'transparent';
        }
    }

    @HostBinding('style.margin')
    public get margin(): string {
        const height = this._getHeight(this.appInternalBubble);
        return `0px -${this.offset + height * this.space}px`;
    }

    @HostBinding('style.padding')
    public get padding(): string {
        const height = this._getHeight(this.appInternalBubble);
        return `0px ${this.offset + height * this.space - this.lineWidth}px`;
    }

    public setInternalBubbleStyle(): void {
        this.renderer.setStyle(this.el.nativeElement, 'border-left-width', `${this.lineWidth}px`);
        this.renderer.setStyle(this.el.nativeElement, 'border-right-width', `${this.lineWidth}px`);
    }

    @HostListener('mouseover', ['$event'])
    onMouseEnter($event) {
        if (!this.isHover) {
            this._store.dispatch(new BubbleAction.MouseOver(this.appInternalBubble));
        }
    }

    @HostListener('mouseout', ['$event'])
    onMouseOut($event) {
        this._store.dispatch(new BubbleAction.MouseOut(this.appInternalBubble));
    }

    private _getHeight(bubble: Bubble): number {
        if (bubble.type === BubbleType.leafBubble) {
            return 1;
        }
        return (bubble as InternalBubble).childBubbleIds
            .reduce((prev, curr) => Math.max(prev, this._getHeight(getBubbleById(this.bubbleList, curr)) + 1), 1);
        }

    private _isBeingEditted(bubble: Bubble): boolean {
        if (bubble.type === BubbleType.leafBubble) {
            return (bubble as LeafBubble).editLockHolder !== -1;
        }
        return (bubble as InternalBubble).childBubbleIds
            .reduce((prev, curr) => prev || this._isBeingEditted(getBubbleById(this.bubbleList, curr)), false);
    }

    private _isParentRoot(bubble: Bubble): boolean {
        const rootBubble = this.bubbleList[0];
        return bubble.parentBubbleId === rootBubble.id;
    }

}

import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { StopHoverPropagationDirective } from './stop-hover-propagation.directive';

@Component({
    selector: 'app-container',
    template: `<div appStopHoverPropagation>Container content</div>`
})
export class ContainerComponent { }

describe('EnterTheDirectiveName', () => {
    let fixture: ComponentFixture<ContainerComponent>;
    let comp: ContainerComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                StopHoverPropagationDirective,
                ContainerComponent
            ],
            providers: [
                StopHoverPropagationDirective
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ContainerComponent);
            comp = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('stop event propagation', () => {
        const el = fixture.debugElement.query(By.directive(StopHoverPropagationDirective));
        const dir = fixture.debugElement.injector.get(StopHoverPropagationDirective) as StopHoverPropagationDirective;
        const event = {
            stopPropagation() {}
        };
        spyOn(event, 'stopPropagation');
        dir.onClick(event)
        expect(event.stopPropagation).toHaveBeenCalled();
    });
});

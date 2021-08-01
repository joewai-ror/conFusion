import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {

  constructor(private render: Renderer2, private el: ElementRef) { }

  @HostListener('mouseenter') onMouseenter() {
    this.render.addClass(this.el.nativeElement, 'highlight' );
  }
  @HostListener('mouseleave') onMouseLeave() {
    this.render.removeClass(this.el.nativeElement, 'highlight');
  }
}

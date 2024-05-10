import { AfterViewInit, Directive, ElementRef, Renderer2, inject, input, output } from '@angular/core';

@Directive({
  selector: '[appScrollNearEnd]',
  standalone: true,
})
export class ScrollNearEndDirective implements AfterViewInit {
  private el = inject(ElementRef<HTMLElement>);
  private renderer = inject(Renderer2);

  nearEnd = output<void>();

  /**
   * threshold in PX when to emit before page end scroll
   */
  threshold = input(100);

  /**
   * if reverse true, then emit when scrolled to top
   */
  scrollReverse = input(false);

  ngAfterViewInit(): void {
    this.renderer.listen(this.el.nativeElement, 'scroll', (e) => {
      const element = e?.target as HTMLElement;

      if (this.scrollReverse()) {
        this.monitorScrollToTop(element);
      } else {
        this.monitorScrollToBottom(element);
      }
    });
  }

  private monitorScrollToTop(el: HTMLElement) {
    const scrollTop = Math.abs(el.scrollTop); // can be negative if flex-col-reverse

    if (scrollTop < this.threshold()) {
      console.log('%c [ScrollNearEndDirective]: emit', 'color: #bada55; font-size: 16px');
      this.nearEnd.emit();
    }
  }

  private monitorScrollToBottom(el: HTMLElement) {
    const elHeight = el.scrollHeight;
    const scrollPositionTop = Math.abs(el.scrollTop); // flex-col-reverse
    const visibleHeight = el.clientHeight;

    // how much we scrolled from bottom - number is going to 0
    const currentScrolledY = elHeight - scrollPositionTop - visibleHeight;

    // check if we are near top
    if (currentScrolledY < this.threshold()) {
      console.log('%c [ScrollNearEndDirective]: emit', 'color: #bada55; font-size: 16px');
      this.nearEnd.emit();
    }
  }
}

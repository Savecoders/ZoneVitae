import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appThemeTransition]',
  standalone: true,
})
export class ThemeTransitionDirective implements OnInit {
  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit() {
    this.el.nativeElement.classList.add('transition-colors', 'duration-200');
  }
}

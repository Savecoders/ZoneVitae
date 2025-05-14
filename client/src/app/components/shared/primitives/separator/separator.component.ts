import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-separator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './separator.component.html',
  host: {
    class: 'inline-block',
  },
})
export class SeparatorComponent {
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';

  @Input() className: string = '';
}

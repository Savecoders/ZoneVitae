import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardComponent } from '../primitives/card/card.component';

@Component({
  selector: 'app-footer',
  standalone: true, 
  imports: [CommonModule, RouterModule, CardComponent],
  templateUrl: './footer.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class FooterComponent {}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HoverCardComponent } from './hover-card.component';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-hover-card-demo',
  standalone: true,
  imports: [CommonModule, HoverCardComponent, ButtonComponent],
  template: `
    <div class="space-y-8">
      <h2 class="text-xl font-semibold mb-4">Hover Card Demo</h2>

      <div class="flex flex-wrap gap-8">
        <!-- Basic hover card -->
        <div class="flex flex-col items-center gap-2">
          <h3 class="text-md font-medium">Basic</h3>
          <app-hover-card>
            <app-button trigger>Hover Me</app-button>
            <div content class="w-64">
              <h3 class="font-semibold text-foreground">Card Title</h3>
              <p class="text-sm text-default-500 mt-2">
                This is a basic hover card that appears when you hover over the
                button.
              </p>
            </div>
          </app-hover-card>
        </div>

        <!-- Top placement -->
        <div class="flex flex-col items-center gap-2">
          <h3 class="text-md font-medium">Top Placement</h3>
          <app-hover-card placement="top">
            <app-button trigger color="secondary">Hover Top</app-button>
            <div content class="w-64">
              <h3 class="font-semibold text-foreground">Top Placement</h3>
              <p class="text-sm text-default-500 mt-2">
                This hover card appears above the trigger element.
              </p>
            </div>
          </app-hover-card>
        </div>

        <!-- Right placement -->
        <div class="flex flex-col items-center gap-2">
          <h3 class="text-md font-medium">Right Placement</h3>
          <app-hover-card placement="right">
            <app-button trigger color="success">Hover Right</app-button>
            <div content class="w-64">
              <h3 class="font-semibold text-foreground">Right Placement</h3>
              <p class="text-sm text-default-500 mt-2">
                This hover card appears to the right of the trigger element.
              </p>
            </div>
          </app-hover-card>
        </div>

        <!-- Left placement -->
        <div class="flex flex-col items-center gap-2">
          <h3 class="text-md font-medium">Left Placement</h3>
          <app-hover-card placement="left">
            <app-button trigger color="warning">Hover Left</app-button>
            <div content class="w-64">
              <h3 class="font-semibold text-foreground">Left Placement</h3>
              <p class="text-sm text-default-500 mt-2">
                This hover card appears to the left of the trigger element.
              </p>
            </div>
          </app-hover-card>
        </div>
      </div>

      <!-- Complex content example -->
      <div class="mt-8">
        <h3 class="text-md font-medium mb-4">Complex Content</h3>
        <app-hover-card placement="bottom" className="p-0 w-80">
          <div
            trigger
            class="cursor-pointer border border-content3 rounded-md p-4 hover:bg-content2 transition-colors"
          >
            <div class="flex items-center gap-3">
              <div
                class="bg-primary/20 w-10 h-10 rounded-full flex items-center justify-center"
              >
                <span class="text-primary font-semibold">JS</span>
              </div>
              <div>
                <h4 class="font-medium">John Smith</h4>
                <p class="text-xs text-default-500">View profile</p>
              </div>
            </div>
          </div>

          <div content>
            <div class="p-4 border-b border-content2">
              <div class="flex items-start gap-3">
                <div
                  class="bg-primary/20 w-12 h-12 rounded-full flex items-center justify-center"
                >
                  <span class="text-primary font-semibold">JS</span>
                </div>
                <div>
                  <h3 class="font-semibold">John Smith</h3>
                  <p class="text-sm text-default-500">Software Engineer</p>
                  <p class="text-xs mt-1 text-default-400">
                    Member since May 2023
                  </p>
                </div>
              </div>
            </div>
            <div class="p-4 text-sm">
              <div class="flex items-center gap-2 mb-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-4 h-4 text-default-500"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
                <span>San Francisco, CA</span>
              </div>
              <div class="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-4 h-4 text-default-500"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
                <span>"john.smithexample.com"</span>
              </div>
            </div>
          </div>
        </app-hover-card>
      </div>
    </div>
  `,
})
export class HoverCardDemoComponent {}

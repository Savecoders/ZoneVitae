import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SonnerComponent } from './sonner.component';

describe('SonnerComponent', () => {
  let component: SonnerComponent;
  let fixture: ComponentFixture<SonnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SonnerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SonnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

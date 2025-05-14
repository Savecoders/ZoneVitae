import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComunitiesComponent } from './comunities.component';

describe('ComunitiesComponent', () => {
  let component: ComunitiesComponent;
  let fixture: ComponentFixture<ComunitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComunitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComunitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

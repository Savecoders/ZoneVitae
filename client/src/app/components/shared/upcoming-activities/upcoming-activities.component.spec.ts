import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingActivitiesComponent } from './upcoming-activities.component';

describe('UpcomingActivitiesComponent', () => {
  let component: UpcomingActivitiesComponent;
  let fixture: ComponentFixture<UpcomingActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpcomingActivitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpcomingActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

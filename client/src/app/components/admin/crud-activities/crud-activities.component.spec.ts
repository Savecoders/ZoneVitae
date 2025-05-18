import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudActivitiesComponent } from './crud-activities.component';

describe('CrudActivitiesComponent', () => {
  let component: CrudActivitiesComponent;
  let fixture: ComponentFixture<CrudActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudActivitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

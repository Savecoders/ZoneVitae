import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudComunitiesComponent } from './crud-communities.component';

describe('CrudComunitiesComponent', () => {
  let component: CrudComunitiesComponent;
  let fixture: ComponentFixture<CrudComunitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudComunitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudComunitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

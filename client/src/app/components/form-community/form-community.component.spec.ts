import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCommunityComponent } from './form-community.component';

describe('FormCommunityComponent', () => {
  let component: FormCommunityComponent;
  let fixture: ComponentFixture<FormCommunityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCommunityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

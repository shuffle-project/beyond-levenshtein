import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorRateComponent } from './error-rate.component';

describe('ErrorRateComponent', () => {
  let component: ErrorRateComponent;
  let fixture: ComponentFixture<ErrorRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorRateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ErrorRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormalisationsComponent } from './normalisations.component';

describe('NormalisationsComponent', () => {
  let component: NormalisationsComponent;
  let fixture: ComponentFixture<NormalisationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NormalisationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NormalisationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordErrorsComponent } from './word-errors.component';

describe('WordErrorsComponent', () => {
  let component: WordErrorsComponent;
  let fixture: ComponentFixture<WordErrorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordErrorsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WordErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

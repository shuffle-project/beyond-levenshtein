import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordSubstitutionsComponent } from './word-substitutions.component';

describe('WordSubstitutionsComponent', () => {
  let component: WordSubstitutionsComponent;
  let fixture: ComponentFixture<WordSubstitutionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordSubstitutionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WordSubstitutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

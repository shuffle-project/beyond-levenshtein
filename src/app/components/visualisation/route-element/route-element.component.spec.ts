import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteElementComponent } from './route-element.component';

describe('RouteElementComponent', () => {
  let component: RouteElementComponent;
  let fixture: ComponentFixture<RouteElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouteElementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RouteElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainRangeComponent } from './domain-range.component';

describe('DomainRangeComponent', () => {
  let component: DomainRangeComponent;
  let fixture: ComponentFixture<DomainRangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomainRangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

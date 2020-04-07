import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItaliaComponent } from './italia.component';

describe('ItaliaComponent', () => {
  let component: ItaliaComponent;
  let fixture: ComponentFixture<ItaliaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItaliaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItaliaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

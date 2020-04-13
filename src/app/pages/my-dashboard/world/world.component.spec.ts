import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MondoComponent } from './mondo.component';

describe('MondoComponent', () => {
  let component: MondoComponent;
  let fixture: ComponentFixture<MondoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MondoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MondoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

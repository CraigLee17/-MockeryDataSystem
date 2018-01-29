import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaSyntaxComponent } from './formula-syntax.component';

describe('FormulaSyntaxComponent', () => {
  let component: FormulaSyntaxComponent;
  let fixture: ComponentFixture<FormulaSyntaxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormulaSyntaxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulaSyntaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

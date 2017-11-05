import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSchemaComponent } from './update-schema.component';

describe('UpdateSchemaComponent', () => {
  let component: UpdateSchemaComponent;
  let fixture: ComponentFixture<UpdateSchemaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateSchemaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateSchemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

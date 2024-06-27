import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaPagComponent } from './nota-pag.component';

describe('NotaPagComponent', () => {
  let component: NotaPagComponent;
  let fixture: ComponentFixture<NotaPagComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotaPagComponent]
    });
    fixture = TestBed.createComponent(NotaPagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

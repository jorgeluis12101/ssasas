import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VernotaComponent } from './vernota.component';

describe('VernotaComponent', () => {
  let component: VernotaComponent;
  let fixture: ComponentFixture<VernotaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VernotaComponent]
    });
    fixture = TestBed.createComponent(VernotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

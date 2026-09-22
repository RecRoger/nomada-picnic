import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceDisclaimerComponent } from './price-disclaimer.component';

describe('PriceDisclaimerComponent', () => {
  let component: PriceDisclaimerComponent;
  let fixture: ComponentFixture<PriceDisclaimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriceDisclaimerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriceDisclaimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

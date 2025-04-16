import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencySwitcherDropdownComponent } from './currency-switcher-dropdown.component';

describe('CurrencySwitcherDropdownComponent', () => {
  let component: CurrencySwitcherDropdownComponent;
  let fixture: ComponentFixture<CurrencySwitcherDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrencySwitcherDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrencySwitcherDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

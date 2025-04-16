import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinDetailDrawerComponent } from './coin-detail-drawer.component';

describe('CoinDetailDrawerComponent', () => {
  let component: CoinDetailDrawerComponent;
  let fixture: ComponentFixture<CoinDetailDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoinDetailDrawerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoinDetailDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

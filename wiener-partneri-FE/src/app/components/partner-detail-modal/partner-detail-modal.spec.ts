import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerDetailModal } from './partner-detail-modal';

describe('PartnerDetailModal', () => {
  let component: PartnerDetailModal;
  let fixture: ComponentFixture<PartnerDetailModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnerDetailModal],
    }).compileComponents();

    fixture = TestBed.createComponent(PartnerDetailModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HathiTrustLinkComponent } from './hathi-trust-link.component';
import { Component } from '@angular/core';

const AVAILABILITY_TEXT = 'OMG HT!!!';

@Component({
  standalone: true,
  imports: [HathiTrustLinkComponent],
  template: `<custom-hathi-trust-link [url]="testUrl"
    >${AVAILABILITY_TEXT}</custom-hathi-trust-link
  >`,
})
class TestHostComponent {
  testUrl: string | undefined;
}

describe('HathiTrustLinkComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HathiTrustLinkComponent, TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders availability text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain(AVAILABILITY_TEXT);
  });

  it('should have a link with the correct href when url is provided', () => {
    const testUrl = 'https://hdl.handle.net/2027/test123';
    component.testUrl = testUrl;
    fixture.detectChanges();

    const anchorElement: HTMLAnchorElement | null =
      fixture.nativeElement.querySelector('a');

    expect(anchorElement?.href).toBe(testUrl);
  });
});

import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { ReportBrokenLinkComponent } from './report-broken-link.component';

@Component({
  standalone: true,
  imports: [ReportBrokenLinkComponent],
  template: `
    <umn-report-broken-link [url]="testUrl()" [locationParam]="testParam()">
      Fix Me
    </umn-report-broken-link>
  `,
})
class TestHostComponent {
  testUrl = signal('https://help.example.com/report-broken-link');
  testParam = signal<string | undefined>(undefined);
}

describe('ReportBrokenLinkComponent via Host', () => {
  let host: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let proxiedDocument: { location: { href: string } };

  beforeEach(async () => {
    proxiedDocument = new Proxy(document, {
      get(target, prop, receiver) {
        if (prop === 'location') {
          return {
            href: 'https://primo.lib.umn.edu/nde/search?q=test',
          };
        }
        return Reflect.get(target, prop, receiver);
      },
    });

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{ provide: DOCUMENT, useValue: proxiedDocument }],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render the base URL when no param is provided', () => {
    const anchor = fixture.nativeElement.querySelector('a');
    expect(anchor.href).toBe('https://help.example.com/report-broken-link');
  });

  it('should append the encoded current location when param is provided', () => {
    // Update the host signal
    host.testParam.set('source');
    fixture.detectChanges();

    const anchor = fixture.nativeElement.querySelector('a');
    const expectedUrl = `https://help.example.com/report-broken-link?source=${encodeURIComponent(
      proxiedDocument.location.href
    )}`;

    expect(anchor.href).toBe(expectedUrl);
  });
});

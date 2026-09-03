import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { describe, it, expect } from 'vitest';
import type { LibChatDialogData } from './libchat-dialog.component';
import { LibChatDialogComponent } from './libchat-dialog.component';

describe('LibChatDialogComponent', () => {
  function setup(
    dialogData: LibChatDialogData = { url: 'https://example.com/chat' },
  ) {
    TestBed.configureTestingModule({
      imports: [LibChatDialogComponent, MatDialogModule, NoopAnimationsModule],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: dialogData }],
    }).compileComponents();

    const fixture: ComponentFixture<LibChatDialogComponent> =
      TestBed.createComponent(LibChatDialogComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return { fixture, component };
  }

  it('should create', () => {
    const { component } = setup();
    expect(component).toBeTruthy();
  });

  it('should sanitize the url from MAT_DIALOG_DATA', () => {
    const url = 'https://example.com/chat';
    const { component } = setup({ url });
    const sanitizer = TestBed.inject(DomSanitizer);
    expect(component.url).toEqual(
      sanitizer.bypassSecurityTrustResourceUrl(url),
    );
  });

  it('should render an iframe bound to the sanitized url', () => {
    const { fixture } = setup();
    const iframe = fixture.debugElement.query(By.css('iframe'));
    expect(iframe).toBeTruthy();
  });

  it('should render a close button', () => {
    const { fixture } = setup();
    const button = fixture.debugElement.query(By.css('[mat-dialog-close]'));
    expect(button).toBeTruthy();
    expect(button.nativeElement.getAttribute('aria-label')).toBe('Close chat');
  });
});

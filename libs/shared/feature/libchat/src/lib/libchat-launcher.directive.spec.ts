import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { describe, it, expect, vi } from 'vitest';
import { LibChatLauncherDirective } from './libchat-launcher.directive';
import { LibChatDialogComponent } from './libchat-dialog/libchat-dialog.component';

@Component({
  standalone: true,
  imports: [LibChatLauncherDirective],
  template: `<a umnLibChatLauncher [href]="href">Chat</a>`,
})
class TestHostComponent {
  href = 'https://example.com/chat';
}

describe('LibChatLauncherDirective', () => {
  function setup(href = 'https://example.com/chat') {
    TestBed.configureTestingModule({
      imports: [TestHostComponent, MatDialogModule, NoopAnimationsModule],
    }).compileComponents();

    const fixture: ComponentFixture<TestHostComponent> =
      TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.href = href;
    fixture.detectChanges();

    const dialog = TestBed.inject(MatDialog);
    const openSpy = vi.spyOn(dialog, 'open');
    const anchor = fixture.debugElement.query(By.css('a'));

    return { fixture, dialog, openSpy, anchor };
  }

  it('should create', () => {
    const { anchor } = setup();
    expect(anchor).toBeTruthy();
  });

  it('should open the LibChatDialogComponent on click', () => {
    const { anchor, openSpy } = setup();
    anchor.triggerEventHandler('click', new MouseEvent('click'));
    expect(openSpy).toHaveBeenCalledWith(LibChatDialogComponent, expect.any(Object));
  });

  it('should pass the href as the dialog url', () => {
    const url = 'https://chat.lib.umn.edu';
    const { anchor, openSpy } = setup(url);
    anchor.triggerEventHandler('click', new MouseEvent('click'));
    expect(openSpy).toHaveBeenCalledWith(
      LibChatDialogComponent,
      expect.objectContaining({ data: { url } }),
    );
  });

  it('should not open the dialog when Ctrl+click', () => {
    const { anchor, openSpy } = setup();
    anchor.triggerEventHandler('click', new MouseEvent('click', { ctrlKey: true }));
    expect(openSpy).not.toHaveBeenCalled();
  });

  it('should not open the dialog when Meta+click', () => {
    const { anchor, openSpy } = setup();
    anchor.triggerEventHandler('click', new MouseEvent('click', { metaKey: true }));
    expect(openSpy).not.toHaveBeenCalled();
  });

  it('should call preventDefault on a normal click', () => {
    const { anchor } = setup();
    const event = new MouseEvent('click');
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
    anchor.triggerEventHandler('click', event);
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should not call preventDefault on Ctrl+click', () => {
    const { anchor } = setup();
    const event = new MouseEvent('click', { ctrlKey: true });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
    anchor.triggerEventHandler('click', event);
    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });
});

import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ExcludeBeyondToggleComponent } from './exclude-beyond-toggle/exclude-beyond-toggle.component';
import { ExcludeBeyondComponent } from './exclude-beyond.component';

describe('ExcludeBeyondComponent', () => {
  let component: ExcludeBeyondComponent;
  let fixture: ComponentFixture<ExcludeBeyondComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExcludeBeyondComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExcludeBeyondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should inject the ExcludeBeyondToggleComponent after view init', async () => {
    const injectChildComponentSpy = vi.spyOn(
      component as unknown as { injectChildComponent: () => void },
      'injectChildComponent',
    );

    component.ngAfterViewInit();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(injectChildComponentSpy).toHaveBeenCalled();
  });

  it('should destroy the child component on ngOnDestroy', () => {
    const childComponentRefMock = {
      destroy: vi.fn(),
    } as unknown as ComponentRef<ExcludeBeyondToggleComponent>;
    (
      component as unknown as {
        childComponentRef?: ComponentRef<ExcludeBeyondToggleComponent>;
      }
    ).childComponentRef = childComponentRefMock;

    component.ngOnDestroy();

    expect(childComponentRefMock.destroy).toHaveBeenCalled();
  });
});

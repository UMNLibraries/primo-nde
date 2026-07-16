import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SearchFacade } from '@umn-nde/shared-state';
import { vi } from 'vitest';
import { ExcludeBeyondToggleComponent } from './exclude-beyond-toggle.component';

describe('ExcludeBeyondToggleComponent', () => {
  async function setup(options?: {
    showToggle?: boolean;
    pcAvailability?: boolean;
  }) {
    const showToggle = signal(options?.showToggle ?? true);
    const pcAvailability = signal(options?.pcAvailability ?? true);
    const searchFacadeMock = {
      defaultPcAvailability: showToggle,
      pcAvailability,
      togglePcAvailability: vi.fn(),
    };

    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [ExcludeBeyondToggleComponent],
      providers: [
        {
          provide: SearchFacade,
          useValue: searchFacadeMock,
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ExcludeBeyondToggleComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const getToggleElement = () =>
      fixture.nativeElement.querySelector(
        '[data-qa="umn-exclude-beyond-toggle"]',
      );

    return {
      fixture,
      component,
      searchFacadeMock,
      getToggleElement,
      setPcAvailability: (value: boolean) => {
        pcAvailability.set(value);
        fixture.detectChanges();
      },
    };
  }

  it('should create', async () => {
    const { component } = await setup();

    expect(component).toBeTruthy();
  });

  it('should render the toggle when showToggle is true', async () => {
    const { getToggleElement } = await setup({ showToggle: true });

    expect(getToggleElement()).toBeTruthy();
  });

  it('should not render the toggle when showToggle is false', async () => {
    const { getToggleElement } = await setup({ showToggle: false });

    expect(getToggleElement()).toBeNull();
  });

  it('should call togglePcAvailability with current checked value on toggle change', async () => {
    const { component, searchFacadeMock } = await setup({
      pcAvailability: false,
    });

    component.toggleChange({} as never);

    expect(searchFacadeMock.togglePcAvailability).toHaveBeenCalledWith(true);
  });

  it('should update checked based on pcAvailability', async () => {
    const { component, setPcAvailability } = await setup({
      pcAvailability: true,
    });

    expect(component.checked()).toBe(false);

    setPcAvailability(false);

    expect(component.checked()).toBe(true);
  });
});

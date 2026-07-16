import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  ElementRef,
  inject,
  OnDestroy,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import { asapScheduler } from 'rxjs';
import { ExcludeBeyondToggleComponent } from './exclude-beyond-toggle/exclude-beyond-toggle.component';

/**
 * Injects the ExcludeBeyondToggleComponent just below the "remember filters"
 * toggle in the search filters side nav.
 */
@Component({
  standalone: true,
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExcludeBeyondComponent implements OnDestroy, AfterViewInit {
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);
  private vcr = inject(ViewContainerRef);
  private childComponentRef?: ComponentRef<ExcludeBeyondToggleComponent>;

  ngAfterViewInit() {
    asapScheduler.schedule(() => {
      this.injectChildComponent();
    });
  }

  ngOnDestroy() {
    if (this.childComponentRef) {
      this.childComponentRef.destroy();
    }
  }

  private injectChildComponent() {
    const filtersElement = this.elementRef.nativeElement.closest(
      'nde-search-filters-side-nav',
    );
    if (filtersElement) {
      const rememberFiltersToggleElement = filtersElement.querySelector(
        '.remember-filters-slider',
      );
      if (rememberFiltersToggleElement && !this.childComponentRef) {
        this.childComponentRef = this.vcr.createComponent(
          ExcludeBeyondToggleComponent,
        );
        this.renderer.insertBefore(
          rememberFiltersToggleElement.parentNode,
          this.childComponentRef.location.nativeElement,
          rememberFiltersToggleElement.nextSibling,
        );
      }
    }
  }
}

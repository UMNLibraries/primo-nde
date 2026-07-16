import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { SearchFacade } from '@umn-nde/shared-state';

@Component({
  standalone: true,
  selector: 'umn-exclude-beyond-toggle',
  imports: [
    MatSlideToggleModule,
    MatTooltipModule,
    MatIconModule,
    TranslateModule,
  ],
  templateUrl: './exclude-beyond-toggle.component.html',
  styleUrl: './exclude-beyond-toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExcludeBeyondToggleComponent {
  private searchFacade = inject(SearchFacade);

  label = 'Exclude items only available through interlibrary loan';
  activeTip =
    'Click to include items that are only available through interlibrary loan';
  inactiveTip =
    'Click to exclude items that are only available through interlibrary loan';

  showToggle = this.searchFacade.defaultPcAvailability;
  checked = computed(() => this.searchFacade.pcAvailability() === false);

  toggleChange(_event: MatSlideToggleChange) {
    this.searchFacade.togglePcAvailability(this.checked());
  }
}

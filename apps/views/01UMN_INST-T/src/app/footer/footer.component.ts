import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LibChatLauncherDirective } from '@umn-nde/libchat';

@Component({
  selector: 'umn-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LibChatLauncherDirective],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {}

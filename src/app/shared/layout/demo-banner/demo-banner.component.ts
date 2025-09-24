import { Component, inject, effect } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../utils/services/auth.service';
import { SharedModule } from '../../shared.module';
import { DEMO_CONFIG } from '../../utils/demo.config';

@Component({
  selector: 'app-demo-banner',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './demo-banner.component.html',
  styleUrl: './demo-banner.component.css',
})
export class DemoBannerComponent {
  // Visible if demo mode build flag is active and not dismissed, OR user is demo user
  show = false;
  private authService = inject(AuthService);

  constructor() {
    // Build-time demo mode auto-show (respect stored dismissal)
    if (environment.demoMode && typeof window !== 'undefined') {
      const hidden =
        localStorage.getItem(DEMO_CONFIG.bannerStorageKey) === 'true';
      if (!hidden) this.show = true;
    }

    // Reactive effect for user changes
    effect(() => {
      const user = this.authService.currentUserSignal();
      if (!this.show && user?.email === DEMO_CONFIG.demoEmail) {
        this.show = true;
      }
    });
  }

  dismiss() {
    this.show = false;
    if (typeof window !== 'undefined') {
      localStorage.setItem(DEMO_CONFIG.bannerStorageKey, 'true');
    }
  }
}

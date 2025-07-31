import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from './shared/layout/header/header.component';
import { FooterComponent } from './shared/layout/footer/footer.component';
import { SharedModule } from './shared/shared.module';
import { SidebarComponent } from './shared/layout/sidebar/sidebar.component';
import { MatDrawer } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [
    SharedModule,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.css',
    './shared/layout/sidebar/sidebar.component.css',
  ],
})
export class AppComponent {
  title = 'recipe-manager';

  @ViewChild('drawer') drawer!: MatDrawer;

  isSmallScreen = false;

  constructor(private breakpointObserver: BreakpointObserver) {
    // listen for screen size changes
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe((result) => {
        this.isSmallScreen = result.matches;
        // close the drawer optionally on mobile
        if (this.drawer && this.isSmallScreen) {
          this.drawer.close();
        }
      });
  }
}

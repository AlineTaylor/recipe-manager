import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidebarComponent } from './layout/sidebar/sidebar.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, MatSidenavModule, MatButtonModule, SidebarComponent],
  exports: [CommonModule, MatSidenavModule, MatButtonModule, SidebarComponent],
})
export class SharedModule {}

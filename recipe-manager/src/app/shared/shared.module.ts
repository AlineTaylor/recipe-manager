import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [CommonModule, MatSidenavModule, MatButtonModule, FormsModule],
  exports: [CommonModule, MatSidenavModule, MatButtonModule, FormsModule],
})
export class SharedModule {}

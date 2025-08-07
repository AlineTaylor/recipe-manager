import { Component, Input, WritableSignal } from '@angular/core';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'app-unit-toggle',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './unit-toggle.component.html',
  styleUrls: ['./unit-toggle.component.css'],
})
export class UnitToggleComponent {
  @Input({ required: true }) unitSystem!: WritableSignal<'metric' | 'imperial'>;

  setSystem(system: 'metric' | 'imperial') {
    this.unitSystem.set(system);
  }
}

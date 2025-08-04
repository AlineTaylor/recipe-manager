import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
@Component({
  selector: 'app-add-edit',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './add-edit.component.html',
  styleUrl: './add-edit.component.css',
})
// implements OnInit
export class AddEditComponent {
  constructor() {}
}

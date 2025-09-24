import { Component, inject } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { NgForm } from '@angular/forms';
import { ShareService } from '../shared/utils/services/share.service';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './info.component.html',
  styleUrl: './info.component.css',
})
export class InfoComponent {
  public shareService = inject(ShareService);

  name = '';
  email = '';
  subject = '';
  message = '';

  onSubmit(form: NgForm) {
    if (!form.valid) return;
    this.emailMessage();
    this.resetForm(form);
  }

  emailMessage() {
    this.shareService.senderName.set(this.name);
    this.shareService.emailAddress.set(this.email);
    this.shareService.messageSubject.set(this.subject);
    this.shareService.messageBody.set(this.message);

    this.shareService.logMessage([
      this.email,
      this.name,
      this.subject,
      this.message,
    ]);
  }

  resetForm(form: NgForm) {
    form.resetForm(); // clear values and reset the form state
    this.shareService.resetContactForm(); // reset signals
  }
}

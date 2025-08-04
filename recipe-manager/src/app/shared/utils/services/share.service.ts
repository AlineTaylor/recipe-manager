import { inject, Injectable, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ShareService {
  private snackBar = inject(MatSnackBar);
  showShareForm = signal(false);
  emailAddress = signal('');
  senderName = signal('');
  messageSubject = signal('');
  messageBody = signal('');
  contactMessage = signal([
    this.emailAddress,
    this.senderName,
    this.messageSubject,
    this.messageBody,
  ]);

  toggleShareForm() {
    this.showShareForm.set(!this.showShareForm());
  }

  resetShareForm() {
    this.emailAddress.set('');
    this.showShareForm.set(false);
  }

  resetContactForm() {
    this.emailAddress.set('');
    this.senderName.set('');
    this.messageSubject.set('');
    this.messageBody.set('');
  }

  logSharedItems(items: any[]) {
    console.log(`Sharing parts list with: ${this.emailAddress()}`);
    console.log(JSON.stringify(items, null, 2));
    this.snackBar.open('Parts list shared!', 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }

  logMessage(message: any) {
    console.log(`Message from: ${this.senderName()} (${this.emailAddress()})`);
    console.log(JSON.stringify(message, null, 2));
    this.snackBar.open(
      'Thank you for your message! One of us will be reaching out to you shortly. ',
      'Close',
      {
        duration: 10000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      }
    );
  }
}

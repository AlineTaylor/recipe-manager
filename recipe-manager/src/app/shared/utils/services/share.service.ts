import { inject, Injectable, signal } from '@angular/core';
import { NotificationService } from './notification.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ShareService {
  private notifications = inject(NotificationService);
  private http = inject(HttpClient);

  // backend API base URL (set in env files)
  private apiUrl = environment.apiUrl;
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

  logMessage(message: any) {
    // Development logging only
    if (!environment.production) {
      console.log(
        `Message from: ${this.senderName()} (${this.emailAddress()})`
      );
      console.log(JSON.stringify(message, null, 2));
    }
    this.notifications.success(
      'Thank you for your message! One of us will be reaching out to you shortly.'
    );
  }

  // recipe sharing
  shareRecipe(data: {
    recipient_email: string;
    recipe_id: number | string;
    sender_email?: string;
    sender_name?: string;
    message?: string;
  }) {
    return this.http.post(`${this.apiUrl}/share`, {
      type: 'recipe',
      ...data,
    });
  }

  // shopping list sharing
  shareShoppingList(data: {
    recipient_email: string;
    ingredients: any[] | string;
    sender_email?: string;
    sender_name?: string;
  }) {
    return this.http.post(`${this.apiUrl}/share`, {
      type: 'shopping-list',
      ...data,
    });
  }

  //  contact form sharing
  sendContactMessage(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
    user_id?: string | number;
  }) {
    return this.http.post(`${this.apiUrl}/share`, {
      type: 'contact',
      ...data,
    });
  }

  // snackbar message (public helper)
  showSnackbar(
    message: string,
    action: string = 'Close',
    duration: number = 4000
  ) {
    this.notifications.info(message, action, duration);
  }
}

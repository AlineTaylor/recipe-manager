import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { NotificationService } from '../shared/utils/services/notification.service';
import { UserService } from '../shared/utils/services/user.service';
import { AuthService } from '../shared/utils/services/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { environment } from '../../environments/environment';
import imageCompression from 'browser-image-compression';
import { validateImageFile } from '../shared/utils/image-validation';

@Component({
  selector: 'app-profile',
  imports: [SharedModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  userService = inject(UserService);
  authService = inject(AuthService);
  dialog = inject(MatDialog);

  // flag signals
  isEditing = signal(false);
  isLoading = signal(false);
  isUpdating = signal(false);
  showPassword = signal(false);
  showPasswordConfirm = signal(false);

  // user data from service
  user = computed(() => this.userService.getUserSignal()());

  // form data for editing
  editForm = signal({
    first_name: '',
    last_name: '',
    email: '',
    email_confirmation: '',
    password: '',
    password_confirmation: '',
    preferred_system: 'metric',
  });

  constructor(private notifications: NotificationService) {}

  ngOnInit() {
    this.loadUserData();
  }

  private loadUserData() {
    this.isLoading.set(true);
    this.userService.loadUser();

    // populate form with current user data if available
    const currentUser = this.user();
    if (currentUser) {
      this.editForm.set({
        first_name: currentUser.first_name,
        last_name: currentUser.last_name,
        email: currentUser.email,
        email_confirmation: currentUser.email,
        password: '',
        password_confirmation: '',
        preferred_system: currentUser.preferred_system,
      });
      this.isLoading.set(false);
    }
  }

  getProfilePictureUrl(): string | null {
    const user = this.user();
    // base URL is the backend's API’s root domain since im using active storage for images
    return user?.profile_picture_url
      ? `${environment.apiUrl}${user.profile_picture_url}`
      : null;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!(input.files && input.files[0])) return;
    const file = input.files[0];

    const validationError = validateImageFile(file, {
      allowedMime: ['image/png', 'image/jpeg', 'image/webp'],
      maxSizeMB: 5,
    });
    if (validationError) {
      this.notifications.error(validationError);
      input.value = '';
      return;
    }

    this.isUpdating.set(true);
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    };
    imageCompression(file, options)
      .then((compressedFile) => {
        const formData = new FormData();
        formData.append('profile_picture', compressedFile);
        this.userService.uploadProfilePicture(formData).subscribe({
          next: () => {
            this.notifications.success('Profile picture updated!');
            this.userService.loadUser();
            this.isUpdating.set(false);
          },
          error: (err: unknown) => {
            console.error('Profile picture upload failed', err);
            this.notifications.error('Failed to upload profile picture.');
            this.isUpdating.set(false);
          },
        });
      })
      .catch((err) => {
        console.error('Image compression failed', err);
        this.notifications.error('Image compression failed.');
        this.isUpdating.set(false);
      });
  }

  startEditing() {
    const currentUser = this.user();
    if (currentUser) {
      this.editForm.set({
        first_name: currentUser.first_name,
        last_name: currentUser.last_name,
        email: currentUser.email,
        email_confirmation: currentUser.email,
        password: '',
        password_confirmation: '',
        preferred_system: currentUser.preferred_system,
      });
    }
    this.isEditing.set(true);
  }

  cancelEditing() {
    this.isEditing.set(false);
    this.showPassword.set(false);
    this.showPasswordConfirm.set(false);
  }

  onSubmit() {
    const form = this.editForm();
    // clean up and validate inputs
    if (
      !form.first_name.trim() ||
      !form.last_name.trim() ||
      !form.email.trim()
    ) {
      this.notifications.error('Please fill in all required fields');
      return;
    }

    if (form.email !== form.email_confirmation) {
      this.notifications.error('Email addresses do not match');
      return;
    }

    if (form.password && form.password !== form.password_confirmation) {
      this.notifications.error('Passwords do not match');
      return;
    }

    this.isUpdating.set(true);

    // data to be updated
    const updateData: any = {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim(),
      email_confirmation: form.email_confirmation.trim(),
      preferred_system: form.preferred_system,
    };

    if (form.password) {
      updateData.password = form.password;
      updateData.password_confirmation = form.password_confirmation;
    }

    this.userService.editUser(updateData).subscribe({
      next: (res: any) => {
        this.notifications.success('Profile updated successfully!');
        this.isEditing.set(false);
        this.isUpdating.set(false);
        // reload to reflect changes
        this.userService.loadUser();
      },
      error: (err: any) => {
        console.error('Update failed', err);
        this.notifications.error(
          err.error?.message || 'Update failed. Please try again.'
        );
        this.isUpdating.set(false);
      },
    });
  }

  confirmDeleteAccount() {
    const dialogRef = this.dialog.open(DeleteAccountDialogComponent, {
      width: '450px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.deleteAccount();
      }
    });
  }

  private deleteAccount() {
    const currentUser = this.user();
    if (!currentUser) return;

    this.userService.deleteUser(currentUser).subscribe({
      next: (res: any) => {
        this.notifications.success(
          "Account deleted successfully. We'll miss you!"
        );
        this.authService.logout();
      },
      error: (err: any) => {
        console.error('Deletion failed', err);
        this.notifications.error(
          err.error?.message || 'Deletion failed. Please try again.'
        );
      },
    });
  }
}

// Delete Account Confirmation Dialog Component
@Component({
  selector: 'app-delete-account-dialog',
  imports: [SharedModule],
  template: `
    <h2 mat-dialog-title>
      <mat-icon color="warn">warning</mat-icon>
      Delete Account
    </h2>
    <mat-dialog-content>
      <p>
        <strong
          >Are you absolutely sure you want to delete your account?</strong
        >
      </p>
      <p>This action cannot be undone and will permanently delete:</p>
      <ul>
        <li>All your recipes</li>
        <li>Your favorites list</li>
        <li>All profile data</li>
        <li>Your account settings</li>
      </ul>
      <p class="warning-text">
        <mat-icon>info</mat-icon>
        Once deleted, you'll need to create a new account to use the app again.
      </p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">
        <mat-icon>cancel</mat-icon>
        Cancel
      </button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true">
        <mat-icon>delete_forever</mat-icon>
        Delete My Account
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .warning-text {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem;
        background-color: var(--warning-bg);
        border: 1px solid var(--warning-border);
        border-radius: 4px;
        color: var(--warning-text);
        margin-top: 1rem;
      }

      mat-dialog-content ul {
        margin: 1rem 0;
        padding-left: 1.5rem;
      }

      mat-dialog-content li {
        margin: 0.25rem 0;
      }

      h2 {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      mat-dialog-actions {
        gap: 1rem;
      }
    `,
  ],
})
export class DeleteAccountDialogComponent {}

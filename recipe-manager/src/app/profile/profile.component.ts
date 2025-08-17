import { Component, inject, signal } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../shared/utils/services/user.service';
import { User } from '../shared/utils/user.model';
import { AuthService } from '../shared/utils/services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [SharedModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  userService = inject(UserService);
  authService = inject(AuthService);
  showPassword = signal(false);
  showPasswordConfirm = signal(false);

  userData: User = {
    id: this.userService.getDecodedToken()?.user_id || 0,
    email: this.userService.getUserSignal()()?.email || '',
    first_name: this.userService.getUserSignal()()?.first_name || '',
    last_name: this.userService.getUserSignal()()?.last_name || '',
    preferred_system:
      this.userService.getUserSignal()()?.preferred_system || 'metric',
  };

  constructor(private snackBar: MatSnackBar) {}

  // edit user profile
  updatedUser = {
    first_name: '',
    last_name: '',
    email: '',
    email_confirmation: '',
    password: '',
    password_confirmation: '',
    preferred_system: '',
  };

  onSubmit() {
    if (this.updatedUser.password !== this.updatedUser.password_confirmation) {
      this.snackBar.open('Passwords do not match', 'Dismiss', {
        duration: 3000,
      });
      return;
    }

    this.userService.editUser(this.userData).subscribe({
      next: (res) => {
        this.snackBar.open('Profile updated successfully!', 'Dismiss', {
          duration: 3000,
        });
      },
      error: (err) => {
        console.error('Update failed', err);
        this.snackBar.open('Update failed. Please try again.', 'Dismiss', {
          duration: 5000,
          panelClass: ['snackbar-error'],
        });
      },
    });
  }

  //delete user profile
  deleteUser() {
    if (
      !confirm(
        'Are you sure you want to delete your account? This action cannot be undone.'
      )
    ) {
      return;
    } else {
      this.userService.deleteUser(this.userData).subscribe({
        next: (res) => {
          this.snackBar.open(
            'Profile deleted successfully. You will be missed!',
            'Dismiss',
            {
              duration: 3000,
            }
          );
          this.authService.logout();
        },
        error: (err) => {
          console.error('Update failed', err);
          this.snackBar.open('Deletion failed. Please try again.', 'Dismiss', {
            duration: 5000,
            panelClass: ['snackbar-error'],
          });
        },
      });
    }
  }
}

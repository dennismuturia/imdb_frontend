import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  imports: [
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username = '';
   password = '';
   error = '';

   constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.error = '';

    if (!this.username || !this.password) {
      this.error = 'Please enter username and password';
      return;
    }

    this.auth.login(this.username, this.password).subscribe(ok => {
      if (ok) {
        this.router.navigate(['/actors']);
      } else {
        this.error = 'Invalid username or password';
      }
    });
  }

}

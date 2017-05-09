import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
  errors: {string: any};
  isSuccess = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  passwordReset(email: string) {
    email = email.trim();
    if (!email) { return; }

    this.authService.passwordReset(email)
      .then(success => {
          this.isSuccess = true;
        }, error => {
          this.errors = error.json();
          console.log(this.errors);
      });
  }

}

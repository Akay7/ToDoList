import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-password-reset-confirm',
  templateUrl: './password-reset-confirm.component.html',
  styleUrls: ['./password-reset-confirm.component.scss']
})
export class PasswordResetConfirmComponent implements OnInit {
  uid;
  token;
  new_password1;
  new_password2;
  errors: {string: any};
  isWrongToken = false;
  isSuccess = false;

  constructor(private route: ActivatedRoute,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.uid = params['uid'];
      this.token = params['token'];
    });
  }

  passwordResetConfirm() {
    this.authService.passwordResetConfirm(
      this.uid, this.token, this.new_password1, this.new_password2)
      .then(success => {
        this.isSuccess = true;
      }, error => {
        this.errors = error.json();
        this.isWrongToken = this.errors.hasOwnProperty('token');
      });
  }
}

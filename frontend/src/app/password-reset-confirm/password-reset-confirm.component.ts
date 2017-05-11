import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-password-reset-confirm',
  templateUrl: './password-reset-confirm.component.html',
  styleUrls: ['./password-reset-confirm.component.scss']
})
export class PasswordResetConfirmComponent implements OnInit {
  tokens;
  errors: {string: any};
  isWrongToken = false;
  isSuccess = false;

  constructor(private route: ActivatedRoute,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.tokens = Object.assign({}, params);
    });
  }

  passwordResetConfirm(form: NgForm) {
    const payload = Object.assign({}, this.tokens, form.value);
    this.authService.passwordResetConfirm(payload)
      .subscribe(success => {
        this.isSuccess = true;
      }, error => {
        this.errors = error.json();
        this.isWrongToken = this.errors.hasOwnProperty('token');
      });
  }
}

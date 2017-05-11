import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import {NgForm} from "@angular/forms";

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

  passwordReset(form: NgForm) {
    this.authService.passwordReset(form.value)
      .subscribe(success => {
          this.isSuccess = true;
        }, error => {
          this.errors = error.json();
      });
  }

}

import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../../auth.service';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss']
})
export class PasswordChangeComponent implements OnInit {
  feedback: string;
  errors: {string: any};

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  passwordChange(form: NgForm) {
    this.feedback = null;
    this.errors = null;
    this.authService.passwordChange(form.value)
      .subscribe(data => {
        this.feedback = data.json().detail;
      }, error => {
        this.errors = error.json();
      });
    form.resetForm();
  }

}

import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { User } from '../user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  errors: {string: any};
  user: User;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.user.subscribe(user => this.user = user);
  }

  login(form: NgForm) {
    this.authService.login(form.value)
      .subscribe(
        res => {
          this.user = res.json();
        }, error => {
          this.errors = error.json();
        });
    form.resetForm();
  }

}

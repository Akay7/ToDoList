import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { User } from '../user';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  errors: {string: any};
  user: User;

  constructor(private router: Router,
              private authService: AuthService) { }

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
  logout() {
    this.authService.logout()
      .subscribe(res => {
        this.router.navigate(['/']);
      });
  }
}

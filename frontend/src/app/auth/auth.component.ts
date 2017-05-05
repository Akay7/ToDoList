import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../user';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  auth = {username: '', password: ''};
  errors: {string: any};
  user: User;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.user.subscribe(user => this.user = user);
    this.authService.errors.subscribe(errors => this.errors = errors);
  }

  login() {
    this.authService.login(this.auth.username, this.auth.password);
    this.auth = {username: '', password: ''};
  }
  logout() {
    this.authService.logout();
  }
}

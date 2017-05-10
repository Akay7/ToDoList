import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../user';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  errors: {string: any};
  isSuccess = false;
  user: User;

  username;
  email;
  password1;
  password2;

  constructor(private authService: AuthService) {
    this.authService.user.subscribe(user => this.user = user);
  }

  ngOnInit() {
  }

  registerUser() {
    this.authService.registerUser(this.username, this.email, this.password1, this.password2)
      .subscribe(data => {
        this.isSuccess = true;
      }, error => {
        this.errors = error.json();
      });
  }
}

import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
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
  user: User = null;

  constructor(private authService: AuthService) {
    this.authService.user.subscribe(user => this.user = user);
  }

  ngOnInit() {
  }

  registerUser(form: NgForm) {
    this.authService.registerUser(form.value)
      .subscribe(data => {
        this.isSuccess = true;
      }, error => {
        this.errors = error.json();
      });
  }
}

import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { ActivatedRoute, Params } from '@angular/router';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  errors: {string: any};
  user: User;

  constructor(private route: ActivatedRoute,
              private authService: AuthService) { }

  ngOnInit() {
    this.authService.user.subscribe(user => this.user = user);
    this.route.params.subscribe((params: Params) => {
      this.errors = JSON.parse(params['errors']);
    });

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

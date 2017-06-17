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
  user: User;
  isShow = false;

  constructor(private router: Router,
              private authService: AuthService) {
    router.events.subscribe((val) => {
      this.isShow = false;
    });
  }

  ngOnInit() {
    this.authService.user.subscribe(user => this.user = user);
  }

  login(form: NgForm) {
    this.authService.login(form.value)
      .subscribe(
        res => {
          this.user = res.json();
        }, error => {
          const errors = error.json();
          this.router.navigate(['/login',  { errors: JSON.stringify(errors)}]);
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

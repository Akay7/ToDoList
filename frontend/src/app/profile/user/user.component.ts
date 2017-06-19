import { Component, OnInit } from '@angular/core';
import {User} from '../../user';
import {AuthService} from '../../auth.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  errors: {string: any};
  user: User = null;

  constructor(private authService: AuthService) {
    this.authService.user.subscribe(user => this.user = user);
  }

  ngOnInit() {
  }

  updateUser(form: NgForm) {
    this.authService.updateUser(form.value)
      .subscribe(data => {
        this.errors = null;
      }, error => {
        this.errors = error.json();
      });
  }

}

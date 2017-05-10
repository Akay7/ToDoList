import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-account-confirm-email',
  templateUrl: './account-confirm-email.component.html',
  styleUrls: ['./account-confirm-email.component.scss']
})
export class AccountConfirmEmailComponent implements OnInit {
  isSuccess = null;

  constructor(private route: ActivatedRoute,
              private authService: AuthService) { }

  ngOnInit() {
    let key;
    this.route.params.subscribe((params: Params) => {
      key = params['key'];
    });
    this.authService.accountConfirmEmail(key)
      .subscribe(success => {
          this.isSuccess = true;
        }, error => {
          this.isSuccess = false;
        }
    );
  }

}

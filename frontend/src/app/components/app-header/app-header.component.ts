import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css'],
})
export class AppHeaderComponent implements OnInit {
  loginStatus!: boolean;
  user: any;
  defaultUserPhoto = '../../../assets/generic_pfp.png';
  userphoto = this.defaultUserPhoto;
  admin: boolean = false;
  lead: boolean = false;
  tester: boolean = false;
  pm: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {

  }

  ngOnInit() {
  }

  signOut() {
    this.authService.logout();
  }
}

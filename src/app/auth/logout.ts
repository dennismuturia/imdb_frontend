import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  standalone: true,
  template: ''
})
export class Logout implements OnInit {

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.auth.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}

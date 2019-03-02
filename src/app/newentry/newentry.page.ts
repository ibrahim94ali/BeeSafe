import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-newentry',
  templateUrl: './newentry.page.html',
  styleUrls: ['./newentry.page.scss'],
})
export class NewentryPage implements OnInit {

  account = {name: "", email: "", password: ""};

  showPass = true;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  save()
  {
    console.log(this.account);
    this.router.navigateByUrl('/tabs/tab1');
  }
}

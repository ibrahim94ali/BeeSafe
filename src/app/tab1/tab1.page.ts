import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  facebook = {name: "facebook", username: "ibrahim94ali", password: "ibra"};
  twitter = {name: "twitter", username: "ibrahim_ali__", password: "ibra"};
  list = [this.facebook, this.twitter];

  constructor(private router: Router) { }

  presentActionSheet(l:any)
  {
    console.log(l);
  }

  addNew()
  {
    this.router.navigateByUrl('/tabs/tab1/newentry');
  }
}

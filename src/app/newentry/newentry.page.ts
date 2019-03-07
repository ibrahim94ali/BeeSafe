import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
declare var require: any
var KintoClient = require("kinto-http");

@Component({
  selector: 'app-newentry',
  templateUrl: './newentry.page.html',
  styleUrls: ['./newentry.page.scss'],
})
export class NewentryPage implements OnInit {

  account = {name: "", email: "", password: ""};
  client = null;

  showPass = true;

  constructor(private router: Router, public toastController: ToastController) { }

  ngOnInit() {
      const secretString = `${"ibrahim94ali"}:${"admin123"}`;
this.client = new KintoClient("https://kinto.dev.mozaws.net/v1/", {
  headers: {
    Authorization: "Basic " + btoa(secretString)
  }
});
}

  save()
  {
    this.client.bucket("mysafe").collection("accounts")
  .createRecord({name: this.account.name, email: this.account.email, password: this.account.password})
  .then(() => {
    this.okToast();
    this.router.navigateByUrl('/tabs/tab1');
  });
}

  async okToast() {
    const toast = await this.toastController.create({
      message: 'Your account information is saved.',
      duration: 3000
    });
    toast.present();
  }
  
}

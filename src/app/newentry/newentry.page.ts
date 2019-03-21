import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-newentry',
  templateUrl: './newentry.page.html',
  styleUrls: ['./newentry.page.scss'],
})
export class NewentryPage implements OnInit {

  account = { name: "", email: "", password: "" };
  db = null;

  showPass = true;

  constructor(private router: Router, public toastController: ToastController) { }

  ngOnInit() {
    const secretString = `${"ibrahim94ali"}:${"admin123"}`;

    this.db = new window.Kinto({
      remote: "https://kinto.dev.mozaws.net/v1/", headers: {
        Authorization: "Basic " + btoa(secretString)
      }
    });
  }

  async save() {

    const accounts = this.db.collection("accounts");

    
    await accounts.create({ name: this.account.name, email: this.account.email, password: this.account.password })
      .then(() => {
        this.okToast();
        this.router.navigateByUrl('tabs/tab1');
      })
      .catch(e => console.log(e));

    await accounts.sync();
  }

  async okToast() {
    const toast = await this.toastController.create({
      message: 'Your account information is saved.',
      duration: 3000
    });
    toast.present();
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
declare var require: any
var CryptoJS = require("crypto-js");

@Component({
  selector: 'app-newentry',
  templateUrl: './newentry.page.html',
  styleUrls: ['./newentry.page.scss'],
})
export class NewentryPage implements OnInit {

  account = { name: "", email: "", password: "" };
  savedAccount =  { name: "", email: "", password: "" };
  db = null;
  autoSync = false;
  secretString = null;

  showPass = true;

  constructor(private router: Router, public toastController: ToastController,
    private authService: AuthenticationService){}

    ngOnInit(){
   
    this.secretString = this.authService.getId();
    

    this.db = new window.Kinto({
      remote: "https://kinto.dev.mozaws.net/v1/", headers: {
        Authorization: "Basic " + this.secretString
      }
    });
    const settings = this.db.collection("settings");
    this.autoSyncF(settings);
  }

  async autoSyncF(settings: any)
  {
   await settings.list()
    .then(arr => {
      this.autoSync = arr.data[0].autoSync;
    });
  }

  async save() {
    this.savedAccount.email = this.account.email;
    this.savedAccount.name = this.account.name;
    this.savedAccount.password = this.account.password;
    this.cipherPassword();
    const accounts = this.db.collection("accounts");


    await accounts.create(this.savedAccount)
      .then(() => {
        this.okToast();
        this.router.navigateByUrl('app/tabs/tab1');
      })
      .catch(e => console.log(e));

      if(this.autoSync===true){
        await accounts.sync();
        }
  }

  async okToast() {
    const toast = await this.toastController.create({
      message: 'Your account information is saved.',
      duration: 3000
    });
    toast.present();
  }

  cipherPassword() {
    var ciphertext = CryptoJS.AES.encrypt(this.savedAccount.password, this.secretString).toString();
    this.savedAccount.password = ciphertext;
  }

}

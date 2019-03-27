import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
declare var require: any
var CryptoJS = require("crypto-js");

@Component({
  selector: 'app-editentry',
  templateUrl: './editentry.page.html',
  styleUrls: ['./editentry.page.scss'],
})
export class EditentryPage implements OnInit {

  account = { name: "", email: "", password: "", id: ""};
  savedAccount =  { name: "", email: "", password: "", id: "" };

  showPass = true;
  db = null;
  autoSync = false;
  secretString = null;

  constructor(private router: Router, public toastController: ToastController, private route: ActivatedRoute,
    private authService: AuthenticationService) { }

  ngOnInit() {
    this.secretString = this.authService.getId();
    this.account.id = this.route.snapshot.paramMap.get('id');

    this.db = new window.Kinto({
      remote: "https://kinto.dev.mozaws.net/v1/", headers: {
        Authorization: "Basic " + this.secretString
      }
    });
    const accounts = this.db.collection("accounts");
    const settings = this.db.collection("settings");
    this.getInstance(accounts);
    this.autoSyncF(settings);
  }

  async getInstance(accounts: any)
  {
    accounts.get(this.account.id)
    .then(arr => 
      {
        this.account.name = arr.data.name;
        this.account.email = arr.data.email;
        this.account.password = this.deCipherPassword(arr.data.password);
      });
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
    this.savedAccount.id = this.account.id;
    this.cipherPassword();
    const accounts = this.db.collection("accounts");

    await accounts.update(this.savedAccount)
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
  deCipherPassword(ciphertext: any) {
    // Decrypt
    var bytes = CryptoJS.AES.decrypt(ciphertext, this.secretString);
    var plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return plaintext;
  }

}

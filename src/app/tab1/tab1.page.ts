import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, ToastController, NavController, AlertController } from '@ionic/angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { AuthenticationService } from '../services/authentication.service';
declare var require: any
var CryptoJS = require("crypto-js");

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  list = [];
  secretString = null;
  db = null;
  accounts = null;
  settings = null;

  clearPassTime = 30;
  timeLeft = this.clearPassTime;
  interval = null;
  autoSync = false;

  constructor(private router: Router, public actionSheetController: ActionSheetController, public toastController: ToastController,
    public navCtrl: NavController, public alertController: AlertController, private clipboard: Clipboard,
    private authService: AuthenticationService) { }

  ionViewWillEnter() {
    this.list = [];

    this.getAccounts();
    if (this.timeLeft === 30 || this.timeLeft === 45 || this.timeLeft === 60 || this.timeLeft === 0)
      this.getSettings();
  }

  async ngOnInit() {

    this.secretString = this.authService.getId();
    this.db = new window.Kinto({
      remote: "https://kinto.dev.mozaws.net/v1/", headers: {
        Authorization: "Basic " + this.secretString
      }
    });

    this.accounts = this.db.collection("accounts");
    this.settings = this.db.collection("settings");
  }

  deCipherPassword(ciphertext: any) {
    // Decrypt
    var bytes = CryptoJS.AES.decrypt(ciphertext, this.secretString);
    var plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return plaintext;
  }


  async getAccounts() {
    await this.accounts.list({order: "name" })
      .then((arr) => {
        for (let i of arr.data) {
          i.password = this.deCipherPassword(i.password);
          this.list.push(i);
        }
      })
  }

  async getSettings() {
    let myTimer;
    await this.settings.list()
      .then((arr) => {
        if (arr.data.length > 0) {
          myTimer = arr.data[0].autoClear;
          this.autoSync = arr.data[0].autoSync;
        }
      });
    if (myTimer === "30s") {
      this.clearPassTime = 30;
    }
    else if (myTimer === "45s") {
      this.clearPassTime = 45;
    }
    else if (myTimer === "1m") {
      this.clearPassTime = 60;
    }
    else if (myTimer === "Never") {
      this.clearPassTime = 0;
    }
    else {
      //first time
      console.log("first time");
    }
    this.timeLeft = this.clearPassTime;
  }

  async presentActionSheet(l: any) {
    const actionSheet = await this.actionSheetController.create({
      header: l.name,
      buttons: [{
        text: 'Copy Password',
        icon: 'clipboard',
        handler: () => {
          this.copyPassword(l);
          this.copiedToast();
        }
      }, {
        text: 'View / Edit',
        icon: 'eye',
        handler: () => {
          this.editEntry(l);
        }
      }, {
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.deleteRecord(l);
        }
      },
      {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }

  async copiedToast() {
    const toast = await this.toastController.create({
      message: 'Your password is copied to clipboard for selected duration.',
      position: 'top',
      duration: 3000
    });
    toast.present();
  }

  async deletedToast() {
    const toast = await this.toastController.create({
      message: 'Your account is deleted.',
      position: 'top',
      duration: 3000
    });
    toast.present();
  }

  addNew() {
    this.router.navigateByUrl('/app/tabs/tab1/newentry');
  }

  editEntry(l: any) {
    this.navCtrl.navigateForward(`/app/tabs/tab1/editentry/${l.id}`);
  }

  copyPassword(l: any) {
    if (this.timeLeft !== this.clearPassTime) {
      clearInterval(this.interval);
    }
    this.clipboard.copy(l.password);
    this.timeLeft = this.clearPassTime;
    if (this.clearPassTime === 0) {
      return;
    }
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.interval);
        this.timeLeft = this.clearPassTime;
        this.clipboard.clear();
      }
    }, 1000);
  }

  async deleteRecord(l: any) {
    await this.accounts.delete(l.id)
      .then(() => {
        this.deletedToast(); this.ionViewWillEnter()
      });
    if (this.autoSync) {
      await this.accounts.sync();
    }
  }
}

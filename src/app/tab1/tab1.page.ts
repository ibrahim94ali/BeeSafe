import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, ToastController, NavController, AlertController } from '@ionic/angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  list = [];
  secretString = `${"ibrahim94ali"}:${"admin123"}`;
  db = null;
  accounts = null;

  clearPassTime = 30;
  timeLeft = this.clearPassTime;
  interval = null;

  constructor(private router: Router, public actionSheetController: ActionSheetController, public toastController: ToastController,
    public navCtrl: NavController, public alertController: AlertController, private clipboard: Clipboard) { }

  ionViewWillEnter() {
    this.list = [];

    this.getAccounts();
  }

  ngOnInit() {

    this.db = new window.Kinto({
      remote: "https://kinto.dev.mozaws.net/v1/", headers: {
        Authorization: "Basic " + btoa(this.secretString)
      }
    });

    this.accounts = this.db.collection("accounts");
  }


  async getAccounts() {
    await this.accounts.list({ order: "name" })
      .then((arr) => {
        for (let i of arr.data) {
          this.list.push(i);
        }
      })
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
    this.router.navigateByUrl('/tabs/tab1/newentry');
  }

  editEntry(l: any) {
    this.navCtrl.navigateForward(`/tabs/tab1/editentry/${l.name}/${l.email}/${l.password}`);
  }

  copyPassword(l: any) {
    if (this.timeLeft !== this.clearPassTime) {
      clearInterval(this.interval);
    }
    this.clipboard.copy(l.password);
    this.timeLeft = this.clearPassTime;
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
      })
  }
}

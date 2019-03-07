import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, ToastController, NavController, AlertController } from '@ionic/angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';
declare var require: any
var KintoClient = require("kinto-http");

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  list = [];
  secretString = `${"ibrahim94ali"}:${"admin123"}`;
  client = null;

  clearPassTime = 30;
  timeLeft = this.clearPassTime;
  interval = null;

  constructor(private router: Router, public actionSheetController: ActionSheetController, public toastController: ToastController,
    public navCtrl: NavController, public alertController: AlertController, private clipboard: Clipboard) { }

    ionViewWillEnter()
    {
      console.log("girdimwillenter");
      this.list = [];
      
        this.client.bucket("mysafe").collection("accounts")
        .listRecords()
        .then(result => {
          for (let i of result.data) {
          this.list.push(i);
          }
        });
    }

    ngOnInit(){
      this.client = new KintoClient("https://kinto.dev.mozaws.net/v1/", {
        headers: {
          Authorization: "Basic " + btoa(this.secretString)
        }
      });
}

  async presentActionSheet(l:any) {
    const actionSheet = await this.actionSheetController.create({
      header:  l.name,
      buttons: [{
        text: 'Copy Password',
        icon: 'clipboard',
        handler: () => {
          this.copyPassword(l);
          this.copiedToast();
        }
      },{
        text: 'View / Edit',
        icon: 'eye',
        handler: () => {
          this.editEntry(l);
        }
      },{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.client.bucket("mysafe").collection("accounts")
          .deleteRecord(l.id)
          .then(() => {this.deletedToast(); this.ionViewWillEnter()});
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

  addNew()
  {
    this.router.navigateByUrl('/tabs/tab1/newentry');
  }

  editEntry(l:any)
  {
    this.navCtrl.navigateForward(`/tabs/tab1/editentry/${l.name}/${l.email}/${l.password}`);
  }

  copyPassword(l:any)
  {
    if(this.timeLeft !== this.clearPassTime)
    {
      clearInterval(this.interval);
    }
    this.clipboard.copy(l.password);
    this.timeLeft = this.clearPassTime;
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.interval);
        this.timeLeft = this.clearPassTime;
        this.clipboard.clear();
      }
    },1000);
  }
}

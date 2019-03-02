import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  facebook = {name: "facebook", username: "ibrahim94ali", password: "ibra"};
  twitter = {name: "twitter", username: "ibrahim_ali__", password: "ibra"};
  list = [this.facebook, this.twitter];

  constructor(private router: Router, public actionSheetController: ActionSheetController, public toastController: ToastController) { }

  async presentActionSheet(l:any) {
    const actionSheet = await this.actionSheetController.create({
      header:  l.name,
      buttons: [{
        text: 'View',
        icon: 'eye',
        handler: () => {
          console.log('View clicked');
        }
      }, {
        text: 'Copy Password',
        icon: 'clipboard',
        handler: () => {
          this.copiedToast();
          console.log('Copy clicked');
        }
      },{
        text: 'Edit',
        icon: 'build',
        handler: () => {
          console.log('Edit clicked');
        }
      },{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.deletedToast();
          console.log('Delete clicked');
        }
      }, 
      {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  async copiedToast() {
    const toast = await this.toastController.create({
      message: 'Your password is copied to clipboard for selected duration.',
      duration: 3000
    });
    toast.present();
  }

  async deletedToast() {
    const toast = await this.toastController.create({
      message: 'Your account is deleted.',
      duration: 3000
    });
    toast.present();
  }

  addNew()
  {
    this.router.navigateByUrl('/tabs/tab1/newentry');
  }
}

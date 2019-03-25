import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit  {
  settingsData = { autoClear: "30s", fingerprint: false, autoFill: false, id:"", autoSync: false};
  duration = [true, false, false, false];
  db = null;
  settings = null;
  accounts = null;
  secretString = null;
  constructor(public alertController: AlertController, public toastController: ToastController,
    private authService: AuthenticationService) { }

  
  ionViewWillEnter()
  {
    console.log(this.settingsData);
  }

  ngOnInit() {

    this.secretString = this.authService.getId();

    this.db = new window.Kinto({
      remote: "https://kinto.dev.mozaws.net/v1/", headers: {
        Authorization: "Basic " + this.secretString
      }
    });

    this.settings = this.db.collection("settings");
    this.accounts = this.db.collection("accounts");
    this.getSettings();
  }

  async getSettings() {
    await this.settings.list()
      .then((arr) => {
        if(arr.data.length > 0){
        this.settingsData.autoClear = arr.data[0].autoClear;
        this.settingsData.fingerprint = arr.data[0].fingerprint;
        this.settingsData.autoFill = arr.data[0].autoFill;
        this.settingsData.id = arr.data[0].id;
        this.settingsData.autoSync = arr.data[0].autoSync;
        }
      })
      .catch(e => {
        console.log(e);
      });
      this.setAutoClear();
  }

  async autoSync()
  {
    this.settings.update(this.settingsData);

    if(this.settingsData.autoSync === true)
    {
      this.synchronize();
    }

  }

  async autoFill()
  {
    //fill permittions
    this.settings.update(this.settingsData);

    if(this.settingsData.autoSync === true)
    {
      this.synchronize();
    }
  }

  setAutoClear()
  {
    if(this.settingsData.autoClear === "30s")
    {
      this.duration = [true, false, false, false];
    }
    else if(this.settingsData.autoClear === "45s")
    {
      this.duration = [false, true, false, false];
    }
    else if(this.settingsData.autoClear === "1m")
    {
      this.duration = [false, false, true, false];      
    }
    else
    {
      this.duration = [false, false, false, true];
    }
  }

  async changeDuration() {
    const alert = await this.alertController.create({
      header: 'Auto-clear Password After',
      inputs: [
        {
          name: '30s',
          type: 'radio',
          label: '30 seconds',
          value: '30s',
          checked: this.duration[0]
        },
        {
          name: '45s',
          type: 'radio',
          label: '45 seconds',
          value: '45s',
          checked: this.duration[1]
        },
        {
          name: '1m',
          type: 'radio',
          label: '1 minute',
          value: '1m',
          checked: this.duration[2]
        },
        {
          name: 'Never',
          type: 'radio',
          label: 'Never',
          value: 'Never',
          checked: this.duration[3]
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            if (data === "30s") {
              this.duration[0] = true;
              this.duration[1] = false;
              this.duration[2] = false;
              this.duration[3] = false;
              this.settingsData.autoClear = "30s";

            }
            else if (data === "45s") {
              this.duration[0] = false;
              this.duration[1] = true;
              this.duration[2] = false;
              this.duration[3] = false;
              this.settingsData.autoClear = "45s";
            }
            else if (data === "1m") {
              this.duration[0] = false;
              this.duration[1] = false;
              this.duration[2] = true;
              this.duration[3] = false;
              this.settingsData.autoClear = "1m";
            }
            else {
              this.duration[0] = false;
              this.duration[1] = false;
              this.duration[2] = false;
              this.duration[3] = true;
              this.settingsData.autoClear = "Never";
            }
            this.settings.update(this.settingsData);
            if(this.settingsData.autoSync === true){
            this.synchronize();
            }
            this.okToast();
          }
        }
      ]
    });

    await alert.present();
  }

  async fingerprint() {
    const alert = await this.alertController.create({
      header: 'Fingerprint Scanner',
      buttons: [
        {
          text: 'Disable',
          cssClass: 'secondary',
          handler: () => {
            this.settingsData.fingerprint = false;
            this.settings.update(this.settingsData);
            if(this.settingsData.autoSync === true){
            this.synchronize();
            }
            this.okToast();
          }
        }, {
          text: 'Enable',
          handler: () => {
            this.settingsData.fingerprint = true;
            this.settings.update(this.settingsData);
            if(this.settingsData.autoSync === true){
            this.synchronize();
            }
            this.okToast();
          }
        }
      ]
    });

    await alert.present();
  }


  async okToast() {
    const toast = await this.toastController.create({
      message: 'Your settings have been saved.',
      position: 'top',
      duration: 3000
    });
    toast.present();
  }

  async passwordError() {
    const toast = await this.toastController.create({
      message: 'Your passwords do not match!',
      showCloseButton: true,
      position: 'top',
      closeButtonText: 'OK'
    });
    toast.present();
  }

  async synchronize() {

    const db = new window.Kinto({
      remote: "https://kinto.dev.mozaws.net/v1/", headers: {
        Authorization: "Basic " + this.secretString
      }
    });

    const accounts = db.collection("accounts");
    await accounts.sync();
    await this.settings.sync();
    this.syncDone();
  }

  async syncDone() {
    const toast = await this.toastController.create({
      message: 'Synchronization is done.',
      position: 'top',
      duration: 3000
    });
    toast.present();
  }
}

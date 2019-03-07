import { Component } from '@angular/core';
import { AlertController, ToastController} from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  duration=[true,false,false,false];
  fingerprintOption = true;
  constructor(public alertController: AlertController, public toastController: ToastController){}
  signOut()
  {

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
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            if(data === "30s"){
              this.duration[0] = true;
              this.duration[1] = false;
              this.duration[2] = false;
              this.duration[3] = false;

            }
            else if(data === "45s")
            {
              this.duration[0] = false;
              this.duration[1] = true;
              this.duration[2] = false;
              this.duration[3] = false;
            }
            else if(data === "1m")
            {
              this.duration[0] = false;
              this.duration[1] = false;
              this.duration[2] = true;
              this.duration[3] = false;
            }
            else{
              this.duration[0] = false;
              this.duration[1] = false;
              this.duration[2] = false;
              this.duration[3] = true;
            }
            console.log('Confirm Ok ', data);
            this.okToast();
          }
        }
      ]
    });

    await alert.present();
  }

  async changeEmail() {
    const alert = await this.alertController.create({
      header: 'Change Email',
      inputs: [
        {
          name: 'newEmail',
          type: 'text',
          placeholder: 'Your new e-mail'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok', data);
          }
        }
      ]
    });

    await alert.present();
  }

  async changePassword() {
    const alert = await this.alertController.create({
      header: 'Change Master Password',
      inputs: [
        {
          name: 'newPassword',
          type: 'password',
          placeholder: 'New Password'
        },
        {
          name: 'newPassword2',
          type: 'password',
          placeholder: 'Re-enter the New Password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            if(data.newPassword !== data.newPassword2)
            {
              this.passwordError();
            }
            else
            {
              this.okToast();
            }
            console.log('Confirm Ok', data);
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
            this.fingerprintOption = false;
            this.okToast();
            console.log( this.fingerprintOption);
          }
        }, {
          text: 'Enable',
          handler: () => {
            this.fingerprintOption = true;
            this.okToast();
            console.log( this.fingerprintOption);
          }
        }
      ]
    });

    await alert.present();
  }

  
  async okToast() {
    const toast = await this.toastController.create({
      message: 'Your settings have been saved.',
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

  async emailError() {
    const toast = await this.toastController.create({
      message: 'Your e-mail is already used.',
      showCloseButton: true,
      position: 'top',
      closeButtonText: 'OK'
    });
    toast.present();
  }
}

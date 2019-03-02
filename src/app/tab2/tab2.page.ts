import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  text = "";
  length = 16;
  toggle = {uppercase: true, lowercase: true, numbers: true, symbols: true};
  constructor(public toastController: ToastController){ this.generatePass();  }

  generatePass()
  {
    this.text = "";
    var possible = "";
    var uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var lowercase = "abcdefghijklmnopqrstuvwxyz";
    var numbers = "0123456789";
    var symbols = "!@#$%^&*";

    if(this.toggle.uppercase)
    {
      possible = possible.concat(uppercase);
    }
    if(this.toggle.lowercase)
    {
      possible = possible.concat(lowercase);
    }
    if(this.toggle.numbers)
    {
      possible = possible.concat(numbers);
    }
    if(this.toggle.symbols)
    {
      possible = possible.concat(symbols);
    }
      for(var i = 0; i < this.length; i++) {
          this.text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
  }

  copyPass()
  {
    this.okToast();

  }

  async okToast() {
    const toast = await this.toastController.create({
      message: 'Your password is copied to clipboard for selected duration.',
      duration: 3000
    });
    toast.present();
  }
}




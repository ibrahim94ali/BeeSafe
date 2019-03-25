import { Component, OnInit } from '@angular/core';
import {AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  user = {
    email : "",
    password : ""
  }


  constructor(public alertCtrl: AlertController, public toastCtrl: ToastController, private router: Router,
    private authService: AuthenticationService) { }

  ngOnInit() {
    
  }

  async signIn()
  {

      if(this.user.email === "" || this.user.password === ""){
      this.blankInputs();
      return;
      }

      const secretString = `${this.user.email}:${this.user.password}`;

        this.authService.login(secretString);
  }
 
  async blankInputs(){
  const prompt = await this.alertCtrl.create({
    header: 'Please fill required blanks!',
    buttons: [
      {
        text: 'OK',
        handler: data => {
        console.log('OK clicked');
        }
      },
    ]
  })
  await prompt.present();
}
}
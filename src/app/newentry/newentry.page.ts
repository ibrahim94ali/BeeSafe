import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-newentry',
  templateUrl: './newentry.page.html',
  styleUrls: ['./newentry.page.scss'],
})
export class NewentryPage implements OnInit {

  account = {name: "", email: "", password: ""};

  showPass = true;

  constructor(private router: Router, public toastController: ToastController) { }

  ngOnInit() {
  }

  save()
  {
    console.log(this.account);
    this.okToast();
    this.router.navigateByUrl('/tabs/tab1');
  }

  async okToast() {
    const toast = await this.toastController.create({
      message: 'Your account information is saved.',
      duration: 3000
    });
    toast.present();
  }
  
}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-editentry',
  templateUrl: './editentry.page.html',
  styleUrls: ['./editentry.page.scss'],
})
export class EditentryPage implements OnInit {

  account = {name: "", email: "", password: ""};

  showPass = true;

  constructor(private router: Router, public toastController: ToastController, private route: ActivatedRoute) {   }

  ngOnInit() {
    this.account.name = this.route.snapshot.paramMap.get('name');
    this.account.email = this.route.snapshot.paramMap.get('email');
    this.account.password = this.route.snapshot.paramMap.get('pass');
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

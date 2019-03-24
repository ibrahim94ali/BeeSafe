import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-editentry',
  templateUrl: './editentry.page.html',
  styleUrls: ['./editentry.page.scss'],
})
export class EditentryPage implements OnInit {

  account = {name: "", email: "", password: "", id: ""};

  showPass = true;
  db = null;

  constructor(private router: Router, public toastController: ToastController, private route: ActivatedRoute) {   }

  ngOnInit() {
    this.account.name = this.route.snapshot.paramMap.get('name');
    this.account.email = this.route.snapshot.paramMap.get('email');
    this.account.password = this.route.snapshot.paramMap.get('pass');
    this.account.id = this.route.snapshot.paramMap.get('id');

   
      const secretString = `${"ibrahim94ali"}:${"admin123"}`;

      this.db = new window.Kinto({
        remote: "https://kinto.dev.mozaws.net/v1/", headers: {
          Authorization: "Basic " + btoa(secretString)
        }
      });
}

  async save()
  {
    const accounts = this.db.collection("accounts");

    
    await accounts.update(this.account)
      .then(() => {
        this.okToast();
        this.router.navigateByUrl('tabs/tab1');
      })
      .catch(e => console.log(e));

    await accounts.sync();
  }

  async okToast() {
    const toast = await this.toastController.create({
      message: 'Your account information is saved.',
      duration: 3000
    });
    toast.present();
  }

}

import { Component } from '@angular/core';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  secretString = `${"ibrahim94ali"}:${"admin123"}`;
  db = null;
  accounts = null;
  constructor(private faio: FingerprintAIO, private platform: Platform) { }
  ngOnInit() {

    //this.fingerPrintScanner();

    this.db = new window.Kinto({
      remote: "https://kinto.dev.mozaws.net/v1/", headers: {
        Authorization: "Basic " + btoa(this.secretString)
      }
    });

    this.accounts = this.db.collection("accounts");
    this.synchData()
  }

  fingerPrintScanner() {
    this.faio.show({
      clientId: 'Fingerprint-Demo',
      clientSecret: 'password', //Only necessary for Android
      disableBackup: false,  //Only for Android(optional)
      localizedFallbackTitle: 'Use Pin', //Only for iOS
      localizedReason: 'Please authenticate' //Only for iOS
    })
      .then((result: any) => console.log(result))
      .catch((error: any) => {
        console.log(error);
        navigator['app'].exitApp();
      });

  }
  async synchData() {
    await this.accounts.sync();
  }

}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
declare var require: any
var CryptoJS = require("crypto-js");

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  profileId = null;
  db = null;

  authenticationState = new BehaviorSubject(false);
  authenticationProcess = new BehaviorSubject(false);

  constructor(private plt: Platform, private faio: FingerprintAIO) {
    this.plt.ready().then(() => {
      this.checkToken();
    });
  }

  async login(secretString: any) {
    this.profileId = secretString;

    this.db = new window.Kinto({
      remote: "https://kinto.dev.mozaws.net/v1/", headers: {
        Authorization: "Basic " +  this.profileId
      }
    });
    const accounts = this.db.collection("accounts");
    await accounts.sync();
    const settings = this.db.collection("settings");
    const profile = this.db.collection("profile");
    await profile.create({ credentials:  this.profileId });

    let newSettings = { autoClear: "30s", fingerprint: false, autoSync: true}

    await settings.create(newSettings)
    .then(() => {
        this.syncdata(profile, settings);
        this.authenticationProcess.next(true);
        return this.authenticationState.next(true);
    });
}

async syncdata(profile:any, settings:any)
{
  await profile.sync();
  await settings.sync();
}

  isAuthenticated() {
    return this.authenticationState.value;
  }
  async checkToken() {
    var fPrint = false;
    const db = new window.Kinto({
      remote: "https://kinto.dev.mozaws.net/v1/", headers: {
        Authorization: "Basic " + btoa("admin")
      }
    });
    const settings = db.collection("settings");
    const profile = db.collection("profile");
    await settings.list()
    .then(arr => {
      if(arr.data.length > 0)
      {
        fPrint = arr.data[0].fingerprint;
      }
    });
    await profile.list()
      .then(arr => {
        console.log(arr);
        if (arr.data.length > 0)
          this.profileId = arr.data[0].credentials;
      });

    if (this.profileId !== null && fPrint === false) {
      this.authenticationProcess.next(true);
      return this.authenticationState.next(true);
    }
    else if(this.profileId !== null && fPrint)
    {
      this.fingerPrint();
    }
    else{
      this.authenticationProcess.next(true);
    return this.profileId;
    }
  }

  getId() {
    return this.profileId;
  }

  async fingerPrint()
  {
    this.faio.show({
      clientId: 'Fingerprint-Demo',
      clientSecret: 'password', //Only necessary for Android
      disableBackup: false,  //Only for Android(optional)
      localizedFallbackTitle: 'Use Pin', //Only for iOS
      localizedReason: 'Please authenticate' //Only for iOS
    })
      .then((result: any) => {console.log(result); this.authenticationProcess.next(true); this.authenticationState.next(true);})
      .catch((error: any) => {
        console.log(error);
        this.authenticationState.next(false);
        navigator['app'].exitApp();
      });    
  }
}

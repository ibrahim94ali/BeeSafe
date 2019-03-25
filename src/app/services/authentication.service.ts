import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';
import { async } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  profileId = null;
  db = null;

  authenticationState = new BehaviorSubject(false);

  constructor(private plt: Platform) {
    this.plt.ready().then(() => {
      this.checkToken();
    });
  }

  async login(secretString: any) {
    var settingsExist = false;
    this.profileId = btoa(secretString);

    const tempDb = new window.Kinto({
      remote: "https://kinto.dev.mozaws.net/v1/", headers: {
        Authorization: "Basic " + btoa("admin")
      }
    });
    const tempProfile = tempDb.collection("profile");
    await tempProfile.create({ credentials: btoa(secretString) })


    this.db = new window.Kinto({
      remote: "https://kinto.dev.mozaws.net/v1/", headers: {
        Authorization: "Basic " + btoa(secretString)
      }
    });
    const settings = this.db.collection("settings");

    let newSettings = { autoClear: "30s", fingerprint: false, autoFill: false, autoSync: true, credentials: this.profileId }

    await settings.list({filters: {credentials: this.profileId}})
    .then(arr => {
      if(arr.data.length !==  0)
      {
        return this.authenticationState.next(true);
      }
      else{
        settingsExist = true;
      }
    })

    if(settingsExist){
    await settings.create(newSettings)
    .then(() => {
        return this.authenticationState.next(true);
    });
  }
  }
  async logout() {
    let myprofile = null;
    const tempDb = new window.Kinto({
      remote: "https://kinto.dev.mozaws.net/v1/", headers: {
        Authorization: "Basic " + btoa("admin")
      }
    });
    const tempProfile = tempDb.collection("profile");
    await tempProfile.list()
    .then(arr => {
      myprofile = arr.data[0];
    });

    await tempProfile.delete(myprofile.id)
    .then(()=>{
      console.log(myprofile.id);
      return this.authenticationState.next(false);
    })
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }
  async checkToken() {
    const db = new window.Kinto({
      remote: "https://kinto.dev.mozaws.net/v1/", headers: {
        Authorization: "Basic " + btoa("admin")
      }
    });

    const profile = db.collection("profile");
    await profile.list()
      .then(arr => {
        console.log(arr);
        if (arr.data.length > 0)
          this.profileId = arr.data[0].credentials;
      });

    if (this.profileId !== null) {
      this.authenticationState.next(true);
    }
    return this.profileId;
  }

  getId() {
    return this.profileId;
  }
}

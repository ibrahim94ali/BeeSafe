import { Component } from '@angular/core';

import { Platform, LoadingController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';

declare global {
  interface Window { Kinto: any; }
}
window.Kinto = window.Kinto || {};

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  loading = null;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthenticationService,
    private router: Router,
    public loadingController: LoadingController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString('#ffffff');
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.authService.authenticationProcess.subscribe(state=> {
        console.log('Process: ', state);
        if(state){
          //dismiss loader
          this.dismissLoading();
                              
        }
        else{
          //create loader
         this.presentLoading();
          
        }
      });

      this.authService.authenticationState.subscribe(state=>{
        console.log('Auth changed: ', state);
        if(state){
          this.router.navigate(['app']);          
        }
        else{
          this.router.navigate(['login']);
        }

      });
    });
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Please Wait',
      spinner: 'bubbles'
    });
    await this.loading.present();
  }

  async dismissLoading()
  {
    await this.loading.dismiss();
  }
}

import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
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
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString('#ffffff');
      this.statusBar.styleDefault();
      this.splashScreen.hide();

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
}

import { Component, OnInit } from '@angular/core';
import { CapacitorGoogleMaps } from '@capacitor-community/capacitor-googlemaps-native';
import {SplashScreen} from '@capacitor/splash-screen'
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  constructor() { 
    CapacitorGoogleMaps.initialize({
      key: environment.mapsKey
    })
  }
  
  ngOnInit(){
    //this.showSplashScreen()
  }

  async showSplashScreen() {
    await SplashScreen.show({
      showDuration: 4000,
      autoHide: true,
      
    })
  }
}

import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { initializeApp,firestore, auth } from 'firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = 'AuthPage';

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {

    const config = {
      apiKey: "AIzaSyDEc-5ag5GnaNozK_yehbaZfekqEL06lpI",
      authDomain: "tarefa-dc71d.firebaseapp.com",
      databaseURL: "https://tarefa-dc71d.firebaseio.com",
      projectId: "tarefa-dc71d",
      storageBucket: "tarefa-dc71d.appspot.com",
      messagingSenderId: "999453186000"
    };
    
    initializeApp(config);
    firestore().settings({timestampsInSnapshots: true});

    firestore().enablePersistence()
    .then(function() {
        // Initialize Cloud Firestore through firebase
        // var db = firebase.firestore();
    })
    .catch(function(err) {
        if (err.code == 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled
            // in one tab at a a time.
            // ...
        } else if (err.code == 'unimplemented') {
            // The current browser does not support all of the
            // features required to enable persistence
            // ...
        }
    });

    platform.ready().then(() => {
      
      auth().onAuthStateChanged((user:firebase.User)=>{
        if(this.rootPage=="AuthPage"){
          if(user!=null){
            this.rootPage="HomePage";
          }
        }else{
          if(user==null){
            this.rootPage="AuthPage";
          }
        }
      });

      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
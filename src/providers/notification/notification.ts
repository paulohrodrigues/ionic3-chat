import { HttpClient } from '@angular/common/http';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { FCM } from '@ionic-native/fcm';
import { ToastController } from 'ionic-angular';
import database from 'firebase';

/*
  Generated class for the NotificationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NotificationProvider {

  constructor(public http: Http, public fcm: FCM, public toastCtrl: ToastController) {
    console.log('Hello NotificationProvider Provider');
  }

  notifiction(){
    this.fcm.onNotification().subscribe(data=>{
      if(data.wasTapped){
        console.log("Received in background");
      } else {
        console.log(data)
        let toast = this.toastCtrl.create({
          message: 'Nova Mensagem',
          duration: 3000,
          position: "top"
        });
        toast.present();
        console.log("Received in foreground");
      };
    });
  }

  generateToken(): Promise<string>{
    return new Promise((resolve)=>{
      this.fcm.getToken().then(token=>{
        console.log("Token");
        console.log(token);
        resolve(token);
      });
    });
  }

  sendNotification(title:string, body:string, token:string): Promise<any>{
    return new Promise((resolve)=>{
      let headers = new Headers({ 'Authorization': 'key=AIzaSyA24UO6Wk0xUpK8AcKSiVlyptuW2-eyQu8', 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      let notification = {
        "notification": {
          "title": title,
          "body": body,
          "click_action": "FCM_PLUGIN_ACTIVITY",
          "sound": "default"
        }, "data": {
          //OPTIONAL PARAMS
        },
        "to": token,
        "priority": "high"
      }
      let url = 'https://fcm.googleapis.com/fcm/send';
      this.http.post(url, notification, options).subscribe(data => {
          console.log(data);
          resolve(data);
        }, error => {
          console.log(error);// Error getting the data
          resolve(error);
      });
    });
  }
}

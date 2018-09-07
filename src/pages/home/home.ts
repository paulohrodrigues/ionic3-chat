import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { auth, firestore } from 'firebase';
import { NotificationProvider } from '../../providers/notification/notification';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [NotificationProvider]
})
export class HomePage {

  public toUser : {toUserId: string, toUserName: string, toUserToken: string};
  public listToUser=[];
  public userId:string = localStorage.getItem("id");

  constructor(public notification: NotificationProvider) {
    this.listUsers();
  }

  private listUsers(){
    firestore()
    .collection("users")
    .get()
    .then((users:firestore.QuerySnapshot)=>{
      users.forEach((r)=>{
        if(r.id!=this.userId){
          this.listToUser.push({
            toUserId:r.id,
            toUserName:r.data().name,
            toUserToken:r.data().token,
            email:r.data().email
          });
        }
      });
    });
  }


  public exit():void{
    var self=this;
    auth().signOut().then(()=>{
      self.notification.generateToken().then((token)=>{
        firestore()
        .collection("users")
        .doc(localStorage.getItem("id")).update({
          token: null
        }).then(()=>{
           localStorage.setItem("id",null);
        });
      });
    });

  }

}
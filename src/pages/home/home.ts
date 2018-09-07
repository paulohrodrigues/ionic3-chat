import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { auth, firestore } from 'firebase';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public toUser : {toUserId: string, toUserName: string};
  public listToUser=[];
  public userId:string = localStorage.getItem("id");

  constructor() {
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
            email:r.data().email
          });
        }
      });
    });
  }


  public exit():void{
    auth().signOut().then(()=>{
      localStorage.setItem("id",null);
    });
  }

}
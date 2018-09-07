import { auth, firestore } from 'firebase';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Alert } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-auth',
  templateUrl: 'auth.html',
})
export class AuthPage {

  public cadastro:boolean = true;
  public data:{nome:string,email:string,password:string}={
    nome:"",
    email:"",
    password:""
  };

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  private cadastrar(){
    auth()
    .createUserWithEmailAndPassword(this.data.email,this.data.password)
    .then((user:auth.UserCredential)=>{
      localStorage.setItem("id",user.user.uid);
      localStorage.setItem("name",this.data.nome);
      firestore()
      .collection("users")
      .doc(user.user.uid)
      .set({
        name:this.data.nome,
        email:this.data.email  
      })
      .then(()=>{  
        alert("Cadastrado com Sucesso!");
      });
    })
    .catch(()=>{
      alert("Dados Incorretos!");
    });
  }

  private logar(){
    auth()
    .signInWithEmailAndPassword(this.data.email,this.data.password)
    .then((result:auth.UserCredential)=>{
      localStorage.setItem("id",result.user.uid);
      firestore()
      .collection("users")
      .doc(result.user.uid)
      .get()
      .then((r:firestore.DocumentSnapshot)=>{
        localStorage.setItem("name",r.data().name);
      });
    })
    .catch(()=>{
      alert("Dados Incorretos!");
    });
  }

  public generate(){
      (this.cadastro==true) ? this.cadastrar() : this.logar();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AuthPage');
  }

}
import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { Events, Content } from 'ionic-angular';
import { ChatService, ChatMessage, UserInfo } from "../../providers/chat-service";
import { firestore } from 'firebase';
import { NotificationProvider } from '../../providers/notification/notification';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
  providers: [NotificationProvider]
})
export class Chat {

  @ViewChild(Content) content: Content;
  @ViewChild('chat_input') messageInput: ElementRef;
  msgList: ChatMessage[] = [];
  user: UserInfo;
  toUser: UserInfo;
  editorMsg = '';
  showEmojiPicker = false;

  constructor(navParams: NavParams,
              private chatService: ChatService,
              private events: Events,
              public notification: NotificationProvider) {
    // Get the navParams toUserId parameter
    this.toUser = {
      id: navParams.get('toUserId'),
      name: navParams.get('toUserName'),
      token: navParams.get('toUserToken')
    };
    // Get mock user information
    this.chatService.getUserInfo()
    .then((res) => {
      this.user = res
      this.firebaseFind(this.user.id);
    });

    
  }

  ionViewWillLeave() {
    // unsubscribe
    this.events.unsubscribe('chat:received');
  }

  ionViewDidEnter() {
    //get message list
    this.getMsg();

    // Subscribe to received  new message events
    // this.events.subscribe('chat:received', msg => {
    //   this.pushNewMsg(msg);
    // })
  }

  onFocus() {
    this.showEmojiPicker = false;
    this.content.resize();
    this.scrollToBottom();
  }

  switchEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
    if (!this.showEmojiPicker) {
      this.focus();
    } else {
      this.setTextareaScroll();
    }
    this.content.resize();
    this.scrollToBottom();
  }

  /**
   * @name getMsg
   * @returns {Promise<ChatMessage[]>}
   */
  getMsg() {
    // Get mock message list
    return this.chatService
    .getMsgList()
    .subscribe(res => {
      this.msgList = res;
      this.scrollToBottom();
    });
  }

  /**
   * @name sendMsg
   */
  sendMsg() {
    if (!this.editorMsg.trim()) return;

    // Mock message
    let newMsg = {
      toUserName:this.toUser.name,
      messageId: Date.now().toString(),
      userId: this.user.id,
      userName: this.user.name,
      userAvatar: this.user.avatar,
      toUserId: this.toUser.id,
      time: Date.now(),
      message: this.editorMsg,
      status: 'success'
    };

    firestore()
    .collection("msg")
    .doc()
    .set(newMsg)
    .then(()=>{
      this.msgList.push(newMsg);
      this.scrollToBottom();
      // if (!this.showEmojiPicker) {
      //   this.focus();
      // }
    });
    this.notification.sendNotification(this.user.name+" envio uma mensagem", "", this.toUser.token);
    this.editorMsg = '';
  }


  updateMsg(msgFull){

    this.msgList=msgFull;
    this.scrollToBottom();
    // if (!this.showEmojiPicker) {
    //   this.focus();
    // }
    // this.chatService.sendMsg(msg)
    // .then(() => {
    //   let index = this.getMsgIndexById(id);
    //   if (index !== -1) {
    //     this.msgList[index].status = 'success';
    //   }
    // });
  }


  firebaseFind(id){
    
    firestore()
    .collection("msg")
    .where("userId","==",this.toUser.id)
    .where("toUserId","==",id)
    .onSnapshot((result:firestore.QuerySnapshot)=>{
      var msgList=[];
      result.docs.forEach((r:firestore.QueryDocumentSnapshot)=>{
        let msg = {
          messageId: r.data().messageId,
          userId: r.data().userId,
          userName: r.data().userName,
          userAvatar: r.data().userAvatar,
          toUserId: r.data().toUserId,
          time: r.data().time,
          message: r.data().message,
          status: r.data().status
        }
        msgList.push(msg);
      });

      firestore()
      .collection("msg")
      .where("userId","==",id)
      .where("toUserId","==",this.toUser.id)  
      .get()
      .then((resul)=>{
        resul.docs.forEach((r:firestore.QueryDocumentSnapshot)=>{
          let msg = {
            messageId: r.data().messageId,
            userId: r.data().userId,
            userName: r.data().userName,
            userAvatar: r.data().userAvatar,
            toUserId: r.data().toUserId,
            time: r.data().time,
            message: r.data().message,
            status: r.data().status
          }
          msgList.push(msg);
        });
        this.updateMsg(msgList);
        this.msgList.sort(function(a, b){return parseInt(a.messageId)-parseInt(b.messageId)});
      });
    });
  }


  /**
   * @name pushNewMsg
   * @param msg
   */
  pushNewMsg(msg: ChatMessage) {
    const userId = this.user.id,
      toUserId = this.toUser.id;
    // Verify user relationships
    if (msg.userId === userId && msg.toUserId === toUserId) {
      this.msgList.push(msg);
    } else if (msg.toUserId === userId && msg.userId === toUserId) {
      this.msgList.push(msg);
    }
    this.scrollToBottom();
  }

  getMsgIndexById(id: string) {
    return this.msgList.findIndex(e => e.messageId === id)
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 400)
  }

  private focus() {
    if (this.messageInput && this.messageInput.nativeElement) {
      this.messageInput.nativeElement.focus();
    }
  }

  private setTextareaScroll() {
    const textarea =this.messageInput.nativeElement;
    textarea.scrollTop = textarea.scrollHeight;
  }
}

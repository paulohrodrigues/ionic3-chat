import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { EmojiProvider } from '../providers/emoji';
import { HttpClientModule } from "@angular/common/http";
import { Http, HttpModule } from '@angular/http';
import { NotificationProvider } from '../providers/notification/notification';
import { FCM } from '@ionic-native/fcm';


@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    IonicModule.forRoot(MyApp,{
      tabsHideOnSubPages:true,
      tabsLayout:'icon-left',
      preloadModules: true
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    EmojiProvider,
    NotificationProvider, 
    FCM
  ]
})
export class AppModule {}

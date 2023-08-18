import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './components/chat/chat.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SocketService } from './services/socket.service';
import { SocketIoConfig,SocketIoModule } from 'ngx-socket-io';
import { HttpClientModule } from '@angular/common/http';
const config: SocketIoConfig = { url: 'https://chatnodejs-54km.onrender.com', options: {} };
@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    SocketIoModule.forRoot(config),
    HttpClientModule
  ],
  providers: [SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }

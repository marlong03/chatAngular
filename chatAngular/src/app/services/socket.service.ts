import { EventEmitter, Injectable, Output } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService extends Socket{
  @Output() outEven = new EventEmitter();

  constructor(private socket: Socket) {
    super({
      url:'https://chatnodejs-54km.onrender.com',
      options:{
        query:{
          
        }
      }
    })
    this.listen()
  }
  saludar(){
    alert("holsa")
  }
  listen = () => {
    this.ioSocket.on('chat', (res:any) => this.outEven.emit(res));   
  }
  emitEvent = (payload = "") => {
    this.ioSocket.emit('chat', payload)
  }

  
  
}

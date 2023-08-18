import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MessagesService } from 'src/app/services/messages.service';
import { SocketService } from 'src/app/services/socket.service';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  
  @ViewChild('myDiv', { static: false }) myDivRef!: ElementRef;
  @Input() dataConversacion: any = {};
  
  constructor(private socketService:SocketService,
              private messagesService:MessagesService){
    this.socketService.outEven.subscribe((res:any)=>{
      
      this.listaMensajes.push(res)
        this.scrollToBottom() 
    })
  }

  ngOnInit() {
  }

  usuarioHost = {
    "idusuario": 1,
    "nombre": "juan",
    "correo": "juan@gmail.com",
    "password": "123123"
  }
  listaMensajes:any = []

  //SOCKET --------
  scrollToBottom() {
    setTimeout(() => {
      const myDiv: HTMLElement = this.myDivRef.nativeElement;
      myDiv.scrollTo(0,document.body.scrollHeight);
    }, 0);
  }
  mensajeEnviar:string = ""
  enviarMensaje(){
      if(this.mensajeEnviar != ""){
        this.socketService.emitEvent(this.mensajeEnviar)
        this.guardarMensajeDB()
        this.mensajeEnviar = ""
        console.log(this.mensajeEnviar);
      }
      this.scrollToBottom() 
  }
  //SOCKET --------
  //API -----------
  guardarMensajeDB(){
    let msgEnviar =  {
      "idmensaje": 0,
      "mensaje": this.mensajeEnviar,
      "usuario_idusuario": this.usuarioHost.idusuario,
      "sala_idsala": this.dataConversacion.messages[0].sala_idsala
    }
    this.messagesService.guardarMensaje(msgEnviar).subscribe((res)=>{
      console.log(res);
    })
  }
}




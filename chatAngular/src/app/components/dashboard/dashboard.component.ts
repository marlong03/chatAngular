import { Component, OnInit } from '@angular/core';
import { MessagesService } from 'src/app/services/messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

  constructor(private usuarioService:UsuarioService,
              private messageService:MessagesService){}
  ngOnInit(): void {
    this.obtenerUsuarios()
    
  }
  listaUsuarios:any = []
  dataConversacion:any = {
    usuario:"",
    message:""
  }
  usuarioHost = {
    "idusuario": 1,
    "nombre": "juan",
    "correo": "juan@gmail.com",
    "password": "123123"
  }
  obtenerUsuarios(){
    this.usuarioService.obtenerUsuarios().subscribe((usuarios:any)=>{
      this.listaUsuarios = usuarios
      console.log(this.listaUsuarios);
    }) 
  }
  async seleccionarUsuario(usuario:any){
    this.dataConversacion.usuario = usuario
     this.messageService.obtenerSala(this.usuarioHost.idusuario, usuario.idusuario).subscribe((numeroSala:any)=>{
        this.messageService.obtenerMensajes(numeroSala.sala_idsala).subscribe((messages)=>{
          this.dataConversacion.messages = messages
          this.dataConversacion.messages = this.dataConversacion.messages.sort((a:any,b:any)=>a.idmensaje - b.idmensaje)
        })
    })
  }
}

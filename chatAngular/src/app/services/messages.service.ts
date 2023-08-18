import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(private http:HttpClient) { }

  obtenerSala(idusuario1:number,idusuario2:number){
    return this.http.get('http://localhost:3000/api/usuarioensala/'+idusuario1+'/'+idusuario2)
  }
  obtenerMensajes(idsala:number){
    return this.http.get('http://localhost:3000/api/mensaje/'+idsala)
  }
  guardarMensaje(message:any){
    console.log(message);
    
    return this.http.post('http://localhost:3000/api/mensaje/new',message)

  }
}

import { Injectable } from '@angular/core';

@Injectable()
export class CursosService {

getCursos(){
  return[
     {id: 1, nome: 'Teste1'},
     {id: 2, nome: 'Teste2'}
  ];
}

getCurso(id: number){
  let cursos = this.getCursos();
  for (let i=0; i<cursos.length; i++){
    let curso = cursos[i];
    if(curso.id == id){
      return curso;
    }
  }
  return null;
}

  Constructor() { }

}

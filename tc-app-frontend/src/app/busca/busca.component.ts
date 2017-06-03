import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-busca',
  templateUrl: './busca.component.html',
  styleUrls: ['./busca.component.css']
})
export class BuscaComponent implements OnInit {
  tweets = [];
  constructor() {
   
   }

  ngOnInit() {
  }

  search(){
    setInterval(() => { this.get_data(); }, 20000);
  }

  get_data(){
    console.log('aqui vai o fetch');
    let userName = (<HTMLInputElement>document.querySelector('#userName')).value;
    console.log("username=" + userName)
    let searchName = (<HTMLInputElement>document.querySelector('#searchName')).value;
    let timeInterval = (<HTMLInputElement>document.querySelector('#timeInterval')).value;
    let trackTerms = (<HTMLInputElement>document.querySelector('#trackTerms')).value;
    //let languages = document.querySelector();
    let url = `http://localhost:8080/tc-app-backend/rest/search/startSearch?userName=${userName}&searchName=${searchName}&trackTerms=${trackTerms}&languages&timeInterval=${timeInterval}`
    fetch(url)
    .then((res) => res.text())
    .then(
      (data) => {
        let json = JSON.parse(data);
        this.tweets.push(json.data);
        console.log("data " + data);
        console.log("tweets " + this.tweets);
    })
  }
}
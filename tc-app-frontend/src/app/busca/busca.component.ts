import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-busca',
  templateUrl: './busca.component.html',
  styleUrls: ['./busca.component.css']
})

export class BuscaComponent implements OnInit {
  
  tweets = [];
  recorrente = true;
  threadsCount = 0;

  constructor() {
  }

  ngOnInit() {
  }

  start_search() {
    this.recorrente = true;
    this.get_data();
  }

  get_data() {
    console.log('aqui vai o fetch');
    console.log(this.recorrente);
    let userName = "Candice";
    let searchName = "Search";
    let timeInterval = (<HTMLInputElement>document.querySelector('#timeInterval')).value;
    let trackTerms = (<HTMLInputElement>document.querySelector('#trackTerms')).value;
    let languages = (<HTMLInputElement>document.querySelector('#languages')).value;
    let url = `http://localhost:8080/tc-app-backend/rest/search/startSearch?userName=${userName}&searchName=${searchName}&trackTerms=${trackTerms}&languages=${languages}&timeInterval=${timeInterval}`
    fetch(url)
      .then((res) => res.text())
      .then(
      (data) => {
        let json = JSON.parse(data);
        this.tweets.push(json.data);
        console.log("data " + data);
        console.log("tweets " + this.tweets);
        if (this.recorrente === true) {
          this.get_data();
        }
      })
  }

  stop_search() {
    this.recorrente = false;
  }

}
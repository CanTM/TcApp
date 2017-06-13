import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Scale from "d3-scale";
import * as d3Array from "d3-array";
import * as d3Axis from "d3-axis";

class Frequency {
  public datetime: string;
  public frequency: number;
}

class Hashtags {
  public hashtag: string;
  public frequency: number;
}

@Component({
  selector: 'app-busca',
  templateUrl: './busca.component.html',
  styleUrls: ['./busca.component.css'],
})

export class BuscaComponent implements OnInit {
  
  STATISTICS: Frequency[] = [];
  LYFECYCLE: Hashtags[] = [];
  recorrente = true;
  displayDate: string;

  constructor() {
  }
  
  ngOnInit() {
    this.set_date_now();
    var freq: Frequency = {datetime: this.displayDate, frequency: 0};
    this.STATISTICS.push(freq);
    this.initSvg();  
    this.initAxis();
    this.drawAxis();  
    this.drawBars();
  }

  start_search() {
    this.recorrente = true;
    this.STATISTICS.pop();
    this.get_data();
  }

  set_date_now(){
    var date = new Date().toLocaleTimeString().split(":");
    var sec = date[2].split(" ");
    this.displayDate = date[0] + ":" + date[1] + ":" + sec[0];
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
        this.set_date_now();
        var freq: Frequency = {datetime: this.displayDate, frequency: json.nroTweets};
        this.STATISTICS.push(freq);

        json.hashtags.forEach(element => {
          var hash: Hashtags = {hashtag: element.hashtag, frequency: element.frequencia};
          console.log("hashtag: " + hash.hashtag + " frequencia: " + hash.frequency);
          this.LYFECYCLE.push(hash);
        });

        console.log("data " + data);
        this.STATISTICS.forEach(element => {
          console.log("frequency " + element.datetime + " " + element.frequency);
        });
        this.desenhar();
        if (this.recorrente === true) {
          this.get_data();
        }
      })
  }

  stop_search() {
    this.recorrente = false;
  }

//Desenho começa aqui
 
  desenhar(){
    this.initSvg();  
    this.initAxis();
    this.drawAxis();  
    this.drawBars();
  }

//Grafico nro de tweets

  private width1: number;
  private height1: number;
  private margin1 = {top: 20, right: 20, bottom: 30, left: 40};

  private x1: any;
  private y1: any;
  private svg1: any;
  private g1: any;


  private initSvg() {
    this.svg1 = d3.select("#chart").select("svg");
    this.width1 = +this.svg1.attr("width") - this.margin1.left - this.margin1.right + 40;
    this.height1 = +this.svg1.attr("height") - this.margin1.top - this.margin1.bottom;
    this.g1 = this.svg1.append("g")
                     .attr("transform", "translate(" + this.margin1.left + "," + this.margin1.top + ")");
    this.g1.append("rect")
          .attr("width", this.width1 + 40)
          .attr("height",this.height1 + 40)
          .style("fill", "white");
  }

  private initAxis() {
    this.x1 = d3Scale.scaleBand().rangeRound([0, this.width1 - 40]).padding(0.1);
    this.y1 = d3Scale.scaleLinear().rangeRound([this.height1, 0]);
    this.x1.domain(this.STATISTICS.map((d) => d.datetime));
    this.y1.domain([0, d3Array.max(this.STATISTICS, (d) => d.frequency)]);
  }

  private drawAxis() {
    this.g1.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(40," + this.height1 + ")")
          .call(d3Axis.axisBottom(this.x1));
    this.g1.append("g")
          .attr("class", "axis axis--y")
          .attr("transform", "translate(40," + 0 + ")")
          .call(d3Axis.axisLeft(this.y1))
          .append("text")
          .attr("class", "axis-title")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .attr("text-anchor", "end")
          .text("Número de tweets");
  }

  private drawBars() {
    this.g1.selectAll(".bar")
          .data(this.STATISTICS)
          .enter().append("rect")
          .style("fill", "steelblue")
          .attr("transform", "translate(40," + 0 + ")")
          .attr("x", (d) => this.x1(d.datetime) )
          .attr("y", (d) => this.y1(d.frequency) )
          .attr("width", this.x1.bandwidth())
          .attr("height", (d) => this.height1 - this.y1(d.frequency) );
  }

  //Grafico stream

}
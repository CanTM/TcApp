import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Scale from "d3-scale";
import * as d3Array from "d3-array";
import * as d3Axis from "d3-axis";

class Frequency {
  public letter: string;
  public frequency: number;
}

@Component({
  selector: 'app-busca',
  templateUrl: './busca.component.html',
  styleUrls: ['./busca.component.css'],
})

export class BuscaComponent implements OnInit {

  title = 'Pesquisa: Tweets';
  subtitle = 'Número de Tweets';
  
  STATISTICS: Frequency[] = [];
  recorrente = true;
  threadsCount = 0;
  nroBarra = 1;

  constructor() {
  }
  
  ngOnInit() {
    var displayDate = new Date().toLocaleTimeString();
    var freq: Frequency = {letter: displayDate, frequency: 0};
    this.STATISTICS.push(freq);
    this.initSvg();  
    this.initAxis();
    this.drawAxis();  
    this.drawBars();
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
        var displayDate = new Date().toLocaleTimeString();
        var freq: Frequency = {letter: displayDate, frequency: json.data};
        this.STATISTICS.push(freq);
        console.log("data " + data);
        this.STATISTICS.forEach(element => {
          console.log("frequency " + element.letter + " " + element.frequency);
        });
        console.log("nroBarra " + this.nroBarra);
        this.nroBarra++;
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

  private width: number;
  private height: number;
  private margin = {top: 20, right: 20, bottom: 30, left: 40};

  private x: any;
  private y: any;
  private svg: any;
  private g: any;


  private initSvg() {
    this.svg = d3.select("svg");
    this.width = +this.svg.attr("width") - this.margin.left - this.margin.right ;
    this.height = +this.svg.attr("height") - this.margin.top - this.margin.bottom;
    this.g = this.svg.append("g")
                     .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    this.g.append("rect")
                     .attr("width", this.svg.attr("width"))
                     .attr("height", this.svg.attr("height"))
                     .style("fill", "white");
  }

  private initAxis() {
    this.x = d3Scale.scaleBand().rangeRound([0, this.width]).padding(0.1);
    this.y = d3Scale.scaleLinear().rangeRound([this.height, 0]);
    this.x.domain(this.STATISTICS.map((d) => d.letter));
    this.y.domain([0, d3Array.max(this.STATISTICS, (d) => d.frequency)]);
  }

  private drawAxis() {
    this.g.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + this.height + ")")
          .call(d3Axis.axisBottom(this.x));
    this.g.append("g")
          .attr("class", "axis axis--y")
          .call(d3Axis.axisLeft(this.y))
          .append("text")
          .attr("class", "axis-title")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .attr("text-anchor", "end")
          .text("Número de tweets");
  }

  private drawBars() {
    this.g.selectAll(".bar")
          .data(this.STATISTICS)
          .enter().append("rect")
          .style("fill", "steelblue")
          .attr("x", (d) => this.x(d.letter) )
          .attr("y", (d) => this.y(d.frequency) )
          .attr("width", this.x.bandwidth())
          .attr("height", (d) => this.height - this.y(d.frequency) );
  }

}
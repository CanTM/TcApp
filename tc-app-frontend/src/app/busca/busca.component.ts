import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as d3Scale from "d3-scale";
import * as d3Array from "d3-array";
import * as d3Axis from "d3-axis";

class Frequency {
  public datetime: string;
  public frequency: number;
}

class Data {
  public datetime: Date;
  public frequency: number;
}

class Hashtags {
  public key: string;
  public value: number;
  public date: string;
  public order: number;
}

class Lifecycle {
  public hashtag: string;
  public values: Data[];
}

@Component({
  selector: 'app-busca',
  templateUrl: './busca.component.html',
  styleUrls: ['./busca.component.css'],
})

export class BuscaComponent implements OnInit {

  private STATISTICS: Frequency[] = [];
  private LYFECYCLE: Hashtags[] = [];
  private STREAM: Hashtags[] = [];
  private ALL: Lifecycle[] = [];
  private ALLFILTERED: Lifecycle[] = [];
  recorrente = true;
  displayDate: string;

  constructor() {
  }

  ngOnInit() {
    this.set_date_now();
    var freq: Frequency = { datetime: this.displayDate, frequency: 0 };
    this.STATISTICS.push(freq);
    var hash: Hashtags = { key: "none", value: 0, date: this.displayDate, order: 0 };
    this.LYFECYCLE.push(hash);
    this.STREAM.push(hash);
    var life: Lifecycle = { hashtag: "none", values: [{ datetime: new Date(), frequency: 0 }] };
    this.ALLFILTERED.push(life);
    this.initSvg1();
    this.initAxis1();
    this.drawAxis1();
    this.drawBars1();
    this.initSvg2();
    this.initAxis2();
    this.drawAxis2();
    this.drawBars2();
    this.draw_line();
  }

  start_search() {
    this.recorrente = true;
    this.STATISTICS.pop();
    this.LYFECYCLE.pop();
    this.STREAM.pop();
    this.ALLFILTERED.pop();
    this.get_data();
  }

  set_date_now() {
    var date = new Date().toLocaleTimeString().split(":");
    var sec = date[2].split(" ");
    this.displayDate = date[0] + ":" + date[1] + ":" + sec[0];
  }

  get_data() {
    console.log('aqui vai o fetch');
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
        //console.log("data " + data);
        let json = JSON.parse(data);

        //monta gráfico 1
        this.draw_graph1(json);

        //monta gráfico 2
        this.build_lifecycle(json);

        this.desenhar();
        if (this.recorrente === true) {
          this.get_data();
        }
      })
  }

  stop_search() {
    this.recorrente = false;
  }

  draw_graph1(json) {
    this.set_date_now();
    var freq: Frequency = { datetime: this.displayDate, frequency: json.nroTweets };
    this.STATISTICS.push(freq);
    // this.STATISTICS.forEach(element => {
    //   console.log("frequency " + element.datetime + " " + element.frequency);
    // });
  }

  build_lifecycle(json) {
    json.hashtags.forEach(element => {
      var hash: Hashtags = { key: element.hashtag, value: element.frequencia, date: this.displayDate, order: 0 };
      this.ALL.push({ hashtag: element.hashtag, values: [{ datetime: new Date(), frequency: element.frequencia }] });
      let containHashtag = false;
      this.LYFECYCLE.forEach(element1 => {
        if (element1.key==hash.key) {
          element1.value = element1.value + hash.value;
          containHashtag = true;
        }
      });
      if (containHashtag === false) {
        this.LYFECYCLE.push(hash);
      }
    });

    this.LYFECYCLE.sort(function (a, b) {
      return b.value - a.value;
    });

    // this.LYFECYCLE.forEach(element => {
    //   console.log("hashtag " + element.key + " " + element.value);
    // });
    console.log("ESSA É A LISTA ALL")
    this.ALL.forEach(element => {
      console.log("hashtag " + element.hashtag);
      element.values.forEach(element1 => {
        console.log("data: " + element1.datetime + " frequencia: " + element1.frequency);
      })
    });

    this.STREAM = [];
    this.ALLFILTERED = [];

    var nb = 1;
    var hasHashtag = false;

    if (this.LYFECYCLE.length < 15) {
      console.log("ENTREINO PRIMEIRO IF")
      this.LYFECYCLE.forEach(element => {
        var streamHash: Hashtags = { key: element.key, value: element.value, date: this.displayDate, order: nb };
        this.STREAM.push(streamHash);
        nb++;

        this.ALL.forEach(element1 => {
          if (element1.hashtag==element.key) {
            console.log("ENTREINO SEGUNDO IF")
            this.ALLFILTERED.forEach(element2 => {
              if (element2.hashtag==element1.hashtag) {
                console.log("ENTREINO TERCEIRO IF")
                element2.values.push(element1.values[0]);
                hasHashtag = true;
              }
            })
          }
          console.log("Tem Hashtags: " + hasHashtag)
          if (hasHashtag === false) {
            console.log("ENTREINO QUARTO IF")
            this.ALLFILTERED.push({ hashtag: element1.hashtag, values: [element1.values[0]] });
          }
          hasHashtag = false;
        })
      })
    } else {
      console.log("ENTREINO PRIMEIRO ELSE")
      for (var i = 0; i < 15; i++) {
        var streamHash: Hashtags = { key: this.LYFECYCLE[i].key, value: this.LYFECYCLE[i].value, date: this.displayDate, order: nb };
        this.STREAM.push(streamHash);
        nb++;
        hasHashtag = false;
        this.ALL.forEach(element1 => {
          if (this.LYFECYCLE[i].key==element1.hashtag) {
            this.ALLFILTERED.forEach(element2 => {
              if (element2.hashtag==element1.hashtag) {
                element2.values.push(element1.values[0]);
                hasHashtag = true;
              }
            })
            if (hasHashtag === false) {
              this.ALLFILTERED.push({ hashtag: element1.hashtag, values: [element1.values[0]] });
            }
          }
        })
        hasHashtag = false;
      }
    }
    console.log("ESSA É A LISTA ALLFILTERED")
    this.ALLFILTERED.forEach(element => {
      console.log("hashtag " + element.hashtag);
      element.values.forEach(element1 => {
        console.log("data: " + element1.datetime + " frequencia: " + element1.frequency);
      })
    });


  }

  //Desenho começa aqui

  desenhar() {
    this.initSvg1();
    this.initAxis1();
    this.drawAxis1();
    this.drawBars1();
    this.initSvg2();
    this.initAxis2();
    this.drawAxis2();
    this.drawBars2();
    this.draw_line();
  }

  //Grafico nro de tweets

  private width2: number;
  private height2: number;
  private margin2 = { top: 20, right: 20, bottom: 30, left: 40 };

  private x2: any;
  private y2: any;
  private svg2: any;
  private g2: any;


  private initSvg2() {
    this.svg2 = d3.select("#stream").select("svg");
    this.width2 = +this.svg2.attr("width") - this.margin2.left - this.margin2.right + 40;
    this.height2 = +this.svg2.attr("height") - this.margin2.top - this.margin2.bottom;
    this.g2 = this.svg2.append("g")
      .attr("transform", "translate(" + this.margin2.left + "," + this.margin2.top + ")");
    this.g2.append("rect")
      .attr("width", this.width2 + 40)
      .attr("height", this.height2 + 40)
      .style("fill", "white");
  }

  private initAxis2() {
    this.x2 = d3Scale.scaleBand().rangeRound([0, this.width2 - 40]).padding(0.1);
    this.y2 = d3Scale.scaleLinear().rangeRound([this.height2, 0]);
    this.x2.domain(this.STREAM.map((d) => d.order));
    this.y2.domain([0, d3Array.max(this.STREAM, (d) => d.value)]);
  }

  private drawAxis2() {
    this.g2.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(40," + this.height2 + ")")
      .call(d3Axis.axisBottom(this.x2));
    this.g2.append("g")
      .attr("class", "axis axis--y")
      .attr("transform", "translate(40," + 0 + ")")
      .call(d3Axis.axisLeft(this.y2))
      .append("text")
      .attr("class", "axis-title")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Número de tweets");
  }

  private drawBars2() {
    this.g2.selectAll(".bar")
      .data(this.STREAM)
      .enter().append("rect")
      .style("fill", "steelblue")
      .attr("transform", "translate(40," + 0 + ")")
      .attr("x", (d) => this.x2(d.order))
      .attr("y", (d) => this.y2(d.value))
      .attr("width", this.x2.bandwidth())
      .attr("height", (d) => this.height2 - this.y2(d.value));
  }

  private width1: number;
  private height1: number;
  private margin1 = { top: 20, right: 20, bottom: 30, left: 40 };

  private x1: any;
  private y1: any;
  private svg1: any;
  private g1: any;


  private initSvg1() {
    this.svg1 = d3.select("#chart").select("svg");
    this.width1 = +this.svg1.attr("width") - this.margin1.left - this.margin1.right + 40;
    this.height1 = +this.svg1.attr("height") - this.margin1.top - this.margin1.bottom;
    this.g1 = this.svg1.append("g")
      .attr("transform", "translate(" + this.margin1.left + "," + this.margin1.top + ")");
    this.g1.append("rect")
      .attr("width", this.width1 + 40)
      .attr("height", this.height1 + 40)
      .style("fill", "white");
  }

  private initAxis1() {
    this.x1 = d3Scale.scaleBand().rangeRound([0, this.width1 - 40]).padding(0.1);
    this.y1 = d3Scale.scaleLinear().rangeRound([this.height1, 0]);
    this.x1.domain(this.STATISTICS.map((d) => d.datetime));
    this.y1.domain([0, d3Array.max(this.STATISTICS, (d) => d.frequency)]);
  }

  private drawAxis1() {
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

  private drawBars1() {
    this.g1.selectAll(".bar")
      .data(this.STATISTICS)
      .enter().append("rect")
      .style("fill", "steelblue")
      .attr("transform", "translate(40," + 0 + ")")
      .attr("x", (d) => this.x1(d.datetime))
      .attr("y", (d) => this.y1(d.frequency))
      .attr("width", this.x1.bandwidth())
      .attr("height", (d) => this.height1 - this.y1(d.frequency));
  }


  data: any;

  svg: any;
  margin = { top: 20, right: 80, bottom: 30, left: 50 };
  g: any;
  width: number;
  height: number;
  x;
  y;
  z;
  line;

  draw_line() {

    this.data = this.ALLFILTERED.map((v) => v.values.map((v) => v.datetime))[0];
    //.reduce((a, b) => a.concat(b), []);

    this.initChart();
    this.drawAxis();
    this.drawPath();
  }

  private initChart(): void {
    this.svg = d3.select("#lifecycle").select("svg");

    this.width = this.svg.attr("width") - this.margin.left - this.margin.right;
    this.height = this.svg.attr("height") - this.margin.top - this.margin.bottom;

    this.g = this.svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    this.g.append("rect")
      .attr("width", this.width2 + 40)
      .attr("height", this.height2 + 40)
      .style("fill", "white");

    this.x = d3Scale.scaleTime().range([0, this.width]);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.z = d3Scale.scaleOrdinal(d3Scale.schemeCategory10);

    this.line = d3.line()
      .curve(d3.curveBasis)
      .x((d: Data) => this.x(d.datetime))
      .y((d: Data) => this.y(d.frequency));

    this.x.domain(d3Array.extent(this.data, (d: Date) => d));

    this.y.domain([
      d3Array.min(this.ALLFILTERED, function (c) { return d3Array.min(c.values, function (d) { return d.frequency; }); }),
      d3Array.max(this.ALLFILTERED, function (c) { return d3Array.max(c.values, function (d) { return d.frequency; }); })
    ]);

    this.z.domain(this.ALLFILTERED.map(function (c) { return c.hashtag; }));
  }

  private drawAxis(): void {
    this.g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3Axis.axisBottom(this.x));

    this.g.append("g")
      .attr("class", "axis axis--y")
      .call(d3Axis.axisLeft(this.y))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .text("Hashtags");
  }

  private drawPath(): void {
    let hashtag = this.g.selectAll(".line")
      .data(this.ALLFILTERED)
      .enter().append("g")
      .attr("class", "hashtag");

    hashtag.append("path")
      .attr("class", "line")
      .attr("d", (d) => this.line(d.values))
      .style("stroke", (d) => this.z(d.id));

    hashtag.append("text")
      .datum(function (d) { return { id: d.hashtag, value: d.values[d.values.length - 1] }; })
      .attr("transform", (d) => "translate(" + this.x(d.value.datetime) + "," + this.y(d.value.frequency) + ")")
      .attr("x", 3)
      .attr("dy", "0.35em")
      .style("font", "10px sans-serif")
      .text(function (d) { return d.hashtag; });
  }


}
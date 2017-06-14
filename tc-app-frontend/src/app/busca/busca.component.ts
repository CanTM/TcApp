import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as d3Scale from "d3-scale";
import * as d3Array from "d3-array";
import * as d3Axis from "d3-axis";

class Frequency {
  public datetime: string;
  public frequency: number;
}

class Hashtags {
  public key: string;
  public value: number;
  public date: string;
}

@Component({
  selector: 'app-busca',
  templateUrl: './busca.component.html',
  styleUrls: ['./busca.component.css'],
})

export class BuscaComponent implements OnInit {

  STATISTICS: Frequency[] = [];
  LYFECYCLE: Hashtags[] = [];
  STREAM: Hashtags[] = [];
  recorrente = true;
  displayDate: string;

  constructor() {
  }

  ngOnInit() {
    this.set_date_now();
    var freq: Frequency = { datetime: this.displayDate, frequency: 0 };
    this.STATISTICS.push(freq);
    var hash: Hashtags = { key: "none", value: 2, date: this.displayDate };
    this.LYFECYCLE.push(hash);
    this.STREAM.push(hash);
    this.initSvg1();
    this.initAxis1();
    this.drawAxis1();
    this.drawBars1();
    this.initVars();
    this.transition();
  }

  start_search() {
    this.recorrente = true;
    this.STATISTICS.pop();
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
        console.log("data " + data);
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
    this.STATISTICS.forEach(element => {
      console.log("frequency " + element.datetime + " " + element.frequency);
    });
  }

  build_lifecycle(json) {
    json.hashtags.forEach(element => {
      var hash: Hashtags = { key: element.hashtag, value: element.frequencia, date: this.displayDate };
      let containHashtag = false;
      this.LYFECYCLE.forEach(element1 => {
        if (element1.key.includes(hash.key)) {
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

    this.LYFECYCLE.forEach(element => {
      console.log("hashtag " + element.key + " " + element.value);
    });

    if (this.LYFECYCLE.length < 20) {
      this.LYFECYCLE.forEach(element => {
        json.streamdata.forEach(element1 => {
          if (element.key.includes(element1.hashtag)) {
            var streamHash: Hashtags = { key: element1.hashtag, value: element1.frequencia, date: this.displayDate };
            this.STREAM.push(streamHash);
          }
        });
      });
    } else {
      for (var i = 0; i < 20; i++) {
        json.streamdata.forEach(element1 => {
          if (this.LYFECYCLE[i].key.includes(element1.hashtag)) {
            var streamHash: Hashtags = { key: element1.hashtag, value: element1.frequencia, date: this.displayDate };
            this.STREAM.push(streamHash);
          }
        });
      }
    }
  }

  //Desenho começa aqui

  desenhar() {
    this.initSvg1();
    this.initAxis1();
    this.drawAxis1();
    this.drawBars1();
  }

  //Grafico nro de tweets

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

  //Exemplo de gráfico stream

  private n: any;
  private m: any;
  private data0: any;
  private data1: any;
  private color: any;

  private w: any;
  private h: any;
  private mx: any;
  private my: any;

  private area: any;
  private vis: any;

  private initVars() {
    this.n = 20; // number of layers
    this.m = 200; // number of samples per layer
    this.data0 = d3.layout.stack().offset("wiggle")
    this.data1 = d3.layout.stack().offset("wiggle")
    this.color = d3.interpolateRgb("#aad", "#556");

    this.w = 960;
    this.h = 500;
    this.mx = this.m - 1,
      this.my = d3.max(this.data0.concat(this.data1), function (d) {
        return d3.max(d, function (d) {
          return d.y0 + d.y;
        });
      });

    this.area = d3.svg.area()
      .x(function (d) { return d.x * this.w / this.mx; })
      .y0(function (d) { return this.h - d.y0 * this.h / this.my; })
      .y1(function (d) { return this.h - (d.y + d.y0) * this.h / this.my; });

    this.vis = d3.select("#stream").select("svg")
      .attr("width", this.w)
      .attr("height", this.h);

    this.vis.selectAll("path")
      .data(this.data0)
      .enter().append("svg:path")
      .style("fill", function () { return this.color(Math.random()); })
      .attr("d", this.area);
  }

  private transition() {
    d3.selectAll("path")
      .data(function () {
        var d = this.data1;
        this.data1 = this.data0;
        return this.data0 = d;
      })
      .transition()
      .duration(2500)
      .attr("d", this.area);
  }

  private stream_layers(n, m, o) {
    if (arguments.length < 3) o = 0;
    function bump(a) {
      var x = 1 / (.1 + Math.random()),
        y = 2 * Math.random() - .5,
        z = 10 / (.1 + Math.random());
      for (var i = 0; i < m; i++) {
        var w = (i / m - y) * z;
        a[i] += x * Math.exp(-w * w);
      }
    }
    return d3.range(n).map(function () {
      var a = [], i;
      for (i = 0; i < m; i++) a[i] = o + o * Math.random();
      for (i = 0; i < 5; i++) bump(a);
      return a.map(this.stream_index);
    });
  }

  /* Another layer generator using gamma distributions. */
  private stream_waves(n, m) {
    return d3.range(n).map(function (i) {
      return d3.range(m).map(function (j) {
        var x = 20 * j / m - i / 3;
        return 2 * x * Math.exp(-.5 * x);
      }).map(this.stream_index);
    });
  }

  private stream_index(d, i) {
    return { x: i, y: Math.max(0, d) };
  }

//   var stack = d3.stack();

// var area = d3.area()
//     .x(function(d, i) { return x(d.data.date); })
//     .y0(function(d) { return y(d[0]); })
//     .y1(function(d) { return y(d[1]); });

// var g = svg.append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// d3.tsv("data.tsv", type, function(error, data) {
//   if (error) throw error;

//   var keys = data.columns.slice(1);

//   x.domain(d3.extent(data, function(d) { return d.date; }));
//   z.domain(keys);
//   stack.keys(keys);
}

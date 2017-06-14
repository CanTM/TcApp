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
  public hashtag: string;
  public frequency: number;
  public datetime: string;
}

class HashtagsStream {
  public hashtag: string;
  public date: Date;
}

@Component({
  selector: 'app-busca',
  templateUrl: './busca.component.html',
  styleUrls: ['./busca.component.css'],
})

export class BuscaComponent implements OnInit {

  STATISTICS: Frequency[] = [];
  LYFECYCLE: Hashtags[] = [];
  STREAM: HashtagsStream[] = [];
  recorrente = true;
  displayDate: string;

  constructor() {
  }

  ngOnInit() {
    this.set_date_now();
    var freq: Frequency = { datetime: this.displayDate, frequency: 0 };
    this.STATISTICS.push(freq);
    this.initSvg1();
    this.initAxis1();
    this.drawAxis1();
    this.drawBars1();
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
      var hash: Hashtags = { hashtag: element.hashtag, frequency: element.frequencia, datetime: this.displayDate };
      let containHashtag = false;
      this.LYFECYCLE.forEach(element1 => {
        if (element1.hashtag.includes(hash.hashtag)) {
          element1.frequency = element1.frequency + hash.frequency;
          containHashtag = true;
        }
      });
      if (containHashtag === false) {
        this.LYFECYCLE.push(hash);
      }
    });

    this.LYFECYCLE.sort(function (a, b) {
      return b.frequency - a.frequency;
    });

    this.LYFECYCLE.forEach(element => {
      console.log("hashtag " + element.hashtag + " " + element.frequency);
    });

    if (this.LYFECYCLE.length < 20) {
      this.LYFECYCLE.forEach(element => {
        json.streamdata.forEach(element1 => {
          if (element.hashtag.includes(element1.hashtag)) {
            var streamHash: HashtagsStream = { hashtag: element1.hashtag, date: element1.date };
            this.STREAM.push(streamHash);
          }
        });
      });
    } else {
      for (var i = 0; i < 20; i++) {
        json.streamdata.forEach(element1 => {
          if (this.LYFECYCLE[i].hashtag.includes(element1.hashtag)) {
            var streamHash: HashtagsStream = { hashtag: element1.hashtag, date: element1.date };
            this.STREAM.push(streamHash);
          }
        });
      }
    }
    this.STREAM.forEach(element => {
      console.log("hashtag " + element.hashtag + " " + element.date);
    });
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

      n = 20 // number of layers
      m = 200 // number of samples per layer
      k = 10 // number of bumps per layer

     stack = d3.stack().keys(d3.range(this.n)).offset(d3.stackOffsetWiggle)
      layers0 = this.stack(d3.transpose(d3.range(this.n).map(function () { return this.bumps(this.m, this.k); })))
      layers1 = this.stack(d3.transpose(d3.range(this.n).map(function () { return this.bumps(this.m, this.k); })))
      layers = this.layers0.concat(this.layers1)

     svg = d3.select("#stream").select("svg");
      width = +this.svg.attr("width")
      height = +this.svg.attr("height")

     x = d3.scaleLinear()
      .domain([0, this.m - 1])
      .range([0, this.width])

     y = d3.scaleLinear()
      .domain([d3.min(this.layers, this.stackMin), d3.max(this.layers, this.stackMax)])
      .range([this.height, 0])

     z = d3.interpolateCool

     area = d3.area()
      .x(function (d, i) { return this.x(i); })
      .y0(function (d) { return this.y(d[0]); })
      .y1(function (d) { return this.y(d[1]); })

    this.svg = this.svg.selectAll("path")
      .data(this.layers0)
      .enter().append("path")
      .attr("d", this.area)
      .attr("fill", function () { return this.z(Math.random()); })

     stackMax(layer) {
      return d3.max(layer, function (d) { return d[1]; });
    }

     stackMin(layer) {
      return d3.min(layer, function (d) { return d[0]; });
    }

     transition() {
      var t;
      d3.selectAll("path")
        .data((t = this.layers1, this.layers1 = this.layers0, this.layers0 = t))
        .transition()
        .duration(2500)
        .attr("d", this.area);
    }

    // Inspired by Lee Byron’s test data generator.
     bumps(n, m) {
      var a = [], i;
      for (i = 0; i < n; ++i) a[i] = 0;
      for (i = 0; i < m; ++i) this.bump(a, n);
      return a;
    }

     bump(a, n) {
      var x = 1 / (0.1 + Math.random()),
        y = 2 * Math.random() - 0.5,
        z = 10 / (0.1 + Math.random());
      for (var i = 0; i < n; i++) {
        var w = (i / n - y) * z;
        a[i] += x * Math.exp(-w * w);
      }
    }
  }

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
      var hash: Hashtags = { hashtag: element.hashtag, frequency: element.frequencia };
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
    this.initSvg();
    this.initAxis();
    this.drawAxis();
    this.drawBars();
  }

  //Grafico nro de tweets

  private width1: number;
  private height1: number;
  private margin1 = { top: 20, right: 20, bottom: 30, left: 40 };

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
      .attr("height", this.height1 + 40)
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
      .attr("x", (d) => this.x1(d.datetime))
      .attr("y", (d) => this.y1(d.frequency))
      .attr("width", this.x1.bandwidth())
      .attr("height", (d) => this.height1 - this.y1(d.frequency));
  }

  //Grafico stream

//   private n = 20 // number of layers
//   private m = 200 // number of samples per layer
//   private k = 10 // number of bumps per layer

//   private stack = d3.stack().keys(d3.range(this.n)).offset(d3.stackOffsetWiggle)
//   private layers0 = this.stack(d3.transpose(d3.range(this.n).map(function () { return bumps(this.m, this.k); })))
//   private layers1 = this.stack(d3.transpose(d3.range(this.n).map(function () { return bumps(this.m, this.k); })))
//   private layers = this.layers0.concat(this.layers1)

//   private svg = d3.select("#strem").select("svg")
//   private width = +this.svg.attr("width")
//   private height = +this.svg.attr("height")

//   private x = d3.scaleLinear()
//     .domain([0, this.m - 1])
//     .range([0, this.width]);

//   private y = d3.scaleLinear()
//     .domain([d3.min(this.layers, stackMin), d3.max(this.layers, stackMax)])
//     .range([this.height, 0]);

//   private z = d3.interpolateCool;

//   private area = d3.area()
//     .x(function (d, i) { return this.x(i); })
//     .y0(function (d) { return this.y(d[0]); })
//     .y1(function (d) { return this.y(d[1]); })


//   this.svg.selectAll("path")
//   .data(this.layers0)
//   .enter().append("path")
//   .attr("d", this.area)
//   .attr("fill", function () { return this.z(Math.random()); });


// function stackMax(layer) {
//   return d3.max(layer, function (d) { return d[1]; });
// }

// function stackMin(layer) {
//   return d3.min(layer, function (d) { return d[0]; });
// }

// function transition() {
//   var t;
//   d3.selectAll("path")
//     .data((t = this.layers1, this.layers1 = this.layers0, this.layers0 = t))
//     .transition()
//     .duration(2500)
//     .attr("d", this.area);
// }

// // Inspired by Lee Byron’s test data generator.
// function bumps(n, m) {
//   var a = [], i;
//   for (i = 0; i < n; ++i) a[i] = 0;
//   for (i = 0; i < m; ++i) bump(a, n);
//   return a;
// }

// function bump(a, n) {
//   var x = 1 / (0.1 + Math.random()),
//     y = 2 * Math.random() - 0.5,
//     z = 10 / (0.1 + Math.random());
//   for (var i = 0; i < n; i++) {
//     var w = (i / n - y) * z;
//     a[i] += x * Math.exp(-w * w);
//   }

//   //Outro exemplo de gráfico stream

//   chart("data.csv", "orange");

//   var datearray = [];
//   var colorrange = [];


//   function chart(csvpath, color) {

//     if (color == "blue") {
//       colorrange = ["#045A8D", "#2B8CBE", "#74A9CF", "#A6BDDB", "#D0D1E6", "#F1EEF6"];
//     }
//     else if (color == "pink") {
//       colorrange = ["#980043", "#DD1C77", "#DF65B0", "#C994C7", "#D4B9DA", "#F1EEF6"];
//     }
//     else if (color == "orange") {
//       colorrange = ["#B30000", "#E34A33", "#FC8D59", "#FDBB84", "#FDD49E", "#FEF0D9"];
//     }
//     strokecolor = colorrange[0];

//     var format = d3.time.format("%m/%d/%y");

//     var margin = { top: 20, right: 40, bottom: 30, left: 30 };
//     var width = document.body.clientWidth - margin.left - margin.right;
//     var height = 400 - margin.top - margin.bottom;

//     var tooltip = d3.select("body")
//       .append("div")
//       .attr("class", "remove")
//       .style("position", "absolute")
//       .style("z-index", "20")
//       .style("visibility", "hidden")
//       .style("top", "30px")
//       .style("left", "55px");

//     var x = d3.time.scale()
//       .range([0, width]);

//     var y = d3.scale.linear()
//       .range([height - 10, 0]);

//     var z = d3.scale.ordinal()
//       .range(colorrange);

//     var xAxis = d3.svg.axis()
//       .scale(x)
//       .orient("bottom")
//       .ticks(d3.time.weeks);

//     var yAxis = d3.svg.axis()
//       .scale(y);

//     var yAxisr = d3.svg.axis()
//       .scale(y);

//     var stack = d3.layout.stack()
//       .offset("silhouette")
//       .values(function (d) { return d.values; })
//       .x(function (d) { return d.date; })
//       .y(function (d) { return d.value; });

//     var nest = d3.nest()
//       .key(function (d) { return d.key; });

//     var area = d3.svg.area()
//       .interpolate("cardinal")
//       .x(function (d) { return x(d.date); })
//       .y0(function (d) { return y(d.y0); })
//       .y1(function (d) { return y(d.y0 + d.y); });

//     var svg = d3.select(".chart").append("svg")
//       .attr("width", width + margin.left + margin.right)
//       .attr("height", height + margin.top + margin.bottom)
//       .append("g")
//       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//     var graph = d3.csv(csvpath, function (data) {
//       data.forEach(function (d) {
//         d.date = format.parse(d.date);
//         d.value = +d.value;
//       });

//       var layers = stack(nest.entries(data));

//       x.domain(d3.extent(data, function (d) { return d.date; }));
//       y.domain([0, d3.max(data, function (d) { return d.y0 + d.y; })]);

//       svg.selectAll(".layer")
//         .data(layers)
//         .enter().append("path")
//         .attr("class", "layer")
//         .attr("d", function (d) { return area(d.values); })
//         .style("fill", function (d, i) { return z(i); });


//       svg.append("g")
//         .attr("class", "x axis")
//         .attr("transform", "translate(0," + height + ")")
//         .call(xAxis);

//       svg.append("g")
//         .attr("class", "y axis")
//         .attr("transform", "translate(" + width + ", 0)")
//         .call(yAxis.orient("right"));

//       svg.append("g")
//         .attr("class", "y axis")
//         .call(yAxis.orient("left"));

//       svg.selectAll(".layer")
//         .attr("opacity", 1)
//         .on("mouseover", function (d, i) {
//           svg.selectAll(".layer").transition()
//             .duration(250)
//             .attr("opacity", function (d, j) {
//               return j != i ? 0.6 : 1;
//             })
//         })

//         .on("mousemove", function (d, i) {
//           mousex = d3.mouse(this);
//           mousex = mousex[0];
//           var invertedx = x.invert(mousex);
//           invertedx = invertedx.getMonth() + invertedx.getDate();
//           var selected = (d.values);
//           for (var k = 0; k < selected.length; k++) {
//             datearray[k] = selected[k].date
//             datearray[k] = datearray[k].getMonth() + datearray[k].getDate();
//           }

//           mousedate = datearray.indexOf(invertedx);
//           pro = d.values[mousedate].value;

//           d3.select(this)
//             .classed("hover", true)
//             .attr("stroke", strokecolor)
//             .attr("stroke-width", "0.5px"),
//             tooltip.html("<p>" + d.key + "<br>" + pro + "</p>").style("visibility", "visible");

//         })
//         .on("mouseout", function (d, i) {
//           svg.selectAll(".layer")
//             .transition()
//             .duration(250)
//             .attr("opacity", "1");
//           d3.select(this)
//             .classed("hover", false)
//             .attr("stroke-width", "0px"), tooltip.html("<p>" + d.key + "<br>" + pro + "</p>").style("visibility", "hidden");
//         })

//       var vertical = d3.select(".chart")
//         .append("div")
//         .attr("class", "remove")
//         .style("position", "absolute")
//         .style("z-index", "19")
//         .style("width", "1px")
//         .style("height", "380px")
//         .style("top", "10px")
//         .style("bottom", "30px")
//         .style("left", "0px")
//         .style("background", "#fff");

//       d3.select(".chart")
//         .on("mousemove", function () {
//           mousex = d3.mouse(this);
//           mousex = mousex[0] + 5;
//           vertical.style("left", mousex + "px")
//         })
//         .on("mouseover", function () {
//           mousex = d3.mouse(this);
//           mousex = mousex[0] + 5;
//           vertical.style("left", mousex + "px")
//         });
//     });


   }
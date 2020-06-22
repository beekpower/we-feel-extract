import { Component, NgZone, AfterViewInit, OnDestroy } from "@angular/core";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import KalmanFilter from 'kalmanjs';

import dataset from '../../output/raw/1592792609964|01-01-2020|31-05-2020|hour.json';

am4core.useTheme(am4themes_animated);

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements AfterViewInit, OnDestroy {
  private chart: am4charts.XYChart;

  constructor(private zone: NgZone) { }

  ngAfterViewInit() {
    console.log(dataset);
    this.zone.runOutsideAngular(() => {
      let chart = am4core.create("chartdiv", am4charts.XYChart);

      chart.paddingRight = 20;

      chart.data = this.calcChartData();
  
      var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.baseInterval = {
        "timeUnit": "hour",
        "count": 1
      };
      dateAxis.tooltipDateFormat = "HH:mm, d MMMM";
  
      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = true;
      valueAxis.title.text = "Unique visitors";
  
      var series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.dateX = "date";
      series.dataFields.valueY = "value";
      series.tooltipText = "Visits: [bold]{valueY}[/]";
      series.fillOpacity = 0.3;
  
  
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.lineY.opacity = 0;
      chart.scrollbarX = new am4charts.XYChartScrollbar();
      chart.scrollbarX['series'].push(series);

      dateAxis.start = 0.8;
      dateAxis.keepSelection = true;

      this.chart = chart;
    });
  }

  private calcChartData() {
    let data = [];
    for (const date of dataset) {
      data.push({
        date: new Date(date.start),
        value: (date.counts.fear) / date.counts['*'],
      });
    }

    const kalmanFilter = new KalmanFilter({R: 0.01, Q: 3});
    data = data.map((v) => {
      return { date: v.date, value: kalmanFilter.filter(v.value) };
    });

    return data;
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }
}

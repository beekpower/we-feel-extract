import { Component, NgZone, OnDestroy, Input, OnChanges, ElementRef, ViewChild, AfterViewInit } from "@angular/core";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

@Component({
  selector: "date-graph",
  templateUrl: "./date-graph.component.html",
})
export class DateGraphComponent implements OnDestroy, OnChanges, AfterViewInit {
  private chart: am4charts.XYChart;
  private colors = ['#080808', '#c242c0', '#f55442', '#c242c0', '#f55442', '#c242c0', '#f55442']
  @Input() data;
  @ViewChild("chart") chartRef: ElementRef;
  constructor(private zone: NgZone) { }

  ngOnChanges() {
    this.zone.runOutsideAngular(() => {
      if (this.chartRef) {
        for (let i = 0; i < this.data.length; i++) {
          const el = this.data[i];
          el.lineColor = this.colors[el.date.getDay()];
        }
   

        this.chart.data = this.data;
      }
    });
  }

  ngAfterViewInit() {
    let chart = am4core.create(this.chartRef.nativeElement, am4charts.XYChart);

    chart.paddingRight = 20;
    chart.data = [];

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
    series.propertyFields.stroke = "lineColor";
    series.propertyFields.fill = "lineColor";

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineY.opacity = 0;
    chart.scrollbarX = new am4charts.XYChartScrollbar();
    chart.scrollbarX['series'].push(series);

    dateAxis.start = 0;
    dateAxis.keepSelection = true;
    this.chart = chart;
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }
}

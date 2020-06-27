import { Component, NgZone, OnDestroy, Input, OnChanges, ElementRef, ViewChild } from "@angular/core";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

@Component({
  selector: "ticker-graph",
  templateUrl: "./ticker-graph.component.html",
})
export class TickerGraphComponent implements OnDestroy, OnChanges {
  private chart: am4charts.XYChart;
  @Input() data;
  @ViewChild("chart") chartRef: ElementRef;
  constructor(private zone: NgZone) { }

  ngOnChanges() {
    this.zone.runOutsideAngular(() => {
      if (this.chartRef) {
        let chart = am4core.create(this.chartRef.nativeElement, am4charts.XYChart);

        chart.paddingRight = 20;

        chart.data = this.data;

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
      }

    });
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }
}

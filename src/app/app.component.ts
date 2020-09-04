import { Component, AfterViewInit } from "@angular/core";

import KalmanFilter from 'kalmanjs';
import moment from 'moment';

import dataset from '../../output/postgres.json';

import * as finnhub from 'finnhub';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements AfterViewInit {
  private finnClient;
  public tickerData: any = [];
  public twitterData: any = [];
  private startDate = "01-01-2020";
  private endDate = "30-12-2020";

  constructor() {
    const api_key = finnhub.ApiClient.instance.authentications['api_key'];
    api_key.apiKey = "brrc827rh5r9994jqbcg"
    this.finnClient = new finnhub.DefaultApi();
  }

  public getTickerData(ticker: string, startDate: string, endDate: string) {
    return new Promise((resolve, reject) => {
      const start = moment(startDate, 'DD-MM-YYYY');
      const end = moment(endDate, 'DD-MM-YYYY');
      this.finnClient.stockCandles(ticker, "60", start.unix(), end.unix(), {}, (error, data, response) => {
        const currentValues = []
        for (let i = 0; i < data.c.length; i++) {
          const value = data.c[i];
          const date = moment.unix(data.t[i]).toDate();
          console.log(date.toString());

          currentValues.push({
            value,
            date
          });
        }
        return resolve(currentValues);
      });
    });
  }

  async ngAfterViewInit() {
    // this.tickerData = await this.getTickerData("TVIX", this.startDate, this.endDate);
    this.twitterData = this.filterChartData(this.startDate, this.endDate, this.calcChartData());
  }

  private filterChartData(startDate: string, endDate: string, data) {
    const start = moment(startDate, 'DD-MM-YYYY').toDate();
    const end = moment(endDate, 'DD-MM-YYYY').toDate();

    return data.filter(item => {
      const { date } = item;
      return date >= start && date <= end;
    });
  }

  private calcChartData() {
    const combinedData = [...dataset];
    let data = [];
    for (const date of combinedData) {
      console.log(moment(date.timestamp).toDate())
      data.push({
        date:moment.unix(moment(date.timestamp).unix()).toDate(),
        value: (date.fear) / date.total,
      });
    }

    const kalmanFilter = new KalmanFilter({ R: 0.01, Q: 3 });
    data = data.map((v) => {
      return { date: v.date, value: kalmanFilter.filter(v.value) };
    });

    return data;
  }

}

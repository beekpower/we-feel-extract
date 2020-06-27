import { Component, NgZone, AfterViewInit } from "@angular/core";

import KalmanFilter from 'kalmanjs';
import moment from 'moment';

import dataset from '../../output/raw/1592792609964|01-01-2020|31-05-2020|hour.json';
import dataset2 from '../../output/raw/1592797384270|05-05-2020|25-05-2020|hour.json';
import dataset3 from '../../output/raw/1592796342880|01-01-2020|21-06-2020|hour.json';
import dataset4 from '../../output/raw/1593226428081|21-06-2020|26-06-2020|hour.json';

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
  constructor(private zone: NgZone) {
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
    this.tickerData = await this.getTickerData("TVIX", "06-06-2020", "24-06-2020");
    this.twitterData = this.calcChartData();
  }

  private calcChartData() {
    const combinedData = [...dataset, ...dataset2, ...dataset3, ...dataset4];
    let data = [];
    for (const date of combinedData) {
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

}

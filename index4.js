const axios = require('axios');
const moment = require('moment');
const fs = require('fs');
var KalmanFilter = require('kalmanjs')

const startDate = moment('01-01-2020', 'DD-MM-YYYY');
const endDate = moment('31-05-2020', 'DD-MM-YYYY');

(async () => {

  const response = await axios.get('http://wefeel.csiro.au/api/emotions/primary/timepoints', {
    params: {
      granularity: 'hour',
      start: startDate.valueOf(),
      end: endDate.valueOf(),
      // continent: 'northAmerica'
    }
  });

  const dates = response.data;
  let data = [];
  console.log(dates);
  for (const date of dates) {
    data.push({
      date: date.start,
      value: (date.counts.fear) / date.counts['*'],
    });
  }

  var kalmanFilter = new KalmanFilter({R: 0.01, Q: 3});

data = data.map((v) => {
  return { date: v.date, value: kalmanFilter.filter(v.value) };
});

  fs.writeFileSync('./output.json', JSON.stringify(data, null, 2));
  console.log(data);
  console.log(data.length);
})();

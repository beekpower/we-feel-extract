const axios = require('axios');
const moment = require('moment');
const fs = require('fs');


const startDate = moment('01-02-2020', 'DD-MM-YYYY');
const endDate = moment('31-05-2020', 'DD-MM-YYYY');

(async () => {

  const response = await axios.get('http://wefeel.csiro.au/api/emotions/primary/timepoints', {
    params: {
      granularity: 'day',
      start: startDate.valueOf(),
      end: endDate.valueOf(),
      continent: 'northAmerica'
    }
  });

  const dates = response.data;
  const data = [];
  for (const date of dates) {
    data.push({
      date: moment(date.start).format('YYYY-MM-DD'),
      value: date.counts.fear / date.counts['*'],
    });
  }

  fs.writeFileSync('./output.json', JSON.stringify(data, null, 2));
  console.log(data);
  console.log(data.length);
})();

const axios = require('axios');
const moment = require('moment');
const fs = require('fs');

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
  const data = [];
  console.log(dates);
  for (const date of dates) {
    data.push({
      date: date.start,
      value: (date.counts.fear) / date.counts['*'],
    });
  }

  fs.writeFileSync('./output.json', JSON.stringify(data, null, 2));
  console.log(data);
  console.log(data.length);
})();

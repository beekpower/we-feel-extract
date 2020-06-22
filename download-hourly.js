const axios = require('axios');
const moment = require('moment');
const fs = require('fs');

// Change these for download date range;
const START_DATE = '05-05-2020';
const END_DATE = '25-05-2020';
const GRANULARITY = 'hour';

const filePath = './output/raw/' + Date.now() + '|' + START_DATE + '|' + END_DATE + '|' + GRANULARITY + '.json';
const startDate = moment(START_DATE, 'DD-MM-YYYY');
const endDate = moment(END_DATE, 'DD-MM-YYYY');

(async () => {
  const response = await axios.get('http://wefeel.csiro.au/api/emotions/primary/timepoints', {
    params: {
      granularity: GRANULARITY,
      start: startDate.valueOf(),
      end: endDate.valueOf(),
      // continent: 'northAmerica'
    }
  });
  const dates = response.data;
  fs.writeFileSync(filePath, JSON.stringify(dates, null, 2));
})();

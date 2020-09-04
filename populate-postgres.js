const Sequelize = require('sequelize');
const axios = require('axios');
const moment = require('moment');

// Change these for download date range;
const START_DATE = '01-01-2020';
const END_DATE = '05-06-2020';
const GRANULARITY = 'hour';

const sequelize = new Sequelize('postgres', 'postgres', 'MXXVIJhemFts', {
  host: 'localhost',
  dialect: 'postgres',
});

const Hourly = sequelize.define('hourly', {
  timestamp: {
    type: Sequelize.DATE,
    primaryKey: true
  },
  total: Sequelize.INTEGER,
  anger: Sequelize.INTEGER,
  fear: Sequelize.INTEGER,
  joy: Sequelize.INTEGER,
  love: Sequelize.INTEGER,
  other: Sequelize.INTEGER,
  sadness: Sequelize.INTEGER,
  surprise: Sequelize.INTEGER,
},
  {
    freezeTableName: true,
    timestamps: false
  });


(async () => {
  // Sync all tables
  console.log('Syncing tables...');
  await sequelize.sync();

  const startDate = moment(START_DATE, 'DD-MM-YYYY');
  const endDate = moment(END_DATE, 'DD-MM-YYYY');
  while (startDate <= endDate) {
    const start = startDate.clone().startOf('day');
    const end = startDate.clone().endOf('day');
    console.log('Retrieving data for ' + startDate.format('DD-MM-YYYY') + '...');
    const response = await axios.get('http://wefeel.csiro.au/api/emotions/primary/timepoints', {
      params: {
        granularity: GRANULARITY,
        start: start.valueOf(),
        end: end.valueOf(),
        // continent: 'northAmerica'
      }
    });

    // Process each hour block
    const dates = response.data;
    for (const date of dates) {
      const { start, counts: { anger, fear, joy, love, other, sadness, surprise } } = date;
      console.log(start)
      await Hourly.upsert({
        timestamp: moment.unix(moment(start, 'ddd MMM DD HH:mm:ss ZZZZ YYYY').unix()).toDate(),
        total: date.counts['*'],
        anger,
        fear,
        joy,
        love,
        other,
        sadness,
        surprise
      });
    }
    startDate.add(1, 'days');
  }
})();
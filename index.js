const axios = require('axios');
const moment = require('moment');
const fs = require('fs');


const startDate = moment('01-06-2020', 'DD-MM-YYYY');

(async () => {
  const data = [];

  for (let offsetDays = 0; offsetDays < 5; offsetDays++) {
    const offsetDate = startDate.clone().add(offsetDays, 'days');

    const startTime = offsetDate.valueOf();
    const endTime = startDate.clone().add(offsetDays + 1, 'days').valueOf();
  
    const response = await axios.get('http://wefeel.csiro.au/api/emotions/primary/totals', {
      params: {
        start: startTime,
        end: endTime
      }
    });
console.log(response.data)
    const total = response.data['*'];
    const fear = response.data.fear;
    const percentage = fear / total;


    data.push({
      date: offsetDate,
      value: percentage
    });
  } 
  console.log(JSON.stringify(data, null, 2));
})();

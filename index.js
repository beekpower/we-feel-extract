const axios = require('axios');
const moment = require('moment');

const startDate = moment('01-06-2020', 'DD-MM-YYYY');

(async () => {
  for (let offsetDays = 0; offsetDays < 30; offsetDays++) {
    const offsetDate = startDate.clone().add(offsetDays, 'days');

    const startTime = offsetDate.valueOf();
    const endTime = startDate.clone().add(offsetDays + 1, 'days').valueOf();
  
    const response = await axios.get('http://wefeel.csiro.au/api/emotions/primary/totals', {
      params: {
        start: startTime,
        end: endTime
      }
    });
    response.data.date = offsetDate;
    console.log(JSON.stringify(response.data, null, 2));
  } 

})();

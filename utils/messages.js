const moment = require('moment');


function formatMessge(username, text){
  return{
    username,
    text,
    time: moment().format('MMMM Do YYYY, h:mm:ss a')
  }
}
module.exports = formatMessge; 
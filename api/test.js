var getBulletin = require("./get-bulletin.js").getJpBulletin;
getBulletin('http://tgftp.nws.noaa.gov/data/raw/ww/wwjp25.rjtd..txt')
.then(data=>{
  console.log(data);
})
.catch(error=>{
  console.log(error.message);
});
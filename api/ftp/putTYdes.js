const PromiseFtp = require('promise-ftp');
// 201902282000+special_edition_description+West_Typhoon_Info+CN.txt
// 201902282000+special_edition_description+East_Typhoon_Info+EN.txt
const {ftpConfig} = require('./private.ftp.config.json');
// const ftpConfig = {
//   host:'10.148.16.19',
//   user:'Item',
//   password:'Item',
// }
async function main(date='201812270800',enDes='textEN',cnDes='textCN'){
  const ftp = new PromiseFtp();
  const serverMessage =  await ftp.connect(ftpConfig);
  console.log('serverMessage ',serverMessage);
  let respone;
  const  enFile = date + '+special_edition_description+East_Typhoon_Info+EN.txt';
  const  cnFile = date + '+special_edition_description+West_Typhoon_Info+CN.txt';
  try{
    await putFile(enDes, enFile, ftp);
    await putFile(cnDes, cnFile, ftp);
    respone = {
      success:true,
      message:'完成储存'+date,
    }
  }catch(err){
    respone = {
      success:false,
      message:'储存进ftp时发生错误',
      log:err.message,
    }
  }

  ftp.end();
  return respone;
}

async function putFile(text='', fileName='', ftp={put:()=>{}}){
  const input = Buffer.from(text, 'utf-8');
  return await ftp.put(input, fileName);
}

exports.put2ftp = main;

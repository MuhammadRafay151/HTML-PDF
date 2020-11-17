var ejs = require('ejs');

const puppeteer = require('puppeteer')
const fs = require('fs').promises
const data=require('./data')
const mime=require('mime-types')
async function pdf(){
    const browser = await puppeteer.launch({
      headless: true
    })
    const page = await browser.newPage()
    const html =await fs.readFile(`${__dirname}/main.ejs`, 'utf8')
    const certificate_img=await ReadImage(`${__dirname}/certificate.jpeg`)
    var htmlRenderized = ejs.render(html, {data:data,img:certificate_img});
    await page.setContent(htmlRenderized, {
      waitUntil: 'domcontentloaded'
    })
    await page.pdf({
      format: 'A4',
      landscape: true,
      margin:"0px",
      path: `${__dirname}/cert.pdf`
    })
    await browser.close()
    fs.writeFile("./out.html", htmlRenderized, function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
  }); 
  }


 async function ReadImage(path)
 {
  const buffer =await fs.readFile(path,{encoding: 'base64'})
  return `data:${mime.lookup(path)};base64,${buffer.toString('base64')}`
 }
 pdf()

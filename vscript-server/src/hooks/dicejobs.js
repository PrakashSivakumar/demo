// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
const puppeteer = require('puppeteer');
const xlsx = require('node-xlsx');
const fs = require('fs');
module.exports = function (options = {}) {
  return async context => {
    const data = [];
    try {
      const browser = await puppeteer.launch({
        headless: true
      });
      const page = await browser.newPage();
      for (let pno = 1; pno <= 2; pno++) {
        console.log('page ' + pno + ' start...');
        // await page.goto(`https://www.dice.com/jobs?q=Firewall+administration&jtype=Third+Party&sort=date&p=${pno}`)
        await page.goto(`https://www.dice.com/jobs?q=security+analyst&jtype=Third+Party+startPage-150-jobs&sort=date&p=${pno}`);
        for (let i = 0; i <= 19; i++) {

          let result = [];
          let jobcompany;
          let jobposition;
          let jobpostdate;
          let jobdescription;
          let jobcontent = [];

          jobcompany = await page.evaluate((i) => {
            return document.querySelector(`#company${i}`).innerText === null ? '' : document.querySelector(`#company${i}`).innerText;
          }, i);
          result.push(jobcompany);
          jobposition = await page.evaluate((i) => {
            return document.querySelector(`#position${i}`).innerText === null ? '' : document.querySelector(`#position${i}`).innerText;
          }, i);
          result.push(jobposition);
          await page.evaluate((i) => {
            document.querySelector(`#position${i}`).click();
          }, i);
          await page.waitForSelector('.iconsiblings');
          let content = await page.evaluate((result) => {
            jobpostdate = document.querySelector('.posted.hidden-xs').innerText === null ? '' : document.querySelector('.posted.hidden-xs').innerText;
            result.push(jobpostdate);
            jobdescription = document.querySelector('#jobdescSec').innerText === null ? '' : document.querySelector('#jobdescSec').innerText;
            result.push(jobdescription);
            jobcontent = document.querySelectorAll('.iconsiblings');
            for (let item in document.querySelectorAll('.iconsiblings')) {
              result.push(document.querySelectorAll('.iconsiblings')[item].innerText === null ? '' : document.querySelectorAll('.iconsiblings')[item].innerText);
            }
            return result;
          }, result);
          data.push(content);
          jobcontent.push(content[4], content[5], content[6], content[7]);
          const jobdata = {
            company: content[0],
            position: content[1],
            postDate: content[2],
            description: content[3],
            content: jobcontent,
          };
          await context.app.service('dicejobs').create(jobdata).then(result => {
            console.log('save successfully');
          });
          await page.goBack();
        }
        console.log('page ' + pno + ' completed');
      }

      // await page.pdf({path: 'hn.pdf', format: 'A4'});
      let buffer = xlsx.build([{name: 'mySheetName', data: data}]); // Returns a buffer

      let path = new Date().getTime() + '.xlsx';

      fs.open(path, 'w', function (err, fd) {
        if (err) {
          throw 'error opening file: ' + err;
        }
        fs.write(fd, buffer, 0, buffer.length, null, function (err) {
          if (err) throw 'error writing file: ' + err;
          fs.close(fd, function () {
            console.log('file written');
          });
        });
      });
      // await browser.close();
    } catch (e) {
      let buffer = xlsx.build([{name: 'mySheetName', data: data}]); // Returns a buffer

      let path = new Date().getTime() + '.xlsx';

      fs.open(path, 'w', function (err, fd) {
        if (err) {
          throw 'error opening file: ' + err;
        }

        fs.write(fd, buffer, 0, buffer.length, null, function (err) {
          if (err) throw 'error writing file: ' + err;
          fs.close(fd, function () {
            console.log('file written');
          });
        });
      });
      console.log(e);
    }
  };
};

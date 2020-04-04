const puppeteer = require("puppeteer");
const download = require("image-downloader");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
// window.scrollBy(0, window.innerHeight);

(async url => {
  async function autoScroll(page) {
    return await page.evaluate(async () => {
      return await new Promise((resolve, reject) => {
        let totalHeight = 0;
        let distance = 300;
        let t = [];
        let timer = setInterval(() => {
          let scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          t = t.concat(
            Array.from(document.querySelectorAll("article img")).map(i =>
              i.getAttribute("src")
            )
          );
          if (totalHeight >= scrollHeight + 10000) {
            clearInterval(timer);
            resolve(t);
          }
        }, 300);
      });
    });
  }

  function matchFolder(url, str) {
    const folder = path.join(__dirname, `./img-${str}`);
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
      return folder;
    } else {
      // return matchFolder(folder);
      return folder;
    }
  }

  const str = url.slice(url.indexOf(".com/") + 5, url.lastIndexOf("/"));
  const matchCountFolder = await matchFolder(url, str);

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1366,
    height: 768,
    deviceScaleFactor: 1
  });
  await page.goto(url, { timeout: 0 });

  await page.click(".tdiEy", { delay: 100 });
  await page.waitForNavigation({ waitUntil: "domcontentloaded" });
  await page.type("input[name=username]", process.env.ID, { delay: 50 });
  await page.type("input[name=password]", process.env.PS, { delay: 50 });
  await page.click(".y3zKF", { delay: 100 });
  await page.waitForNavigation({ waitUntil: "networkidle0" });
  let temp = [];
  const dimensions = await autoScroll(page).then(e => {
    return temp.concat(e);
  });

  let t2 = await new Set(dimensions);
  t2.forEach(e => {
    temp.push(e);
  });

  for (let i = 0; i < temp.length; i++) {
    // let fileExtension = temp[i].slice(temp[i].length - 4, temp[i].length - 1);
    const options = {
      url: temp[i],
      // dest: `${matchCountFolder}${
      //    /(jpe?g|png)/g ? `/${str + i}.${fileExtension}` : ""
      // } `
      dest: matchCountFolder
    };

    download
      .image(options)
      .then(({ filename, image }) => {
        console.log("File saved to", filename);
      })
      .catch(err => {
        console.error(err);
      });
  }
  console.log(temp.length);
  await browser.close();
})("https://www.instagram.com/murakamiriina/");

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
          t = Array.from(t);
          t = t.concat(
            Array.from(document.querySelectorAll("article img")).map(i =>
              i.getAttribute("src")
            )
          );
          t = new Set(t);
          console.log(t);

          if (totalHeight >= scrollHeight + 30000) {
            t = Array.from(t);
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
  const firstIndex = url.indexOf(".com/") + 5;
  const calLast = () => {
    let temp = url.charAt(url.length - 1);
    for (let x = firstIndex; x < url.length; x++) {
      if (url.charAt(x) === "/") {
        temp = x;
        break;
      }
    }
    return temp;
  };
  const str = url.slice(firstIndex, calLast());

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
  let dimensions = await autoScroll(page)
    .then(e => {
      return temp.concat(e);
    })
    .catch(err => {
      console.log(err);
    });

  // let t2 = await new Set(dimensions);
  // t2.forEach(e => {
  //   temp.push(e);
  // });

  for (let i = 0; i < dimensions.length; i++) {
    // let fileExtension = temp[i].slice(temp[i].length - 4, temp[i].length - 1);
    const options = {
      url: dimensions[i],
      // dest: `${matchCountFolder}${
      //    /(jpe?g|png)/g ? `/${str + i}.${fileExtension}` : ""
      // } `
      dest: matchCountFolder
    };

    download
      .image(options)
      .then(({ filename, image }) => {
        console.log("File saved to", filename);
        console.log(dimensions.length);
      })
      .catch(err => {
        console.error(err);
      });
  }

  await browser.close();
})("https://www.instagram.com/victoria__1998__/?hl=vi");

import puppeteer from 'puppeteer';
import fetch from 'node-fetch';

// FixMe: use public library
import Captcha  from '../2captcha-js/dist/index.js';
import 'dotenv/config';
const APIKEY = process.env.APIKEY;

(async () => {
  const browser = await puppeteer.launch({
    devtools: true,
    headless: false
  });
  const page = await browser.newPage();

  await page.setViewport({width: 1080, height: 1024});
  
  // FixMe: what is it "t"
  const t = new Date().getTime()

  const response = await fetch(`https://rucaptcha.com/api/v1/captcha-demo/gee-test/init-params?t=${t}`)
  const a =                    `https://rucaptcha.com/api/v1/captcha-demo/gee-test/init-params?t=1675592612287`

  const data = await response.json()
  const challenge = data.challenge
  const gt = data.gt
  const pageurl = 'https://rucaptcha.com/demo/geetest'

  // console.log("challenge: " + challenge)
  // console.log("data: ")
  // console.log(data)

  const solver = new Captcha.Solver(APIKEY)

  // const extraParam = { api_server: 'https://rucaptcha.com/api/v1/captcha-demo/gee-test/'}
  const res = await solver.geetest({ gt: gt, challenge: challenge, pageurl: pageurl })
  
  try {
    // console.log(res.json())
  const dataCaptcha = res.data
  const id = res.id
  console.log(data)
  console.log(id)
  const geetest_challenge = dataCaptcha.geetest_challenge
  const geetest_validate = dataCaptcha.geetest_validate
  const geetest_seccode = dataCaptcha.geetest_seccode

  console.log('geetest_challenge ' + geetest_challenge)
  console.log('geetest_validate ' + geetest_validate)
  console.log('geetest_seccode ' + geetest_seccode)
  
  await page.goto('https://rucaptcha.com/demo/geetest');

  await page.waitForSelector('h1')
  await page.waitForSelector('input[name="geetest_challenge"]')
  await page.waitForSelector('input[name="geetest_validate"]')
  await page.waitForSelector('input[name="geetest_seccode"]')
  await page.waitForSelector('button[type="submit"]')

  const setData = await page.evaluate((data) => {
    console.log(data)
    console.log(data.geetest_challenge)
    console.log(data.geetest_validate)
    console.log(data.geetest_seccode)
    console.log("dataCaptcha")

    document.querySelector('input[name="geetest_challenge"]').value = data.geetest_challenge
    document.querySelector('input[name="geetest_validate"]').value = data.geetest_validate
    document.querySelector('input[name="geetest_seccode"]').value = data.geetest_seccode

    document.querySelector('button[type="submit"]').click()
  }, dataCaptcha)

  await page.waitForSelector('#geetest-demo-form div pre code')

  const resultBlockSelector = '#geetest-demo-form div pre code'
  let result = await page.evaluate(selector => {
    return document.querySelector(selector).innerText
  }, resultBlockSelector)

  result = JSON.parse(result)
  if(result.success) {
    console.log('Капча успешно решена!')
 }

 await page.waitForTimeout(5000)

} catch(err) {
  console.error(err.message)
}
browser.close()
})();

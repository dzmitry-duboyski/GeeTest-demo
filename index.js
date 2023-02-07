import puppeteer from 'puppeteer';
import fetch from 'node-fetch';
import Captcha, { Solver }  from '2captcha-ts';
import 'dotenv/config';
const APIKEY = process.env.APIKEY;
const solver = new Captcha.Solver(APIKEY)

;(async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const [page] = await browser.pages()

  await page.setViewport({width: 1080, height: 1024});
  
  // FixMe: what is it "t"
  const t = new Date().getTime()
  const response = await fetch(`https://rucaptcha.com/api/v1/captcha-demo/gee-test/init-params?t=${t}`)

  const data = await response.json()
  const challenge = data.challenge
  const gt = data.gt
  const pageurl = 'https://rucaptcha.com/demo/geetest'

  // Send GeeTest captcha
  const res = await solver.geetest({ gt: gt, challenge: challenge, pageurl: pageurl })

  try {
    const captchaAnswer = res.data
    const id = res.id
    console.log(data)
    console.log('captcha_id='+id)
    const geetest_challenge = captchaAnswer.geetest_challenge
    const geetest_validate = captchaAnswer.geetest_validate
    const geetest_seccode = captchaAnswer.geetest_seccode

    console.log('captcha answer:')
    console.log(captchaAnswer)
    
    await page.goto('https://rucaptcha.com/demo/geetest');

    await page.waitForSelector('input[name="geetest_challenge"]')
    await page.waitForSelector('input[name="geetest_validate"]')
    await page.waitForSelector('input[name="geetest_seccode"]')
    await page.waitForSelector('button[type="submit"]')

    const setData = await page.evaluate((data) => {
      document.querySelector('input[name="geetest_challenge"]').value = data.geetest_challenge
      document.querySelector('input[name="geetest_validate"]').value = data.geetest_validate
      document.querySelector('input[name="geetest_seccode"]').value = data.geetest_seccode
      document.querySelector('button[type="submit"]').click()
    }, captchaAnswer)

    await page.waitForSelector('#geetest-demo-form div pre code')

    const resultBlockSelector = '#geetest-demo-form div pre code'
    let result = await page.evaluate(selector => {
      return document.querySelector(selector).innerText
    }, resultBlockSelector)

    result = JSON.parse(result)
    if(result.success) {
      console.log('Captcha solved successfully!')
    } 

    await page.waitForTimeout(5000)

  } catch(err) {
    console.error(err.message)
  }
  browser.close()
})();

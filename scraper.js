const puppeteer = require('puppeteer')
const CRED = require('./creds')

const sleep = async (ms) => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res()
    }, ms)
  })
}

const ID = {
  login: '#email',
  pass: '#pass',
}

async function loginMe() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const page = await browser.newPage()

  let login = async () => {
    await page.goto('https://facebook.com', {
      waitUntil: 'networkidle2',
    })
    await page.waitForSelector(ID.login)
    await page.type(ID.login, CRED.user)

    await page.type(ID.pass, CRED.pass)
    await sleep(500)

    await page.click('[value="1"]')

    await page.waitForNavigation()
  }
  console.log('processing...')
  await login()

  let getNames = async () => {
    const page = await browser.newPage()
    const url =
      'https://m.facebook.com/ufi/reaction/profile/browser/?ft_ent_identifier=2801971006709893&av=100071698345696&ext=1651996309&hash=AeRROz-qmVF8loDTUes'
    // 'https://m.facebook.com/ufi/reaction/profile/browser/?ft_ent_identifier=127724076519603&av=100071698345696&ext=1651996420&hash=AeRTNG6_x3RSQqjCEZ8&ref=page_internal'

    //NOTE POSTLINK "id=" + URL "identifier"=
    const fbPostId = '108117698480241_127724076519603'

    await page.goto(url)

    const seemore = '#reaction_profile_pager'
    await page.click(seemore)
    await sleep(2000)

    const listOfNames = await page.evaluate(() =>
      Array.from(document.querySelectorAll('div._4mo span span strong')).map(
        (name) => name.innerHTML
      )
    )
    const newObj = {
      id: fbPostId,
      engagements: [...listOfNames],
      log: new Date(),
    }
    let newArr = []
    newArr.push(newObj)
    console.log(newArr)

    await browser.close()
  }

  await getNames()
}
loginMe()

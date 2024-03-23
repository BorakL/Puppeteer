const puppeteer = require("puppeteer");

let device0 = puppeteer.KnownDevices['iPhone 11'];
let device1 = puppeteer.KnownDevices['Galaxy Note II'];
let device2 = puppeteer.KnownDevices['iPad'];
let device3 = puppeteer.KnownDevices['iPhone 12'];
let device4 = puppeteer.KnownDevices['Galaxy S8 landscape'];
let device5 = puppeteer.KnownDevices['blackBerry Z30 landscape'];

let devices = [device0, device1, device2, device3, device4, device5];

(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    for(var i=0; i<devices.length; i++){
        await page.emulate(devices[i]);
        await page.goto('https://yahoo.com');
        await page.screenshot({path: `screenshots/${i}.png`})
    }
    await browser.close();
})()
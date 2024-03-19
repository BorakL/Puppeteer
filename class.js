const puppeteer = require('puppeteer');

(async()=>{
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false,
    });
    const page = await browser.newPage();
    await page.goto('https://www.amazon.com/s?k=easter&_encoding=UTF8&content-id=amzn1.sym.05648f74-03c2-4db2-860d-48b2281825cb&pd_rd_r=28bf273c-4656-4a43-8bf4-fc1798690ba4&pd_rd_w=4KwZr&pd_rd_wg=Ndzef&pf_rd_p=05648f74-03c2-4db2-860d-48b2281825cb&pf_rd_r=R7WH72NJK3X69HQY2VGR', {
        waitUntil: "load"
    })

    const is_disabled = await page.$('.a-last') !== null;
    
    console.log(is_disabled)

    await browser.close();
})()
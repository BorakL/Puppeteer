const puppeteer = require("puppeteer");
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false,
        userDataDir: "./tmp"
    })
    const page = await browser.newPage();
    await page.goto('https://www.amazon.com/s?k=easter&_encoding=UTF8&content-id=amzn1.sym.05648f74-03c2-4db2-860d-48b2281825cb&pd_rd_r=28bf273c-4656-4a43-8bf4-fc1798690ba4&pd_rd_w=4KwZr&pd_rd_wg=Ndzef&pf_rd_p=05648f74-03c2-4db2-860d-48b2281825cb&pf_rd_r=R7WH72NJK3X69HQY2VGR&ref=pd_gw_unk');

    // $$
    // method $$ is used to query for multiple elements that match a specified CSS selector.
    // It returns a Promise taht resolves to an array of ElementHandle instances.
    // Each ElementHandle represents one of the elements found on the page that matches the provided CSS selector.
    

    let items = [];
    let isBtnDisabled = false;
    while (!isBtnDisabled) {
        await page.waitForSelector('[data-cel-widget="search_result_0"]')
        const productsHandles = await page.$$('div.s-main-slot.s-result-list.s-search-results.sg-row > .s-result-item')
        for (const productsHandle of productsHandles) {
            let title = "Null";
            let price = "Null";
            let img = "Null";
            try {
                title = await page.evaluate(el => el.querySelector("h2 > a > span").textContent, productsHandle)
            } catch (error) { }

            try {
                price = await page.evaluate(el => el.querySelector(".a-price > .a-offscreen").textContent, productsHandle)
            } catch (error) { }

            try {
                img = await page.evaluate(el => el.querySelector(".s-image").getAttribute("src"), productsHandle)
            } catch (error) { }

            if (title !== "Null") {
                fs.appendFile('results.csv', `${title},${price},${img}\n`, function(err){
                    if(err) throw err;
                    console.log('Saved!')
                })
                // items.push({ title, price, img })
            }
        }
        
        // const is_disabled = await page.$('li.a-disabled.a-last') !== null;
        const is_disabled = await page.$('span.s-pagination-disabled') !== null;

        isBtnDisabled = is_disabled
        if (!is_disabled) {
            await Promise.all([
                page.click("a.s-pagination-next"),
                page.waitForNavigation({waitUntil: "networkidle2"})
            ])
        }
    }

    console.log(items)
    console.log(items.length)


})();
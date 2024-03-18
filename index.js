 const puppeteer = require("puppeteer");

 (async ()=>{
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

    // 
    const productsHandles = await page.$$('div.s-main-slot.s-result-list.s-search-results.sg-row > .s-result-item')

    let items = [];

    for (const productsHandle of productsHandles){
        let title = "Null";
        let price = "Null";
        let img = "Null";

        try{
            title = await page.evaluate(el => el.querySelector("h2 > a > span").textContent, productsHandle)
        }catch(error){}
        
        try{
            price = await page.evaluate(el => el.querySelector(".a-price > .a-offscreen").textContent, productsHandle)
        }catch(error){}

        try{
            img = await page.evaluate(el => el.querySelector(".s-image").getAttribute("src"), productsHandle)
        } catch(error){}
   
        if(title !== "Null"){
            items.push({title,price,img})
        }
    }

console.log(items)


})();
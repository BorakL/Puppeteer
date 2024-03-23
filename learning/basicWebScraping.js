const puppeteer = require("puppeteer");

const run = async()=>{
    // try{
        const browser = await puppeteer.launch({
            headless: false
        })
        const page = await browser.newPage();
        await page.goto("https://yahoo.com");
        const title = await page.title();
        console.log("title",title)
        
        const h1handle = await page.$("p");
        const heading = await page.evaluate( (element)=>element.textContent, h1handle )
        // const heading = await page.$eval("h1", (element)=>element.textContent)
        console.log("headingggg",heading)

        await page.screenshot({path: "google2.png"})
        await page.pdf({path: "google28.pdf", format:"A4"})
        await browser.close();

    // }catch(error){
    //     console.log(error)
    // }
}

run();
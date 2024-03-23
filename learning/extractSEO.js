const puppeteer = require("puppeteer");
const fs = require("fs");

const extractSEO = async()=> {
    try{
        const browser = await puppeteer.launch({
            headless: false
        })
        const page = await browser.newPage();
        await page.goto("http://google.com")

        //SEO Related data
        const title = await page.title();
        const metaContent = await page.$eval('meta[content="origin"]', (element) => element.textContent );
        const metaCharset = await page.$eval('meta[charset="UTF-8"]', (element)=> element.textContent )

        //Extract Links
        const links = await page.$$eval("a", (elements) => 
            elements.map(element => ({
                src: element.href,
                text: element.textContent
            })
        ))
        //Extract Images
        const images = await page.$$eval("img", (elements) => 
            elements.map(element => ({
                src: element.src,
                alt: element.alt
            }))
        )

        //json data
        const seoData = JSON.stringify({
            links,
            images,
            title,
            metaContent,
            metaCharset
        })

        fs.writeFileSync("seodata.json", seoData)

        await browser.close();

    }catch(error){
        console.log("error",error)
    }
}

extractSEO();
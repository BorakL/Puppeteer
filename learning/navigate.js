const { ConnectionStates } = require("mongoose");
const puppeteer = require("puppeteer");
const fs = require("fs");

const run = async()=>{
    try{
        const browser = await puppeteer.launch({
            headless: false
        })
        const page = await browser.newPage();
        await page.goto("http://google.com")
        //links
        const links = await page.$$eval("a", (elements) =>
            elements.map((element) => ({
                href: element.href,
                text: element.textContent
            }))
        )
        //img
        const images = await page.$$eval("img", (elements) =>
            elements.map((element) => ({
                src: element.src,
                alt: element.alt
            }))
        )

        console.log("links",links);
        console.log("images",images)

        const linksJSON = JSON.stringify(links);
        const imagesJSON = JSON.stringify(images);

        fs.writeFileSync("links.json",linksJSON);
        fs.writeFileSync("images.json",imagesJSON);

        await browser.close();

    }catch(err){
        console.log("error",err)
    }
}

run();
const puppeteer = require("puppeteer");

const generateScreenshot = async(url,outputPath) => {
    try{
        const browser = await puppeteer.launch({
            headless:false
        })
        const page = await browser.newPage();
        
        //Navigate to the page
        await page.goto(url)

        //Generate screenshot
        await page.screenshot({path: outputPath})

        //Close the browser
        await browser.close()

    }catch(error){
        console.log(error)
    }
}

const url = "https://google.com";
const outputPath = "google-screenshot.png";
generateScreenshot(url,outputPath)
const puppeteer = require("puppeteer");

async function checkElementsPresent(url,elements){
    try{
        const browser = await puppeteer.launch({headless:false});
        const page = await browser.newPage();
        await page.goto(url);
        const presenceResults = [];
        for(const element of elements){
            const foundElements = await page.$$(element);
            presenceResults[element] = foundElements.length>0
        }
        console.log("Elements Present");
        console.log(presenceResults)
    }catch(error){
        console.log("Unable to check elements in the URL: ",error)
    }
}

const elements = ["div", "#main-content", 'footer']

checkElementsPresent('http://example.com', elements)
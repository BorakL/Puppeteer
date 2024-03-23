const puppeteer = require("puppeteer");

async function generatePDF(url, outputfile){
    try{
        //Launch the browser
        const browser = await puppeteer.launch({
            headless: false
        })
        const page = await browser.newPage();

        //Navigate to the page
        await page.goto(url)

        //Generate a PDF
        await page.pdf(url,outputfile)

        //close the browser
        await browser.close()
    }catch(error){
        console.log(error)
    }
}

const url = "https://google.com";
const outputfile = "output.pdf";

generatePDF(url,outputfile)
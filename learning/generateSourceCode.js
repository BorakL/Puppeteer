const puppeteer = require("puppeteer")
const fs = require("fs")

const generateSourceCode = async(url,outputData)=>{
    try{
        //Launch the browser
        const browser = await puppeteer.launch({
            headless: false
        })
        const page = await browser.newPage()
        
        //Navigate to the page
        await page.goto(url)

        //Generate Sourcecode
        const sourceCode = await page.content();

        //Create file
        fs.writeFileSync(outputData, sourceCode, "utf-8")
    
        await browser.close();

    }catch(error){
        console.log(error)
    }
}

const url = "http://google.com";
const outputData = "source_code.html"
generateSourceCode(url,outputData)
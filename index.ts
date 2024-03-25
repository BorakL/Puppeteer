import { ElementHandle } from "puppeteer"; 
import puppeteer from "puppeteer"; 
import fs from 'fs' 
const firstTenProducts = require("./data/firstTenProducts.json") 
const  userExample = require("./data/userExample.json") 
const priceFormating = require("./utilities/utilities") 

interface Product {
  name: string;
  price: number;
  url: string;
}

interface ProductDetailed {
  name: string;
  price: number;
  description: string;
  availableSizes: { personalisation: string; options: string[] }[];
  image: string;
}



//Product Discovery

const listHomeProducts = async (urlProduct: string, limit: number): Promise<void> => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(urlProduct);
    const products = await page.$$("[data-search-results]>[data-search-results-region]>ol>li");
    const productsData: Product[] = [];
    
    for (let i = 0; i < limit; i++) {
      let name = await products[i].$eval("a.listing-link h2.v2-listing-card__title", (e: Element) => e.textContent?.trim() );
      let price = await products[i].$eval("a.listing-link div.n-listing-card__price span.currency-value", (e: Element) => parseFloat(e.textContent || '0' ));
      let url = await products[i].$eval("a.listing-link", (e: HTMLAnchorElement) => e.href);
      if (name && price && url) {
        productsData.push({ name, price, url });
      }
    }

    fs.writeFileSync("data/firstTenProducts.json", JSON.stringify(productsData), { encoding: "utf8" });
    await browser.close();
  } catch (error) {
        console.log(error);
  }
};


// Product Detail Extraction

const detailExtraction = async (products: Product[]): Promise<void> => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const productsDetailedData: ProductDetailed[] = [];

  try {
    
    for (let product of products) {
      //navigate through product pages
      await page.goto(product.url, {
        waitUntil: "networkidle2",
      });
      //extract detailed information
      let name = await page.$eval("h1[data-buy-box-listing-title]", (e:Element) => e.textContent?.trim() );
      let price = await page.$eval("[data-appears-component-name='price'] [data-selector='price-only']>p.wt-text-title-larger", (e:Element) => e.textContent?.trim());
      let description = await page.$eval("[data-id='description-text'] [data-product-details-description-text-content]", (e:Element) => e.textContent?.trim() );
      let image = await page.$eval("div.image-carousel-container > ul > li > img.carousel-image", (e:HTMLImageElement) => e.src);
      //extract available sizes
      let selects = await page.$$("[data-selector='listing-page-variation']");
      let promisesForAvailableSizes = selects.map(async (select:ElementHandle) => ({
        personalisation: await select.$eval("label>span", (option:Element) => option.textContent?.trim() ),
        options: await select.$$eval("select>option", (options:Element[]) => options.map((option:Element) => option.textContent?.trim() )),
      }));
      let availableSizes:any = await Promise.all(promisesForAvailableSizes);

      if (name && price && description && availableSizes && image) {
        productsDetailedData.push({ name, price: priceFormating(price), description, availableSizes, image });
      }
    }
    fs.writeFileSync("./data/productsDetailed.json", JSON.stringify(productsDetailedData), { encoding: "utf8" });
    await browser.close();
  } catch (error) {
    console.log(error);
  }
};


// Simulate Adding Products to Cart and Checkout

const addProductToCard = async (url: string): Promise<void> => {
    try {
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      await page.goto(url, {
        waitUntil: "networkidle2",
      });
  
      const randomNum = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
      const promises: (() => Promise<void>)[] = [];
      const user = userExample;
  
      const delaySelect = (selector: string, option: string, i: number): Promise<void> => {
        return new Promise((resolve) => {
          setTimeout(async () => {
            await page.select(selector, option);
            resolve();
          }, (i + 1) * 500);
        });
      };
  
      const delayClick = (selector: string, time: number): Promise<void> => {
        return new Promise((resolve) => {
          setTimeout(async () => {
            await page.click(selector);
            resolve();
          }, time);
        });
      };
  
      // Variations select
      const variations = await page.$$(`[data-selector="listing-page-variations"] select`);
      if (variations.length > 0) {
        for (let i = 0; i < variations.length; i++) {
          await page.waitForSelector(`#variation-selector-${i}>option`);
          const options = await page.$$eval(`#variation-selector-${i}>option`, (options:HTMLOptionElement[]) => options.map((option:HTMLOptionElement) => option.value));
          const option = options[randomNum(1, options.length - 1)] || options[1];
          // await page.select(`#variation-selector-${i}`,options)    //NOT POSIBLE - The browser cannot perform two selections at the same time, just the first.
          promises.push(() => delaySelect(`#variation-selector-${i}`, option, i));
        }
      }
  
      // Personalization input
      const personalisation = await page.$(`[data-selector="listing-page-personalization"] > textarea`);
      if (personalisation) {
        await page.focus(`[data-selector="listing-page-personalization"] > textarea`);
        await page.keyboard.type("011-111-111");
      }
  
      // Adding products to cart
      const submit = await page.$(`form[data-buy-box-add-to-cart-form]>[data-add-to-cart-button]>button`);
      if (submit) {
        await Promise.all([
          ...promises.map((fn) => fn()),
          delayClick(`form[data-buy-box-add-to-cart-form]>[data-add-to-cart-button]>button`, variations.length * 1000),
          page.waitForNavigation({ waitUntil: "networkidle2" }),
        ]);
      }
  
      await page.waitForNavigation({ waitUntil: "networkidle2" });
  
      // Proceed button
      await page.waitForSelector("button.proceed-to-checkout");
      await page.click("button.proceed-to-checkout");
      // Continue-as-guest button
      await page.waitForSelector("#join-neu-continue-as-guest > div > button");
      await page.click("#join-neu-continue-as-guest > div > button");
  
      // Shipping address form
      // email
      await page.waitForSelector("input#shipping-form-email-input");
      await page.focus("input#shipping-form-email-input");
      await page.keyboard.type(user.email);
      // confirmation
      await page.focus("input#shipping-form-email-confirmation");
      await page.keyboard.type(user.confirmation);
      // fullName
      await page.waitForSelector("input#name11-input");
      await page.focus("input#name11-input");
      await page.keyboard.type(user.fullName);
      // streetAddress
      await page.focus("input#first_line12-input");
      await page.keyboard.type(user.streetAddress);
      // postalCode
      await page.focus("input#zip14-input");
      await page.keyboard.type(user.postalCode);
      // city
      await page.focus("input#city15-input");
      await page.keyboard.type(user.city);
  
      // Proceed to payment
      await page.waitForSelector("button[data-selector-save-btn]");
      await page.click("button[data-selector-save-btn]");
      await page.waitForNavigation({ waitUntil: "networkidle2" });
  
      await browser.close();
    } catch (error) {
      console.log(error);
    }
  };

  const homePageUrl = "http://etsy.com/c/home-and-living?ref=homepage_shop_by_category_card"
  const shopUrl = "https://www.etsy.com/listing/1318906773/linen-duvet-cover-set-with-vintage?click_key=fd812f00eb33a9653596738fed8f310d52701c26%3A1318906773&click_sum=fb49d138&ref=search2_top_narrowing_intent_modules_etsys_pick-5&pro=1&sts=1"

 

// listHomeProducts(homePageUrl,10)

// detailExtraction(firstTenProducts)

// addProductToCard(shopUrl)
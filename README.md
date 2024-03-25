# Puppeteer TypeScript Automation Project

This project demonstrates web scraping and automation using Puppeteer, a Node.js library for controlling headless Chrome or Chromium, written in TypeScript. The automation script is designed to interact with the Etsy website, specifically for tasks such as product discovery, extracting detailed product information, and simulating the process of adding products to the cart and checkout.

## Project Setup Instructions

1. Clone the repository to your local machine:
git clone <repository-url>

2. Install dependencies:
npm install

3. Run the automation script:
npm start


## Assumptions Made During Development

- The structure of the target website (Etsy) remains relatively stable.
- The Puppeteer API documentation and examples were referenced for implementing specific tasks.

## Challenges Faced and How They Were Overcome

- **Handling dynamic content:** Some elements on the website may load dynamically, requiring waiting for certain events or conditions before proceeding. This was addressed by using Puppeteer's built-in wait functions.
- **Ensuring reliability:** To ensure the automation script's reliability, error handling mechanisms were implemented to gracefully handle unexpected situations, such as network errors or element not found errors.

## Additional Features or Improvements

- Implemented a function to extract detailed product information, including product description, available sizes, and images.
- Added functionality to simulate adding products to the cart and proceeding through the checkout process.

## Evaluation Criteria

### Adherence to Task Requirements

The automation script effectively interacts with the target website, fulfilling the specified tasks of product discovery, detailed information extraction, and simulating the checkout process.

### Functionality and Reliability

The automation script functions as intended, reliably performing tasks across different scenarios and handling potential errors gracefully.

### Code Quality, Structure, and Maintainability

The code follows best practices for readability, maintainability, and structure. It is well-documented, with clear comments and meaningful variable names.

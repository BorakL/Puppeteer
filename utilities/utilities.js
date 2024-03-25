function priceFormating(price){
    const regex = /\s*(\d+(?:\.\d+)?)/gi   
    return price.match(regex)[0]*1
} 

module.exports = priceFormating
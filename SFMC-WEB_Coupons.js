var clearCaratTimer = setInterval(function() {
    if (location.href.indexOf('/coupons') > -1 && __NEXT_DATA__ && typeof __NEXT_DATA__ === 'object') {
        clearInterval(clearCaratTimer)
        var payloadData = {
            "item": "Coupons",
            "name": "Category:Coupons",
            "url": location.href,
            "category": "Coupons",
            "page_type": "categorypage",
            "item_type": "content"
        }
        var layer = {
            event: 'sfmc',
            payload: payloadData
        }
        dataLayer.push(layer)
        console.log(layer ,'layer')
        payloadData = undefined
    }
}, 200)
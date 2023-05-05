var clearCaratTimerMobileClP = setInterval(function() {
    if (location.href.indexOf('/shop') > -1 && __NEXT_DATA__ && typeof __NEXT_DATA__ === 'object' && document.querySelector('.breadcrumb > div  p')) {
        clearInterval(clearCaratTimerMobileClP)
        var breadcrumbAll = null
        var Category = []
        if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
            var plpLinks = document.querySelectorAll('.breadcrumb > div')
            if (plpLinks) {
                for (var j=0;j<plpLinks.length;j++) {
                    var aText = plpLinks[j].querySelector('a').getAttribute('alt')
                    if (aText) {
                        Category.push(aText)
                    }
                }
            }
        } else {
            breadcrumbAll = document.querySelectorAll('.breadcrumb > div')
            for (var i = 0;i<breadcrumbAll.length;i++) {
                Category.push(breadcrumbAll[i].textContent)
            }
        }
        var payloadData = {
            "item": Category.join(':'),
            "name": "Category:" + Category[Category.length - 1] ,
            "url": location.href,
            "category": Category.join(':'),
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
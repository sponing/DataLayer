var clearClassesTimer = setInterval(function() {
    var isWindow = typeof window !== 'undefined';
    if (location.href.indexOf('/classes') > -1 && isWindow && window.hasOwnProperty('__NEXT_DATA__')) {
        if (__NEXT_DATA__ && typeof __NEXT_DATA__ === 'object') {
            clearInterval(clearClassesTimer)
            var payloadData =     {
                "item": "Classes & Events",
                "name": "Content:Classes and Events",
                "url": location.href,
                "category": " Classes & Events",
                "page_type": "Content",
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
    }
}, 200)
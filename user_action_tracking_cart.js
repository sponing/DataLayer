var dupClicksCart = {}

var addDataCart = function (payloadData, key) {
    if (!dupClicksCart[key]) {
        if (window.dataLayer) {
            dupClicksCart[key] = 'true'
            var layer = {
                event: 'user_action_tracking_cart',
                payload: payloadData
            }
            dataLayer.push(layer)
            payloadData = undefined
        }
    }
}

var clearCaratTimerCart = setInterval(function() {
    if (location.href.indexOf('.com/cart') > -1 && __NEXT_DATA__ && typeof __NEXT_DATA__ === 'object') {
        var payloadData = {
            component: '',
            title: '',
            linkUrlPath: '',
            urlPath: ''
        }
        var slicks = document.querySelector('#trendNow-box') ? document.querySelector('#trendNow-box').querySelectorAll('.slick-slide a') : []
        if (slicks.length !== 0) {
            for (var i=0;i<slicks.length;i++) {
                (function(sIndex) {
                        slicks[sIndex].addEventListener('click', function() {
                                var href = window.location.href.split('?')[0]
                                payloadData = {
                                    component: slicks[sIndex].closest('.slick-slider').parentNode.parentNode.querySelector('h3').textContent,
                                    title:  slicks[sIndex].querySelectorAll('p')[0].textContent,
                                    linkUrlPath:  slicks[sIndex].getAttribute('href'),
                                    urlPath: href.replace('com/', 'com') +  slicks[sIndex].getAttribute('href')
                                }
                                addDataCart(payloadData)
                        })
                })(i)
            }
        }
        clearInterval(clearCaratTimerCart)
    }
}, 1000)

let as = document.querySelectorAll('a')
for (let i=0;i<as.length;i++) {
    as[i].setAttribute('target', '_blank')
}
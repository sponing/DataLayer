var dupClicksPdp = {}

var addDataPdp = function (payloadData, key) {
    if (!dupClicksPdp[key]) {
        if (window.dataLayer) {
            dupClicksPdp[key] = 'true'
            var layer = {
                event: 'user_action_tracking_pdp',
                payload: payloadData
            }
            dataLayer.push(layer)
            payloadData = undefined
        }
    }
}

var clearCaratTimerPDP = setInterval(function() {
    if (location.href.indexOf('.com/product/') > -1 && __NEXT_DATA__ && typeof __NEXT_DATA__ === 'object') {
        
        var payloadData = {
            component: '',
            title: '',
            linkUrlPath: '',
            urlPath: ''
        }

        var slicksPDP = document.querySelectorAll('.slick-slide')
        for (var i=0;i<slicksPDP.length;i++) {
            (function(sIndex) {
                slicksPDP[sIndex].addEventListener('click', function() {
                            var href = window.location.href.split('?')[0]
                            payloadData = {
                                component: slicksPDP[sIndex].closest('.slick-slider').parentNode.parentNode.querySelector('h3').textContent,
                                title:  slicksPDP[sIndex].querySelectorAll('p[title]')[0].textContent,
                                linkUrlPath:  slicksPDP[sIndex].querySelectorAll('a')[0].getAttribute('href'),
                                urlPath: href.replace('com/', 'com') +  slicksPDP[sIndex].querySelectorAll('a')[0].getAttribute('href')
                            }
                            addDataPdp(payloadData, payloadData.component + '_' + payloadData.title)
                    })
            })(i)
        }
        clearInterval(clearCaratTimerPDP)
    }
}, 1000)

let as = document.querySelectorAll('a')
for (let i=0;i<as.length;i++) {
    as[i].setAttribute('target', '_blank')
}
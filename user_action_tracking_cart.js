var dupClicksCart = {}
var cartActions = []
var adComponentsCart = {}

var addDataCart = function (payloadData, key, componentTitle) {
    if (!dupClicksCart[key]) {
        if (window.dataLayer) {
            dupClicksCart[key] = 'true'
            var datalayerDataKey = 'componentView-' + payloadData.component;
            var layer = {
                event: 'user_action_tracking_cart',
                payload: payloadData,
                actions: cartActions.length <= 5 ? cartActions : cartActions.splice(0, 5)
            }
            layer[datalayerDataKey] = {
                componentTitle: componentTitle,
                dataTitle: payloadData.title
            }
            layer = Object.assign(layer, adComponentsCart)
            console.log(layer)
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
        var objValue = {
            'Trending Now': 'cartTrendingNow'
        }
        var apiPaths = {
            'Trending Now': 'shopping_cart_bundle'
        }
        var slicks = document.querySelectorAll('.slick-slide a') || []
        if (slicks.length !== 0) {
            clearInterval(clearCaratTimerCart)
            for (var i=0;i<slicks.length;i++) {
                (function(sIndex) {
                        var componentTitle = slicks[sIndex].closest('.slick-slider').parentNode.parentNode.querySelector('h3')
                        var h3Title = componentTitle.textContent;
                        var adKey = 'adComponents-' + objValue[h3Title]
                        adComponentsCart[adKey] = {
                            index: 0,
                            title: h3Title,
                            apiPath: apiPaths[h3Title]
                        }
                        slicks[sIndex].addEventListener('click', function() {
                                var href = window.location.href.split('?')[0]
                                 payloadData = {
                                    component: objValue[h3Title],
                                    title:  slicks[sIndex].querySelectorAll('p')[0].textContent,
                                    linkUrlPath:  slicks[sIndex].getAttribute('href'),
                                    urlPath: href.replace('com/', 'com') +  slicks[sIndex].getAttribute('href')
                                }
                                addDataCart(payloadData,  payloadData.component + '_' + payloadData.title, h3Title)
                        })
                })(i)
            }
            var slickArrowCart = document.querySelectorAll('.slick-arrow')
            for (var j=0;j<slickArrowCart.length;j++) {
                (function(jSlick){
                    slickArrowCart[jSlick].addEventListener('click', function() {
                        var objKey = slickArrowCart[jSlick].closest('.slick-slider').parentNode.parentNode.querySelector('h3').textContent;
                        var action_index = slickArrowCart[jSlick].className.indexOf('slick-prev') > -1 ? 0 : 1;
                       var clientWidth = document.body.clientWidth
                        cartActions.push({
                            component_type: objValue[objKey],
                            index: 0,
                            action_index: action_index,
                            action: clientWidth <= 640 ? 'Slide (mobile)' : 'Click (web)',
                            name: objKey,
                            timestamp: new Date().getTime(),
                        })
                        console.log(cartActions)
                    })
                })(j)
            }
        }
    }
}, 1000)

let as = document.querySelectorAll('a')
for (let i=0;i<as.length;i++) {
    as[i].setAttribute('target', '_blank')
}
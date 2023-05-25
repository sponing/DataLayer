var dupClicksPdp = {}
var pdpActions = []
var adComponents = {}

var addDataPdp = function (payloadData, key, componentTitle) {
    if (!dupClicksPdp[key]) {
        if (window.dataLayer) {
            dupClicksPdp[key] = 'true'
            var datalayerDataKey = 'componentView-' + payloadData.component;
            var layer = {
                event: 'user_action_tracking_pdp',
                payload: payloadData,
                actions: pdpActions.length <= 5 ? pdpActions : pdpActions.splice(0, 5)
            }
            layer[datalayerDataKey] = {
                componentTitle: componentTitle,
                dataTitle:  payloadData.title
            }
            layer = Object.assign(layer, adComponents)
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
        var objValue = {
            'You May Also Like': 'pdp_AlsoLike',
            'Recently Viewed': 'pdp_RecentlyViewd',
            'Projects that Use this Product': 'Project',
            'Recommended For You': 'pdp_RecommendedForYou'
        }
        var apiPaths = {
            'You May Also Like': 'youMayAlsoLike',
            'Recently Viewed': 'recentlyViewed',
            'Projects that Use this Product': 'get-by-external-ids',
            'Recommended For You': 'recommendedForYou'
        }
        var slicksDPDTimer =  setInterval(function() {
            var slicksPDP = document.querySelectorAll('.slick-slide')
            if (slicksPDP.length > 0) {
                for (var i=0;i<slicksPDP.length;i++) {
                    (function(sIndex) {
                        var componentTitle = slicksPDP[sIndex].closest('.slick-slider').parentNode.parentNode.querySelector('h3')
                        var h3Title = componentTitle.textContent;
                        var adKey = 'adComponents-' + objValue[h3Title]
                        adComponents[adKey] = {
                            index: sIndex,
                            title: h3Title,
                            apiPath: apiPaths[h3Title]
                        }
                        console.log(adComponents, 'adComponentsCart')
                        slicksPDP[sIndex].addEventListener('click', function() {
                                    var href = window.location.href.split('?')[0]
                                    payloadData = {
                                        component: objValue[h3Title],
                                        title:  slicksPDP[sIndex].querySelectorAll('p[title]')[0].textContent,
                                        linkUrlPath:  slicksPDP[sIndex].querySelectorAll('a')[0].getAttribute('href'),
                                        urlPath: href.replace('com/', 'com') +  slicksPDP[sIndex].querySelectorAll('a')[0].getAttribute('href')
                                    }
                                    addDataPdp(payloadData, payloadData.component + '_' + payloadData.title, h3Title)
                            })
                    })(i)
                }
                var slickArrowPDP = document.querySelectorAll('.slick-arrow')
                for (var j=0;j<slickArrowPDP.length;j++) {
                    (function(jSlick){
                        slickArrowPDP[jSlick].addEventListener('click', function() {
                            var objKey = slickArrowPDP[jSlick].closest('.slick-slider').parentNode.parentNode.querySelector('h3').textContent;
                            var action_index = slickArrowPDP[jSlick].className.indexOf('slick-prev') > -1 ? 0 : 1;
                            var slickSliderS = document.querySelectorAll('.slick-slider')
                            var index = 0
                            for (var n=0;n<slickSliderS.length;n++) {
                                if (slickSliderS[n].parentNode.parentNode.textContent.indexOf(objKey) > -1) {
                                    index = n
                                    break
                                }
                            }
                            var clientWidth = document.body.clientWidth
                            pdpActions.push({
                                component_type: objValue[objKey], // component id
                                index: index, // component postion index
                                action_index: action_index, // Wheel-cast arrow
                                action: clientWidth <= 640 ? 'Slide (mobile)' : 'Click (web)',
                                name: objKey, // components title
                                timestamp: new Date().getTime()
                            })
                            console.log(pdpActions, 'pdpActions')
                        })
                    })(j)
                }
                clearInterval(slicksDPDTimer) 
            }
        }, 1000)
        clearInterval(clearCaratTimerPDP)
    }
}, 1000)

let as = document.querySelectorAll('a')
for (let i=0;i<as.length;i++) {
    as[i].setAttribute('target', '_blank')
}
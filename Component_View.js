
var globalCompoentIsShow = {}

function isInViewPort(element) {
    var viewWidth = window.innerWidth || document.documentElement.clientWidth;
    var viewHeight = window.innerHeight || document.documentElement.clientHeight;
    var top = element.getBoundingClientRect().top;
    var right = element.getBoundingClientRect().right;
    var bottom = element.getBoundingClientRect().bottom;
    var left = element.getBoundingClientRect().left;

    return top >= 0 && left >= 0 && right <= viewWidth && bottom <= viewHeight;
}

function datalayerPush(options) {
    if (!globalCompoentIsShow[options.id]) {
        globalCompoentIsShow[options.id] = 'true'
        var datalayerData = {};
        var datalayerDataKey = 'componentView-' + options.id;
        datalayerData[datalayerDataKey]={  
                componentTitle: options.componentTitle,  
                dataTitle: options.dataTitle,  
            }  

        console.log(datalayerData)
        dataLayer.push(datalayerData)
    } 
}

function compoentView(dom, options) {
    if (isInViewPort(dom)) {  
        datalayerPush(options)
    }
}

var globaldocumentTimer = setInterval(function() {
    if (window) {
        clearInterval(globaldocumentTimer)
        var nextData = window['__NEXT_DATA__']
        var modules = []
        if (nextData && nextData['props'] && nextData['props']['pageProps'] && nextData['props']['pageProps']['modules']) {
            modules = nextData['props']['pageProps']['modules']
        }
        var compoentEvent = function () {
            for (var i=0;i<modules.length;i++) {
                (function(modulesIdex) {
                    var modulesData = modules[modulesIdex]
                    if (document.querySelector('#dc' + modulesData.id) && document.querySelector('#dc' + modulesData.id) && document.querySelector('#dc' + modulesData.id).textContent) {
                        // console.log(modulesData)
                        compoentView(
                            document.querySelector('#dc' + modulesData.id),
                            {
                                id: 'dc' + modulesData.id,
                                componentTitle:  modulesData.title || '',
                                dataTitle: modulesData['data']['title'] ||  modulesData['data']['subTitle'] || ''
                            }
                        )
                    }
                })(i)
            }
        }

        document.addEventListener('scroll', function() {
            compoentEvent()
        })

        compoentEvent()
        document.querySelector('header > div:nth-child(2) > div:nth-child(2) input').addEventListener('click', function() {
            var maxHeight = window.getComputedStyle(document.querySelector('header > div:nth-child(2) > div:nth-child(2) ul')).maxHeight
            if (maxHeight != '0px') {
                datalayerPush({
                    id: 'headerRecentSearches',
                    componentTitle:  'headerRecentSearches',
                    dataTitle: 'Recent Searches'
                })
                datalayerPush({
                    id: 'headerTrendingProducts',
                    componentTitle:  'headerTrendingProducts',
                    dataTitle: 'Trending Products'
                })
            }
        })
        var shopCategoryDom = document.querySelector('.headerMenuContainer > div > div > div:nth-child(1)')
        shopCategoryDom.addEventListener('mousemove', function(event) {
            if (event.layerX > this.offsetLeft && event.layerX < this.offsetLeft + this.offsetWidth &&  
                event.layerY > this.offsetTop && event.layerY < this.offsetTop + this.offsetHeight) {
                var shopCategoryTimer = setInterval(function() {
                    var shopMenuDom = document.querySelector('.headerMenuContainer > div > div > div:nth-child(1) > div')
                    var TrendingNow = document.querySelector('.headerMenuContainer > div > div  h4')
                    if (window.getComputedStyle(shopMenuDom).display != 'none' && TrendingNow) {
                        clearInterval(shopCategoryTimer)
                        datalayerPush({
                            id: 'headerShopCategoriesTrendingNow',
                            componentTitle:  'TrendingNow',
                            dataTitle: 'Trending Now'
                        })
                    }
                }, 800)
            }  
        })
    }
}, 500)
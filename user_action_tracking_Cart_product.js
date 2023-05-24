var aListClick = function(dom, fn) {
    var aTag = dom.querySelectorAll('a')
    for (var i=0;i<aTag.length;i++) {
        (function(clickA) {
            aTag[clickA].addEventListener('click', function() {
                fn && fn(aTag[clickA], clickA)
            })
        })(i)
    }
}

var getParentName = function(obj, className) {
    let node = obj;
    let ofDiv = true;
    while (ofDiv) {
      if (node.parentNode.className.includes(className)) {  // 条件示例
        node = node.parentNode;
        ofDiv = false;
      } else {
        node = node.parentNode;
      }
    }
    return node
  }
  

var clearCaratTimer = setInterval(function() {
    if (location.href.indexOf('/product/') > -1 && __NEXT_DATA__ && typeof __NEXT_DATA__ === 'object') {
        var productH3s  = document.querySelectorAll('h3')
        var RecentlyViewed = null
        var UseProduct = null
        var alsoLike = null
        for (var n=0;n<productH3s.length;n++) {
            if (productH3s[n].textContent == 'Recently Viewed') {
                RecentlyViewed = productH3s[n].parentNode
            }
            if (productH3s[n].textContent == 'Projects that Use this Product') {
                UseProduct = productH3s[n].nextSibling
            }
            if (productH3s[n].textContent == 'You May Also Like') {
                alsoLike = productH3s[n].nextSibling
            }
        }
        if (RecentlyViewed || UseProduct) {
            clearInterval(clearCaratTimer)
            var payloadData = {
                title: '',
                content: '',
                path: '',
                linkUrlPath: '',
                urlPath: ''
            }
            console.log(RecentlyViewed)
            console.log(UseProduct)
            if (RecentlyViewed) {

            }
            if  (alsoLike) {
                aListClick(alsoLike, function(clickADom, index) {
                    var href = window.location.href.split('?')[0]
                    var alsoLikeNode = getParentName(clickADom, 'slick-slide')
                    payloadData = {
                        title: alsoLikeNode.querySelectorAll('p')[0].textContent,
                        content: alsoLikeNode.querySelectorAll('p')[1].textContent,
                        linkUrlPath: clickADom.getAttribute('href'),
                        urlPath: href.replace('com/', 'com') + clickADom.getAttribute('href')
                    }
                })
            }
            if (UseProduct) {
                aListClick(UseProduct, function(clickADom, index) {
                    var href = window.location.href.split('?')[0]
                    payloadData = {
                        title: clickADom.querySelectorAll('p')[0] ? clickADom.querySelectorAll('p')[0].textContent : '',
                        content: '',
                        linkUrlPath: clickADom.getAttribute('href'),
                        urlPath: href.replace('com/', 'com') + clickADom.getAttribute('href')
                    }
                })
            }
            if (window.dataLayer) {
                var layer = {
                    event: 'user_action_tracking_product',
                    payload: payloadData
                }
                console.log(layer)
                dataLayer.push(layer)
                payloadData = undefined
            }
        }
    }
}, 1500)
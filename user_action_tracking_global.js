
var actions = []

function findTextContent(tag, text) {
    var tags = document.querySelectorAll(tag)
    var tagCurrents = []
    for (var i =0; i < tags.length; i++) {
        if (tags[i].textContent === text) {
            tagCurrents.push(tags[i])
        }
    }
    return tagCurrents
}

function getMyStoreName() {
    var storeDom = document.querySelector('header > div:nth-child(2) > div:last-child > div:first-child p:last-child')
    var storeName = storeDom.textContent
    if (storeName) {
        storeName = storeName.replace('My Store:', '')
    }
    return storeName
}

var myStoreChanged = []

function deepStoreData(obj) {
    var storeData = Object.assign({
        my_store_action: '',
        my_store_click_name: '',
        my_store_index: '',
        my_store_timestamp: '',
    }, obj)
    myStoreChanged.unshift(storeData)
}


var deepActionData = function(obj) {
    var actionData = Object.assign({
        component_type: '',
        action_index: '',
        action: '',
        name: '',
        index: '',
        timestamp: '',
    }, obj)
    actions.unshift(actionData)
}

var keydownData = ''
var repeatClickStoreName = ''
var repeatKeydown = ''

function addAction(dom, component_type, content, aciton ,type, inputDom) {
    type = type || 'click'
    if (dom && !dom.getAttribute('data-addclick')) {
        dom.setAttribute('data-addclick', 'true')
        if (type == 'click'){
            dom.addEventListener('click', function(e) {
                var name = inputDom ? content + ';' + inputDom.value : content;
                deepActionData({
                    component_type: component_type,
                    action_index: '',
                    action: aciton || 'Click',
                    name: name,
                    index: '',
                    timestamp: new Date().getTime(),
                })
            })
        } else if (type == 'keydown') {
            dom.addEventListener('keydown', function(e) {
                if (e.keyCode == '13') {
                    var name = inputDom ? content + ';' + inputDom.value : content;
                    deepActionData({
                        component_type: component_type,
                        action_index: '',
                        action: aciton || 'Click',
                        name: name,
                        index: '',
                        timestamp: new Date().getTime(),
                    })
                    setTimeout(function() {
                        var acitonLast1 = actions[actions.length - 1]
                        var acitonLast2 = actions[actions.length - 2]
                        if (acitonLast1.name === acitonLast2.name) {
                            actions.pop()
                        }
                    }, 500)
                }
            })
        }
    }
}

var header_component_type = {
    0: "HeaderTopLinks",
    1: "HeaderFunction",
    2: "HeaderNav",
    3: "HeaderBanner",
};

var footer_component_type = {
    0: "FooterFunction",
    1: "FooterNav",
    2: "FooterExtentions",
};

var clickTimer = setInterval(function() {
    var aHeaderFooterDoms = document.querySelectorAll("header a, footer a");
    var headerDivs = document.querySelectorAll("header > div");

    var headerContentItems = [
        headerDivs[0],
        headerDivs[1],
        headerDivs[2],
        headerDivs[3],
    ];

    var footerSignupDom = document.querySelectorAll(
    "footer > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)"
    );
    var footerMenuDom = document.querySelectorAll(
    "footer > div:nth-child(1) > div:nth-child(1) > div:nth-child(3)"
    );
    var footerAccessibilityDom = document.querySelectorAll(
    "footer > div:nth-child(2)"
    );

    var footerContentItems = [
        footerSignupDom[0],
        footerMenuDom[0],
        footerAccessibilityDom[0]
    ];

    var searchDom = document.querySelector('header > div:nth-child(2) > div:nth-child(2)')
    var SearchPopupDoms = document.querySelector('header > div:nth-child(2) ul')
    
    // element for a
    for (var s = 0; s < aHeaderFooterDoms.length; s++) {
        (function (S) {
            var aHeaderFooterDom = aHeaderFooterDoms[S];
            if (!aHeaderFooterDom.getAttribute("data-addclick")) {
                aHeaderFooterDom.setAttribute("data-addclick", "true");
                aHeaderFooterDom.addEventListener("click", function (e) {
                var clickIdex = null;
                var clickType = ''
                for (var i = 0; i < headerContentItems.length; i++) {
                    if ( headerContentItems[i].innerHTML.indexOf(aHeaderFooterDom.innerHTML) !== -1) {
                        clickIdex = i;
                        clickType = 'header'
                        break;
                    }
                }
                if (clickIdex === null && footerContentItems && footerContentItems.length !== 0) {
                    for (var j = 0; j < footerContentItems.length; j++) {
                        if ( footerContentItems[j].innerHTML.indexOf(aHeaderFooterDom.innerHTML) !== -1) {
                            clickIdex = j;
                            clickType = 'footer'
                            break;
                        }
                    }
                }
                var payloadData = {};
                var target_component = clickType === 'header' ? "Header" : 'Footer';
                var HeaderTopLinksPopup = document.querySelector('header > div:first-child .chakra-popover__body');
                if (HeaderTopLinksPopup.innerHTML.indexOf(aHeaderFooterDom.innerHTML) > -1){
                    target_component = 'Link Popup'
                }
                if (SearchPopupDoms && SearchPopupDoms.innerHTML.indexOf(aHeaderFooterDom.innerHTML) > -1){
                    target_component = 'Search Popup'
                }
                payloadData.component_type = clickType === 'header' ? header_component_type[clickIdex] : ( clickType === 'footer' ? footer_component_type[clickIdex] : '' );
                payloadData.target_function = "Next Page";
                payloadData.target_component = target_component;
                payloadData.target_title = aHeaderFooterDom.textContent;
                payloadData.target_type = 'Link';
                var aHeaderFooterDomHref = aHeaderFooterDom.getAttribute("href");
                var target_link_url = aHeaderFooterDomHref.indexOf('http') !== -1 ? aHeaderFooterDomHref :  window.location.href.split("/?")[0] + aHeaderFooterDomHref;
                payloadData.target_link_url = target_link_url.replace('com//', 'com/')
                payloadData.target_link_urlpath = aHeaderFooterDomHref.indexOf('http') !== -1 ? '' : aHeaderFooterDomHref;

                if (payloadData.target_link_urlpath.indexOf('/shop/') !== -1) {
                    payloadData.target_component = "shopCategory";
                } else if (
                    document.querySelector('footer').innerHTML.indexOf(aHeaderFooterDom.innerHTML) === -1 &&
                    ['/signin?returnUrl=/', '/signup?returnUrl=/', '/track-my-order', '/guest-history/browsing-history'].indexOf(payloadData.target_link_urlpath) > -1
                ) {
                    payloadData.target_component = "Sign In Popup";
                    payloadData.component_type = 'Header'
                }
                
                if (myStoreDom && myStoreDom.innerHTML.indexOf(aHeaderFooterDom) > -1) {
                    payloadData.target_component = "My Store Popup";
                }

                if (aHeaderFooterDom && aHeaderFooterDom.getAttribute('aria-label') && aHeaderFooterDom.getAttribute('aria-label').indexOf('Logo Home') > -1) {
                    payloadData.target_title = 'Logo'
                    payloadData.target_link_url = location.href.split('com/')[0] + 'com/'
                }

                if (aHeaderFooterDom.getAttribute('href').indexOf('tel:') !== -1) {
                    delete payloadData.target_link_url
                    delete payloadData.target_link_urlpath
                }

                payloadData.my_store_default = getMyStoreName()
                payloadData.my_store_changed = myStoreChanged.length <= 5 ? myStoreChanged : myStoreChanged.splice(0, 5)

                var layer = {
                    event: "user_action_tracking_global",
                    payload: payloadData,
                    actions: actions.length <= 5 ? actions : actions.splice(0, 5),
                };
                console.log(layer);
                dataLayer.push(layer);
            });
            }
        })(s);
    }

    // product logo events
    if (location.href.indexOf('/checkout') > -1 || location.href.indexOf('/signup') > -1) {
        var logoDom = location.href.indexOf('/checkout') > -1 ? document.querySelector('header > div > div > span > svg') : document.querySelector('#__next > div:last-child > div:first-child > div:first-child')
        if (logoDom && !logoDom.getAttribute('data-addclick')) {
            logoDom.setAttribute('data-addclick', 'true')
            logoDom.addEventListener('click', function(e) {
                var payloadData = {
                    component_type: header_component_type[1],
                    target_function: "Next Page",
                    target_component: "Header",
                    target_title: "Logo",
                    target_type: "Link",
                    target_link_url: location.href.split('com/')[0] + 'com/',
                    target_link_urlpath: "/",
                    my_store_default: '',
                    my_store_default: '',
                    my_store_changed: []
                }
                var layer = {
                    event: "user_action_tracking_global",
                    payload: payloadData,
                    actions: actions.length <= 5 ? actions : actions.splice(0, 5),
                };
                console.log(layer);
                dataLayer.push(layer);
            })
        }
    }

    var searchButton = searchDom ? searchDom.querySelector('button') : ''
    var searchInput = searchDom ? searchDom.querySelector('input') : ''
    function SearchEvents() {
        var payloadData = {}
        payloadData.component_type = header_component_type[1];
        payloadData.target_function = "Next Page";
        payloadData.target_component = "Header";
        payloadData.target_title = searchInput.value;
        payloadData.target_type = "Search";
        payloadData.target_link_url = location.href.split('?')[0] + '?q=' +  searchInput.value;
        payloadData.target_link_urlpath = '';
        payloadData.my_store_default = getMyStoreName()
        payloadData.my_store_changed = myStoreChanged.length <= 5 ? myStoreChanged : myStoreChanged.splice(0, 5)
        var layer = {
            event: "user_action_tracking_global",
            payload: payloadData,
            actions: actions.length <= 5 ? actions : actions.splice(0, 5),
        };
        console.log(layer);
        dataLayer.push(layer);
    }
    if (searchButton && !searchButton.getAttribute('data-addclick')) {
        searchButton.setAttribute('data-addclick', 'true')
        searchButton.addEventListener('click', function(e) {
            SearchEvents()
        })
    }
    if (searchInput && !searchInput.getAttribute('data-addclick')) {
        searchInput.setAttribute('data-addclick', 'true')
        searchInput.addEventListener('keydown', function(e) {
            if (e.keyCode == '13') {
                SearchEvents()
            }
        })
    }

    if (SearchPopupDoms) {
        var SearchPopupSpans = SearchPopupDoms.querySelectorAll('li>div')
        for (var u=0;u<SearchPopupSpans.length;u++) {
            (function(spanIdx) {
                var spanDom = SearchPopupSpans[spanIdx]
                if (spanDom && !spanDom.getAttribute('data-addclick')) {
                    spanDom.setAttribute('data-addclick', 'true')
                    spanDom.addEventListener('click', function(e) {
                        var payloadData = {}
                        payloadData.component_type = header_component_type[1];
                        payloadData.target_function = "Next Page";
                        payloadData.target_component = "Search Popup";
                        payloadData.target_title = spanDom.textContent;
                        payloadData.target_type = "Link";
                        payloadData.target_link_url = location.href.split('?')[0] + '?q=' +  spanDom.textContent;
                        payloadData.target_link_urlpath = '';
                        payloadData.my_store_default = getMyStoreName()
                        payloadData.my_store_changed = myStoreChanged.length <= 5 ? myStoreChanged : myStoreChanged.splice(0, 5)
                        var layer = {
                            event: "user_action_tracking_global",
                            payload: payloadData,
                            actions: actions.length <= 5 ? actions : actions.splice(0, 5),
                        };
                        console.log(layer);
                        dataLayer.push(layer);
                    })
                }
            })(u)
        }
    }

    var viewMyCartDom = findTextContent('p', 'View My Cart')
    if (viewMyCartDom.length !== 0) {
        var viewMyCartBubtton = viewMyCartDom[0].parentNode.parentNode
        if (!viewMyCartBubtton.getAttribute('data-addclick')) {
            viewMyCartBubtton.setAttribute('data-addclick', 'true')
            viewMyCartBubtton.addEventListener('click', function() {
                var payloadData = {}
                payloadData.component_type = header_component_type[1];
                payloadData.target_function = "Next Page";
                payloadData.target_component = "My Cart Popup";
                payloadData.target_title = 'View My Cart';
                payloadData.target_type = "Link";
                payloadData.target_link_url = location.href.split('?')[0] + '/cart';
                payloadData.target_link_urlpath = '/cart';
                payloadData.my_store_default = getMyStoreName()
                payloadData.my_store_changed = myStoreChanged.length <= 5 ? myStoreChanged : myStoreChanged.splice(0, 5)
                var layer = {
                    event: "user_action_tracking_global",
                    payload: payloadData,
                    actions: actions.length <= 5 ? actions : actions.splice(0, 5),
                };
                console.log(layer);
                dataLayer.push(layer);
            })
        }
    }

    // element for other events
    var myStoreDom = document.querySelector('header > div:nth-child(2) > div:nth-child(4) .chakra-popover__popper')
    var chakraSlideDom = document.querySelector('.chakra-slide')
    var mySlides = [myStoreDom, chakraSlideDom]
    for (var m = 0; m< mySlides.length; m++) {
        (function(myIdx) {
            var popupDom = mySlides[myIdx]
            if (popupDom) {
                var clickTexts = ['Directions', 'View Store Page']
                for (var n=0;n<clickTexts.length;n++) {
                    (function(textIndex) {
                        var textDoms = findTextContent('p', clickTexts[textIndex])
                        for (var idx=0;idx<textDoms.length;idx++) {
                            (function(textIdx) {
                                var textDom = textDoms[textIdx]
                                if (textDom && !textDom.getAttribute('data-addclick')) {
                                    textDom.setAttribute('data-addclick', 'true')
                                    textDom.addEventListener('click', function(e) {
                                        var payloadData = {}
                                        payloadData.component_type = header_component_type[1];
                                        payloadData.target_function = "Next Page";
                                        payloadData.target_component = myIdx == 0 ? "My Store Popup" : 'My Store Slide Popup';
                                        payloadData.target_title = textDom.textContent;
                                        payloadData.target_type = "String";
                                        payloadData.my_store_default = getMyStoreName()
                                        payloadData.my_store_changed = myStoreChanged.length <= 5 ? myStoreChanged : myStoreChanged.splice(0, 5)
                                        var layer = {
                                            event: "user_action_tracking_global",
                                            payload: payloadData,
                                            actions: actions.length <= 5 ? actions : actions.splice(0, 5),
                                        };
                                        console.log(layer);
                                        dataLayer.push(layer);
                                    })
                                }
                            })(idx)
                        }
                    })(n)
                }
            }
        })(m)
    }


    // Element side left for actions
    var leftMyStoreDom = document.querySelector('.chakra-modal__content')
    if (leftMyStoreDom) {
        // texxt Details
        var detailsDoms = findTextContent('p', 'Details')
        for (var d=0;d<detailsDoms.length;d++) {
            (function(detailIndex) {
                var detailCurrent  = detailsDoms[detailIndex]
                detailCurrent && addAction(detailCurrent, 'My Store', 'Details')
            })(d)
        }
        // text radio actions
        var radios = leftMyStoreDom.querySelectorAll('.chakra-radio')
        for (var i=0;i<radios.length;i++) {
            (function(r) {
                var radioDom = radios[r]
                if (radioDom && !radioDom.getAttribute('data-addclick')) {
                    radioDom.setAttribute('data-addclick', 'true')
                    radioDom.addEventListener('click', function(e) {
                        if (!repeatClickStoreName || repeatClickStoreName != radioDom.parentNode.parentNode.textContent) {
                            repeatClickStoreName = radioDom.parentNode.parentNode.textContent
                            deepStoreData({
                                my_store_action: 'Click',
                                my_store_click_name: repeatClickStoreName,
                                my_store_index: r + 1,
                                my_store_timestamp: new Date().getTime(),
                            })
                        }
                    })
                }
            })(i)
        }
        var storeInput = leftMyStoreDom.querySelector('.chakra-input')
        if (storeInput) {
            storeInput.addEventListener('keydown', function(e) {
                if (e.keyCode == '13') {
                    if (keydownData !== 'Search_' + storeInput.value) {
                        keydownData = 'Search_' + storeInput.value
                        var mi = storeInput.parentNode.parentNode.querySelector('div:nth-child(2) button').textContent
                        setTimeout(function(){
                            var radioGroup = leftMyStoreDom.querySelectorAll('.chakra-radio-group > div')
                            var gMax  = radioGroup.length < 5 ? radioGroup.length : 5
                            var codeAry = []
                            for (var g = 0; g < gMax;g++) {
                                (function(gg) {
                                    if (radioGroup[gg]) {
                                        var radioGroupDiv = radioGroup[gg].querySelector('div > div:nth-child(2) > p:nth-child(2)')
                                        if (radioGroupDiv && radioGroupDiv.textContent) {
                                            var zipCodeAry = radioGroupDiv.textContent.trim().split(/\s+/)
                                            var zipCode = zipCodeAry[zipCodeAry.length - 1]
                                            codeAry.push(zipCode)
                                        }
                                    }
                                })(g)
                            }
                            deepActionData({
                                component_type: 'My Store',
                                action_index: '',
                                action: 'Search',
                                name: storeInput.value.trim() + '; ' + mi.trim(),
                                index: '',
                                timestamp: new Date().getTime(),
                            })
                        }, 1000)
                    }
                }
            })
        }
        // text radio actions
        var myStoreButtons = leftMyStoreDom.querySelectorAll('button')
        var changeMyStoreButton = myStoreButtons[myStoreButtons.length - 1]
        var closeButton = myStoreButtons[0]
        changeMyStoreButton && addAction(changeMyStoreButton, 'My Store', changeMyStoreButton.textContent)
        closeButton && addAction(closeButton, 'My Store', 'X')
    }

    // action mystore FIND OTHER STORES
    var findStoreButton = findTextContent('p', 'FIND OTHER STORES')[0]
    findStoreButton && addAction(findStoreButton, 'My Store', findStoreButton.textContent)

    // actions header
    var headerMenuContainer = document.querySelectorAll('.headerMenuContainer')[0]
    addAction(headerMenuContainer, 'Header', 'icon-tabler')

    // actions footer
    var footerButtonEvents = document.querySelectorAll('footer > div:nth-child(1) > div > div:last-child button')
    if (footerButtonEvents) { 
        for (var i = 0; i < footerButtonEvents.length; i++) {
            footerButtonEvents[i] && addAction(footerButtonEvents[i], 'Footer', footerButtonEvents[i].textContent)
        }
    }
    var footerSignButton = document.querySelector('footer form button')
    var footerSignInput = document.querySelector('footer form input')
    footerSignButton && addAction(footerSignButton, 'Footer', footerSignButton.textContent, 'Subscribe', 'click', footerSignInput)
    footerSignInput && addAction(footerSignInput, 'Footer', footerSignButton.textContent, 'Subscribe','keydown', footerSignInput)

}, 1000)

window.onunload = function() {
    clearInterval(clickTimer)
}


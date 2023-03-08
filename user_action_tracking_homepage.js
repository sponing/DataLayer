var doUrlAndPath = function(data, aDom) {
    if (aDom.getAttribute('href') && aDom.getAttribute('href').indexOf('http') > -1) {
        data.target_link_url = aDom.getAttribute('href')
    } else if (aDom.getAttribute('href')) {
        data.target_link_urlpath = aDom.getAttribute('href')
        var href = window.location.href.split('?')[0]
        data.target_link_url = href.replace('com/', 'com') + aDom.getAttribute('href')
    }
}

var getTargetNums = function (title, type, componentId) {
    type = type || 'position'
    if (!window.__NEXT_DATA__) return []
    var modules = window.__NEXT_DATA__.props.pageProps.modules
    var modulesIndexs = []
    for (var modulesIndex = 0; modulesIndex < modules.length; modulesIndex++) {
        if (modules[modulesIndex] && modules[modulesIndex].title === title && modules[modulesIndex].show) {
            modulesIndexs.push(modulesIndex)
        }
    }
    if (type === 'data') {
        return modules.filter(function(item) { return 'dc'+item.id === componentId})[0].data
     }
    return modulesIndexs
}
var actions = []
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
var clientFetchComponents = ['Tab Products', 'WeeklyAds', 'Product Carousel']
var clickTimer = setInterval(function() {
    var componentsAll = document.querySelectorAll('#componentsBox > div')
    var components = []
    for (var i = 0; i < componentsAll.length; i++) {
        if (componentsAll[i].id && componentsAll[i].textContent) {
            components.push(componentsAll[i])
        }
    }
    for (var i = 0; i < components.length; i++) {
        (function(comIndex){
            var component = components[comIndex]
            var componenttitle = component.getAttribute('componenttitle') || undefined
                var aDoms = component.querySelectorAll( componenttitle === 'Categories' ? '.EventClassCard' : 'a')
                for (var j = 0; j < aDoms.length;j++) {
                    (function(comjndex) {
                        if (!clientFetchComponents.includes(componenttitle)) {
                            if (!aDoms[comjndex].getAttribute('data-addclick')) {
                                aDoms[comjndex].addEventListener('click', function(e) {
                                    getComponentData(component, componenttitle, comIndex, component.id, aDoms[comjndex], comjndex)
                                })
                                aDoms[comjndex].setAttribute('data-addclick', 'true')
                            }
                        } else {
                            var componentTimer = setInterval(function(){
                                var componentHasDom = {
                                    'Tab Products': '.chakra-tabs__tab-panels a',
                                    'WeeklyAds': '.slick-track a',
                                    'Product Carousel': '.slick-track a'
                                }
                                var tapProductsDom = component.querySelectorAll(componentHasDom[componenttitle])
                                if (tapProductsDom && tapProductsDom.length > 0) {
                                    // componentdsAddClickObject[comIndex+ ',' + componenttitle] = true
                                    if (!aDoms[comjndex].getAttribute('data-addclick')) {
                                        aDoms[comjndex].addEventListener('click', function(e) {
                                            getComponentData(component, componenttitle, comIndex, component.id, aDoms[comjndex], comjndex)
                                        })
                                        aDoms[comjndex].setAttribute('data-addclick', 'true')
                                    }
                                    clearInterval(componentTimer)
                                }
                            }, 500)
                        }
                    })(j)
                }
                if (componenttitle === 'Tab Products') {
                    var actionEventDoms = component.querySelectorAll('#tabContent button')
                    for (var h = 0; h < actionEventDoms.length;h++) {
                        (function(indexh) {
                            if (!actionEventDoms[indexh].getAttribute('data-addclick')) {
                                actionEventDoms[indexh].addEventListener('click', function() {
                                    deepActionData({
                                        component_type: componenttitle,
                                        index: comIndex + 1,
                                        action_index: indexh + 1,
                                        action: location.href.indexOf('mobile') > -1 ? 'Slide (mobile)' : 'Click (web)',
                                        name: actionEventDoms[indexh].textContent,
                                        timestamp: new Date().getTime(),
                                    })
                                })
                                actionEventDoms[indexh].setAttribute('data-addclick', 'true')
                            }
                        })(h)
                    }
                } else if (componenttitle === 'Product Carousel' || componenttitle === 'Classes' || componenttitle === 'Projects' || componenttitle === 'Hero Carousel') {
                    var actionEventDoms = component.querySelectorAll('.slick-arrow')
                    for (var h = 0; h < actionEventDoms.length;h++) {
                        (function(indexh) {
                            if (!actionEventDoms[indexh].getAttribute('data-addclick')) {
                                actionEventDoms[indexh].addEventListener('click', function() {
                                    deepActionData({
                                        component_type: componenttitle,
                                        index: comIndex + 1,
                                        action_index: indexh + 1,
                                        action: location.href.indexOf('mobile') > -1 ? 'Slide (mobile)' : 'Click (web)',
                                        name: actionEventDoms[indexh].classList.contains('slick-next') ? 'Right Arrow' : 'Left Arrow',
                                        timestamp: new Date().getTime(),
                                    })
                                })
                                actionEventDoms[indexh].setAttribute('data-addclick', 'true')
                            }
                        })(h)
                    }
                }
            // }
        })(i)
    }
}, 1000)
window.onunload = function() {
    clearInterval(clickTimer)
}
function getComponentHeader(domElement, aDom, selectDiv) {
    var headerData = { moreText: '', moreHref: '' }
    var isClickMore = false
    var componentHeader = domElement.querySelector( selectDiv || '.EventClass > div:nth-child(1)')
    headerData.component_subtitle = componentHeader.querySelector('h2') ? componentHeader.querySelector('h2').textContent : ''
    headerData.component_lead_in = componentHeader.querySelector('p') ? componentHeader.querySelector('p').textContent : ''
    if (componentHeader.innerHTML.indexOf(aDom.innerHTML) > -1) {
        headerData.moreText = aDom.textContent
        headerData.moreHref = aDom.getAttribute('href')
        isClickMore = true
    }
    return { isClickMore: isClickMore, headerData: headerData }
}
function getSkuFormHref(element) {
    var href = element.getAttribute('href')
    var skuArr = href.split('?')[0].split('-')
    var sku = skuArr[skuArr.length - 1]
    return sku
}
function getComponentData(componentDom, componenttitle, componentPosition, comId, aDom, aDomIndex) {
    var payloadData = {
        component_type: componentDom.getAttribute('componentname'),
        component_position: componentPosition + 1,
        component_id: window.__NEXT_DATA__.props.pageProps.modules[componentPosition + 1].id,
        component_title: componenttitle,
        component_timestamp: new Date().getTime(),
        component_subtitle: '',
        component_lead_in:  '',
        button_name: '',
        button_color: '',
        target_content: '',
        target_title: '',
        target_subtitle: '',
        target_type: 'Text',
        target_text_color : '',
        target_position: '',
        target_link_url: '',
        target_link_urlpath: ''
    }
    if (componenttitle === 'Hero Carousel') {
        payloadData.target_title = aDom.querySelector('h1') ? aDom.querySelector('h1').textContent : aDom.querySelector('h2').textContent
        payloadData.target_content = aDom.textContent
        payloadData.target_text_color = getComputedStyle(aDom.querySelector('h1') || aDom.querySelector('h2'), null)['color']
        payloadData.target_subtitle = aDom.querySelector('h4') ? aDom.querySelector('h4').textContent : ''
        doUrlAndPath(payloadData, aDom)
        payloadData.button_name = aDom.querySelector('button') ? aDom.querySelector('button').textContent : ''
        payloadData.target_position = aDomIndex + 1
        payloadData.button_color = getComputedStyle(aDom.querySelector('button'), null)['color']
    } else if (componenttitle === 'Promo Subset') {
        var headerElement = getComponentHeader(componentDom, aDom)
        payloadData.component_subtitle = headerElement.headerData.component_subtitle
        payloadData.component_lead_in = headerElement.headerData.component_lead_in
        doUrlAndPath(payloadData, aDom)
        if (!headerElement.isClickMore) {
            payloadData.target_content = aDom.querySelector('p:nth-child(1)') ? aDom.querySelector('p:nth-child(1)').textContent : ''
            payloadData.target_title = aDom.querySelector('p:nth-child(2)') ? aDom.querySelector('p:nth-child(2)').textContent : ''
            payloadData.target_text_color = getComputedStyle(aDom.querySelector('p:nth-child(2)'), null)['color']
            payloadData.target_subtitle = aDom.querySelector('p:nth-child(2)') ? aDom.querySelector('p:nth-child(2)').textContent : ''
            payloadData.target_position = aDomIndex + 1
        } else {
            payloadData.target_title = headerElement.headerData.moreText
            payloadData.target_content = headerElement.headerData.moreText
        }
    } else if (componenttitle === 'Tab Products') {
        var headerElement = getComponentHeader(componentDom, aDom)
        payloadData.component_subtitle = headerElement.headerData.component_subtitle
        payloadData.component_lead_in = componentDom.querySelector('.EventClass > div:nth-child(1)>p') ? componentDom.querySelector('.EventClass > div:nth-child(1)>p').textContent : ''
        if (!headerElement.isClickMore) {
            var buttons = componentDom.querySelectorAll('#tabContent button')
            var buttonActive = 0
            for (var i = 0; i < buttons.length; i++) {
                if (buttons[i].getAttribute('aria-selected') === 'true') {
                    buttonActive = i
                    break;
                }
            }
            var fetchData = getTargetNums('Tab Products', 'data', comId).fetch_data.resultsNew[buttonActive]
            var sku = getSkuFormHref(aDom)
            for (var i = 0; i < fetchData.products.length; i++) {
                if (fetchData.products[i].skuNumber == sku) {
                    doUrlAndPath(payloadData, aDom)
                    payloadData.target_position = i + 1
                    payloadData.target_title = fetchData.products[i].productName
                    payloadData.target_content = aDom.textContent
                    payloadData.product = fetchData.products[i]
                    payloadData.target_type = 'Product'
                    break;
                }
            }
        }  else {
            payloadData.target_title = headerElement.headerData.moreText
            payloadData.target_content = headerElement.headerData.moreText
            doUrlAndPath(payloadData, aDom)
        }
    } else if (componenttitle === 'Product Carousel'){
        var headerElement = getComponentHeader(componentDom, aDom, '.EventClass > div > div:nth-child(1)')
        payloadData.component_subtitle = headerElement.headerData.component_subtitle
        payloadData.component_lead_in = headerElement.headerData.component_lead_in
        doUrlAndPath(payloadData, aDom)
        if (!headerElement.isClickMore) {
            var fetchData = getTargetNums('Product Carousel', 'data', comId)['fetch_data']
            var sku = getSkuFormHref(aDom)
            for (var i = 0; i < fetchData.length; i++){
                if (fetchData[i].skuNumber === sku) {
                    payloadData.product = fetchData[i]
                    payloadData.target_position = i + 1
                    payloadData.target_type = 'Product'
                    break
                }
            }
            payloadData.target_title = aDom.querySelector('p:nth-child(1)') ? aDom.querySelector('p:nth-child(1)').textContent : ''
            payloadData.target_content = aDom.textContent
            payloadData.target_subtitle = aDom.querySelector('p:nth-child(3)') ? aDom.querySelector('p:nth-child(3)').textContent : ''
        }  else {
            payloadData.target_title = headerElement.headerData.moreText
            payloadData.target_content = headerElement.headerData.moreText
        }
    } else if (componenttitle === 'Sublanding Hero Right' || componenttitle === 'Sublanding Hero Left') {
        payloadData.button_color = getComputedStyle(aDom, null)['color']
        payloadData.button_name = aDom.textContent
        payloadData.target_content = componentDom.textContent
        payloadData.target_title = componentDom.querySelector('h2') ? componentDom.querySelector('h2').textContent : ''
        payloadData.component_subtitle =  componentDom.querySelector('h2') ? componentDom.querySelector('h2').textContent : ''
        payloadData.component_lead_in = payloadData.target_subtitle = componentDom.querySelector('h3') ? componentDom.querySelector('h3').textContent : ''
        payloadData.target_position = 1
        doUrlAndPath(payloadData, aDom)
    } else if (componenttitle === 'Classes' || componenttitle === 'Holiday Decor' || componenttitle === 'Projects') {
        var headerElement = getComponentHeader(componentDom, aDom)
        payloadData.component_subtitle = headerElement.headerData.component_subtitle
        payloadData.component_lead_in = headerElement.headerData.component_lead_in
        doUrlAndPath(payloadData, aDom)
        if (!headerElement.isClickMore) {
            var fetchData = getTargetNums('componenttitle', 'data', comId)['fetch_data']
            var sku = getSkuFormHref(aDom)
            var skuKey = {
                'Classes': 'eventId',
                'Projects':'externalId',
                'Holiday Decor': 'skuNumber'
            }
            for (var i = 0; i < fetchData.length; i++){
                if (fetchData[i][skuKey[componenttitle] || 'skuNumber'] === sku) {
                    payloadData.product = fetchData[i]
                    var targetType = {
                        'Classes': 'Classes',
                        'Holiday Decor': 'Product',
                        'Projects': 'Project'
                    }
                    payloadData.target_type = targetType[componenttitle]
                    payloadData.target_position = i + 1
                    if (componenttitle === 'Classes') {
                        payloadData.classId = sku
                    } else if (componenttitle === 'Projects') {
                        payloadData.projectId = sku
                    }
                    break
                }
            }
            payloadData.target_title = aDom.querySelector('p:nth-child(1)') ? aDom.querySelector('p:nth-child(1)').textContent : ''
            payloadData.target_content = aDom.textContent
        }  else {
            payloadData.target_title = headerElement.headerData.moreText
            payloadData.target_content = headerElement.headerData.moreText
        }
    } else if (componenttitle === 'WeeklyAds') {
        var headerElement = getComponentHeader(componentDom, aDom, '.EventClass > div > div:nth-child(1)')
        payloadData.component_subtitle = headerElement.headerData.component_subtitle
        payloadData.component_lead_in = headerElement.headerData.component_lead_in
        doUrlAndPath(payloadData, aDom)
        if (!headerElement.isClickMore) {
            payloadData.target_position = aDomIndex + 1
            payloadData.target_title = aDom.querySelectorAll('p')[1] ? aDom.querySelectorAll('p')[1].textContent : ''
            payloadData.target_content = aDom.textContent
            payloadData.target_subtitle = aDom.querySelectorAll('p')[2] ? aDom.querySelectorAll('p')[2].textContent : ''
        }  else {
            payloadData.target_title = headerElement.headerData.moreText
            payloadData.target_content = headerElement.headerData.moreText
        }
    } else if (componenttitle === 'Inspirations') {
        var headerElement = getComponentHeader(componentDom, aDom, '.EventClass > div > div:nth-child(1)')
        var leftDom = componentDom.querySelector('.EventClass > div > div:nth-child(1)')
        if (headerElement.isClickMore) {
            payloadData.component_subtitle = leftDom.querySelector('p:nth-child(1)') ? leftDom.querySelector('p:nth-child(1)').textContent : ''
            payloadData.component_lead_in = leftDom.querySelector('p:nth-child(2)') ? leftDom.querySelector('p:nth-child(2)').textContent : ''
            payloadData.button_name = leftDom.querySelector('button').textContent
            payloadData.button_color = getComputedStyle(leftDom.querySelector('button'), null)['color']
            payloadData.target_type = 'Text'
            payloadData.target_content = leftDom.textContent
            payloadData.target_title = leftDom.querySelectorAll('p')[0] ? leftDom.querySelectorAll('p')[0].textContent : ''
            payloadData.target_subtitle = leftDom.querySelectorAll('p')[1] ? leftDom.querySelectorAll('p')[1].textContent : ''
            doUrlAndPath(payloadData, aDom)
        } else {
            var target_position = aDomIndex + ( leftDom.querySelector('button').textContent ? 0 : 1 )
            var fetchData = getTargetNums('componenttitle', 'data', comId)['rightList']
            for (var indexSku = 0; indexSku < fetchData.length; indexSku++) {
                var element = fetchData[indexSku].subSKUArr;
                payloadData.product = ''
                for (var idx = 0; idx < element.length; idx++) {
                    var ele = element[idx];
                    if (ele.skuNumber === getSkuFormHref(aDom)) {
                        payloadData.product = ele
                        break
                    }
                }
                if (payloadData.product) { break; }
            }
            payloadData.target_position = target_position
            doUrlAndPath(payloadData, aDom)
            payloadData.target_type = 'Product'
            payloadData.target_title = aDom.querySelector('p:nth-child(1)') ? aDom.querySelector('p:nth-child(1)').textContent : ''
            payloadData.target_content = aDom.textContent
        }
        
    } else if (componenttitle === 'Michaels Family') {
        payloadData.component_subtitle = componentDom.querySelector('h2') ? componentDom.querySelector('h2').textContent : ''
        payloadData.component_lead_in = componentDom.querySelector('p') ? componentDom.querySelector('p').textContent : ''
        payloadData.target_position = aDomIndex + 1
        doUrlAndPath(payloadData, aDom)
        payloadData.target_title = aDom.querySelector('p') ? aDom.querySelector('p').textContent : ''
        payloadData.target_content = aDom.textContent
    } else if (componenttitle === 'ClassEntrance' || componenttitle === 'Image Promo') {
        payloadData.target_position = aDomIndex + 1
        doUrlAndPath(payloadData, aDom)
        payloadData.target_title = aDom.querySelectorAll('p')[0] ? aDom.querySelectorAll('p')[0].textContent : ''
        payloadData.target_content = aDom.textContent
        payloadData.target_subtitle = aDom.querySelectorAll('p')[1] ? aDom.querySelectorAll('p')[1].textContent : ''
    } else if (componenttitle === 'Shipping/Delivery Service') {
        payloadData.target_position = aDomIndex + 1
        doUrlAndPath(payloadData, aDom)
        payloadData.target_content = aDom.textContent
        payloadData.target_title = aDom.querySelector('p:nth-child(1)') ? aDom.querySelector('p:nth-child(1)').textContent : ''
        payloadData.target_subtitle = aDom.querySelector('p:nth-child(2)') ? aDom.querySelector('p:nth-child(2)').nextSibling.textContent : ''
    } else if (componenttitle === 'Text') {
        payloadData.component_subtitle = componentDom.querySelector('p:nth-child(1)') ? componentDom.querySelector('p:nth-child(1)').textContent : ''
        payloadData.component_lead_in = componentDom.textContent
        payloadData.target_position = 1
        payloadData.target_title = aDom.textContent
        payloadData.target_content = componentDom.textContent
    } else if (componenttitle === 'CategorySetting') {
        payloadData.component_subtitle = componentDom.querySelector('h2') ? componentDom.querySelector('h2').textContent : ''
        payloadData.component_lead_in = componentDom.querySelector('p') ? componentDom.querySelector('p').textContent : ''
        payloadData.target_position = aDomIndex + 1
        payloadData.target_url = aDom.getAttribute('href')
        payloadData.target_content = aDom.textContent
        payloadData.target_title = aDom.querySelector('h3') ? aDom.querySelector('h3').textContent : ''
    } else if (componenttitle === 'Categories') {
        payloadData.component_subtitle = componentDom.querySelector('h2') ? componentDom.querySelector('h2').textContent : ''
        payloadData.component_lead_in = componentDom.querySelector('p:nth-child(1)') ? componentDom.querySelector('p:nth-child(1)').textContent : ''
        payloadData.target_position = aDomIndex + 1
        var fetchData = getTargetNums('componenttitle', 'data', comId)['fetch_data'][aDomIndex]
        payloadData.target_content = aDom.textContent
        payloadData.target_title = fetchData.taxonomyName
        var urlPaths = fetchData.urlPath.split('//')
        payloadData.target_link_urlpath = '/shop/' + urlPaths[urlPaths.length - 1]
        var href = window.location.href.split('?')[0]
        payloadData.target_link_url = href.replace('com/', 'com') + payloadData.target_link_urlpath
    } else if (componenttitle === 'Hero Five Image Banner') {
        payloadData.target_position = aDomIndex + 1
        if (aDomIndex===0) {
            payloadData.component_subtitle = componentDom.querySelector('h1') ? componentDom.querySelector('h1').textContent : componentDom.querySelector('h2').textContent
        } else {
            payloadData.component_subtitle = componentDom.querySelector('h4').textContent
        }
        payloadData.component_lead_in = aDom.querySelector('p').textContent
        doUrlAndPath(payloadData, aDom)
    }

    if (window.dataLayer) {
        var layer = {
            event: 'user_action_tracking_homepage',
            payload: payloadData,
            actions: actions.length <= 5 ? actions : actions.splice(0, 5)
        }
        console.log(layer)
        dataLayer.push(layer)
        payloadData = undefined
    }
}

var nextDataTimer = setInterval(function() {
    if (typeof __NEXT_DATA__ === 'object') {
        clearInterval(nextDataTimer)
        var adComponents = {}
        var nextModules = __NEXT_DATA__.props.pageProps.modules
        nextModules.map(function(item, index) {
            if (item['data'] && item['data']['apiPath']) {
                var keyIndex = Object.keys(adComponents).length
                var itemObj = {
                    index: keyIndex,
                    title: item['data']['title'] || item['data']['title1'] ||  item['data']['subTitle'] ||  item['data']['subHead'] || '',
                    apiPath: item['data']['apiPath'],
                }
                adComponents['adComponents-' + item['id']] = itemObj
            }
        })
        dataLayer.push(adComponents)
    }
}, 1000)
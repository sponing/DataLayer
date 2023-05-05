var clearCaratTimer = setInterval(function() {
    if (location.href.indexOf('/cart') > -1 && __NEXT_DATA__ && typeof __NEXT_DATA__ === 'object') {
        clearInterval(clearCaratTimer)
        setTimeout(function() {
            var headerBox = document.querySelector('.headerBox p')
            if (headerBox && headerBox.textContent !== '(0 item)') {
                var monitor = setInterval(function() {
                    var headerBoxMonitor = document.querySelector('.headerBox p')
                    if (!headerBoxMonitor || (headerBoxMonitor && headerBoxMonitor.textContent === '(0 item)')) {
                        clearInterval(monitor)
                        dataLayer.push({
                            event: 'clearCart'
                        });
                    }
                }, 500)
            }
        }, 500)
    }
}, 500)
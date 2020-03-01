function unsafeExecution(what, onError) {
    try {
        return what();
    } catch (e) {
        if (window.console && window.console.debug) {
            console.debug('Operation was not successful.', what, e);
        }
        if (onError) {
            return onError();
        }
    }
}

function displayWindowSize() {
    unsafeExecution(function () {
        var elements = Array.from(document.getElementsByTagName('html'))
            .concat(Array.from(document.getElementsByTagName('body')));
        var windowHeight = document.documentElement.clientHeight;
        var bodyHeight = document.body.clientHeight;
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].style !== undefined) {
                if (windowHeight > bodyHeight) {
                    elements[i].style.height = '100%';
                } else {
                    elements[i].style.height = 'auto';
                }
            }
        }
    })
}

function supportsWebp(callback) {
    unsafeExecution(function () {
        if (!window.createImageBitmap) {
            callback(false);
            return;
        }
        var data = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoCAAEAAQAcJaQAA3AA/v3AgAA=';
        fetch(data).then(function (response) {
            return response.blob();
        }).then(function (blob) {
            // If the createImageBitmap method succeeds, return true, otherwise false
            createImageBitmap(blob).then(function () {
                callback(true);
            }, function () {
                callback(false);
            });
        });
    })
}

function webpCheck() {
    supportsWebp(function (supported) {
        unsafeExecution(() => {
            var elements = document.getElementsByTagName('body');
            for (var i = 0; i < elements.length; i++) {
                elements.item(i).setAttribute('data-webp-supported', supported);
            }
        })
    });
}

window.addEventListener("resize", displayWindowSize);
window.addEventListener("load", displayWindowSize);
window.addEventListener("load", webpCheck);

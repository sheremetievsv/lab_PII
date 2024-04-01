
SW:  CACHE_NAME = 'PWA_Cache';


self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Opened cache', CACHE_NAME);
            return cache.addAll([
                "/Lab1/html/students.html",
                "/Lab1/html/tasks.html",
                "/Lab1/css/students.css",
                "/Lab1/css/tasks.css",
                "/Lab1/css/header.css",
                "/Lab1/js/script.js",
                "/Lab1/manifest.json",
                "/Lab1/images/bell-icon.png",
            ]).catch(error => {
                console.error('Cache addAll error:', error);
            });
        }).catch(error => {
            console.error('Cache open error:', error);
        })
    );
});




self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                if (response) {
                    return response;
                }

                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(
                    function(response) {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});

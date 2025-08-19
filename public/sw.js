const CACHE_NAME = "ozemfire-v1";
const urlsToCache = [
  "/",
  "/form",
  "/response",
  "/ozemfirelogo.png.png",
  "/simbolo.png",
  "/body.webp",
];

// Instalação do Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache aberto");
      return cache.addAll(urlsToCache);
    })
  );
});

// Interceptação de requisições
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Retorna do cache se disponível
      if (response) {
        return response;
      }
      // Caso contrário, busca da rede
      return fetch(event.request);
    })
  );
});

// Atualização do cache
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

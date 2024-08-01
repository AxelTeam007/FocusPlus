// Fonction pour masquer les recommandations
function filterYouTube() {
  // Trouver les éléments de recommandations de manière plus efficace
  const selectors = [
    'ytd-rich-item-renderer',
    'ytd-watch-next-secondary-results-renderer',
    'ytd-shelf-renderer'
  ];
  
  // Créer une liste d'éléments à masquer
  const elementsToHide = [];
  selectors.forEach(selector => {
    elementsToHide.push(...document.querySelectorAll(selector));
  });
  
  // Masquer les éléments en une seule opération
  elementsToHide.forEach(el => el.style.display = 'none');
  
  // S'assurer que la barre de recherche est visible
  const searchBar = document.querySelector('ytd-search');
  if (searchBar) {
    searchBar.style.display = 'block';
  }
}

// Vérifier l'état de la case à cocher dans le stockage local
chrome.storage.local.get('youtubeFilter', (result) => {
  if (result.youtubeFilter) {
    filterYouTube();
  }
});

// Observer les changements dans le DOM pour appliquer le filtre lorsque les éléments sont ajoutés
const observer = new MutationObserver((mutations) => {
  // Vérifier l'état du filtre dans chaque mutation
  chrome.storage.local.get('youtubeFilter', (result) => {
    if (result.youtubeFilter) {
      // Filtrer les vidéos seulement si des mutations pertinentes ont eu lieu
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          filterYouTube();
        }
      });
    }
  });
});

observer.observe(document.body, { childList: true, subtree: true });

// Utiliser requestAnimationFrame pour s'assurer que les changements sont appliqués en douceur
requestAnimationFrame(() => {
  chrome.storage.local.get('youtubeFilter', (result) => {
    if (result.youtubeFilter) {
      filterYouTube();
    }
  });
});

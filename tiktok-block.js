chrome.storage.local.get('tiktokFilter', (result) => {
  if (result.tiktokFilter) {
    document.documentElement.innerHTML = `
      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #fff;
          font-family: Arial, sans-serif;
          text-align: center;
        }
        h1 {
          font-size: 2em;
          margin: 0;
        }
      </style>
      <div>
        <h1>Accès à TikTok désactivé</h1>
        <p>Si vous souhaitez accéder à ce site vous devez désactiver l’option de l’extension FocusPlus : Extensions > FocusPlus > Désactiver TikTok</p>
      </div>
    `;
    document.documentElement.scrollTop = 0;
  }
});

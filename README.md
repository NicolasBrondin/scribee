## Passage en application native 

Listes des modifications pour transformation en appli native:

Both:
- Bloquer l'orientation en paysage

iOS:
- Désactiver le bounce
-self.Webview.mediaPlaybackRequiresUserAction = NO;

Android:

webSettings.setJavaScriptEnabled(true);
webSettings.setDomStorageEnabled(true);
webSettings.setMediaPlaybackRequiresUserGesture(false);
webSettings.setAllowUniversalAccessFromFileURLs(true);

Bugs:

- Le son ne se démarre qu'au touché
- le nuage n'arrive qu'une seule fois
- l'animation ne se joue qu'une seule fois
- iOS: le son bug un tout petit peu quand un autre son est joué (pas tout le temps)
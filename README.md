# Scribee
Scribee is a story-based game for children to help them learn words with cards to drag and drop in the sentences.

Live demo is available here: [https://nicolasbrondin.github.io/scribee/](https://nicolasbrondin.github.io/scribee/)

![Project cover](docs/cover.png)

## How to start

The game was developed as mobile first using Vanilla Javascript only. To start the web server, the only things you need to do are:

```
npm install
npm run start
```

but you can simply host it in a classic web server and open the index page.

## Adding a story

Stories are stored in the data folder. Each story is stored in its own folder and referenced in the file `data/stories.json` (don't forget to add yours in the file).

The stories images are located in the `./img/` folder (which should be refactored contributions are welcome) and the sounds are located in the story folder itself. All the stories informations are stored in the file `/data/[story]/story_manifest.json` and are splitted into differents sections:

- Scenes are composed of one sentence (words) and one audio file.
- Words are pieces of text which might appear as "holes" if an image is referenced.

## Help

If you want need any help setting up the project or adding stories, feel free to open issues I will be glad to help you!

## Acknowledgements
All the wonderful story images and the game UI was drawn by the awesome Joris Discepoli (aka. Okionero), you can find more of his work on his website: [okionero.com](http://okionero.com/)

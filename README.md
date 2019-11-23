# Bingo Card

A bingo game made for use while watching schmaltzy Christmas movies.
It is easily extended to other domains by adding new prompts.

## Quickstart

### To test this locally:

* Clone the repo and install it.

```sh
git clone git@github.com:HaroldPutman/bingo-cards.git
npm install
```

* Start the local server with `npm start`.
* Visit [localhost:3000](http://localhost:3000).

### Deploy to web

When you are ready to deploy to Google Cloud Storage:

* Set up and connect to your GCP account and project

```sh
gcloud auth login
gcloud config set project bingo-card-257920
```

* Deploy the site with : `npm run deploy`

## Prompts

You can create your own prompts in a JSON file. The default is [film-tropes](www/film-tropes.json).
This is designed for use while viewing shmaltzy Christmas movies.
You can specify another file in a URL parameter `cluefile=` (name to change).

In the prompt file, Long words can be marked for hyphenation using [soft hyphens](https://en.wikipedia.org/wiki/Soft_hyphen)
`\U00AD`. This will cause the word to break when needed on small screens.

## Credits

Thanks to people who have contributed to the [film-tropes](www/film-tropes.json): Mary Stockert, Rebecca Putman, Walter Francis


# Bingo Card

A bingo game made for use while watching schmaltzy Christmas movies.
It is easily extended to other domains by adding new prompts.

## Quickstart

### Test locally

* Clone the repo and install it.

```sh
git clone git@github.com:HaroldPutman/bingo-cards.git
npm install
```

* Start the local server with `npm start`.
* Visit [localhost:3000](http://localhost:3000).

### Setting up CircleCI

I am using [CircleCI](https://circleci.com/) to deploy to the web. When changes are
merged into master they will be automatically deployed.

The [current configuration](.circleci/config.yml) is set up to deploy to Google Cloud
Storage. There are some environment variables that must be set in your Circle CI
environment:

* `GCLOUD_SERVICE_KEY` Create a service user in GCP Console and set the key here. It's JSON data.
* `GOOGLE_COMPUTE_ZONE` The Google Compute zone (us-east1)
* `GOOGLE_PROJECT_ID` The Project ID.

## Prompts

You can create your own prompts in a JSON file. The default is [film-tropes](www/film-tropes.json).
This is designed for use while viewing shmaltzy Christmas movies.
You can specify another file in a URL parameter `cluefile=` (name to change).

In the prompt file, Long words can be marked for hyphenation using [soft hyphens](https://en.wikipedia.org/wiki/Soft_hyphen)
`\U00AD`. This will cause the word to break when needed on small screens.

## Credits

Thanks to people who have contributed to the [film-tropes](www/film-tropes.json):
Mary Stockert, Rebecca Putman, Walter Francis. Thanks also to Cary Hazelwood who
helped with Sass/CSS and other good ideas.

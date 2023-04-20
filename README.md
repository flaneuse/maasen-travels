# maasen-travels
 Maps of where the Maasen family have been in the United States

# Local development
1. Create a Google API key.
2. Export the API key from terminal:
  `export VUE_APP_GOOGLESHEETS_API_KEY=<insert Google Sheets API key here>`
3. Change the `index.js` google sheet id and adjust the color encoding values if needed. Google Sheet should have its settings set to "Anyone with link can view."
4. Run `npm run serve` to spin up a local version.


# Deploying through GitHub
* Add `VUE_APP_GOOGLESHEETS_API_KEY` as a secret key.
* Create a gh-pages branch
* Point branch in GitHub Pages build and deploy to point to `gh-pages` branch and `/docs` folder.
* With [deploy-app.yml](https://github.com/flaneuse/maasen-travels/blob/main/.github/workflows/deploy-app.yml), on commit to the main branch, the site will be built and saved within the docs folder for rendering.

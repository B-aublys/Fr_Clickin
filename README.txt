This project was build using webpack.
Install it with npm:
    npm install webpack webpack-cli

afterwards just run "npx webpack" in the dir where the webpack.config.js is located
and it should bundle the js scripts into the dist folder.
All the html and the manifest (which is located in ./bin) will link to the bundled js.

here is the versions I used to compile it
"dependencies": {
    "webpack": "^4.41.2"
  },
  "devDependencies": {
    "webpack-cli": "^3.3.10"

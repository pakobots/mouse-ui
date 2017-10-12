# Pako Bots UI (web and phone)

![OSI Certified](http://www.samurajdata.se/opensource/mirror/trademarks/osi-certified/web/osi-certified-90x75.png)
This software is OSI Certified Open Source Software.
OSI Certified is a certification mark of the Open Source Initiative.

## Getting started

Before you start, make sure you have a recent version of [NodeJS](http://nodejs.org/) environment *>=6.0* with NPM 3 or Yarn. If building for the phone, please ensure the latest version of the [Cordova](https://cordova.apache.org/#getstarted) installed.

## Building the web application
From the project folder, execute the following commands:

```shell
npm install # or: yarn install
```

This will install all required dependencies, including a local version of Webpack that is going to
build and bundle the app. There is no need to install Webpack globally.

To run the app execute the following command:

```shell
npm serve # or: yarn serve
```

This command starts the webpack development server that serves the build bundles.
You can now browse the skeleton app at http://localhost:8080 (or the next available port, notice the output of the command). Changes in the code
will automatically build and reload the app.

### Running with Hot Module Reload

If you wish to try out the experimental Hot Module Reload, you may run your application with the following command:

```shell
npm start -- webpack.server.hmr
```

### Bundling

To build an optimized, minified production bundle (output to /dist) execute:

```shell
npm run prod
```

## Building the phone application
Before building the phone application ensure the web application is built first.
From the project folder, execute the following commands:

```shell
cordova build
```

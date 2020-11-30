# Salesforce Canvas app with Angular 11 (SSR + Material)

This is an example app to demonstrate Salesforce Canvas app with Angular 11 using Signed Request flow (and OAuth flow - WIP⚠)
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.2.

## Development server

To run development server for the app, you may run the app in two modes depending on the authentication flow you are using.
1. Signed Request flow  - A signed request is sent to the server of the Canvas app using POST method. Use SSR (Server side rendered app).
2. OAuth - In the [OAuth flow](https://developer.salesforce.com/docs/atlas.en-us.platform_connect.meta/platform_connect/user_flow_oauth.htm), you may be able to run CSR (Client side rendered) app.

### SSR (Server side rendererd)

Run `npm run dev:ssr` for a dev server that is server side rendered. Navigate to `http://localhost:3000/`. The app will autmatically reload if you change any of the source files

### CSR (Client side rendered)

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Express.js Server

A very basic implementation of an Express.js server is located at [./express.ts](./express.ts) which consists of:
1. Logic to enable SSR in the Angular app
2. Logic to verify the Signed Request by Salesforce to the canvas app.

**Bonus:** This express.js server could also be extended to have APIs and fully functional backend server if required. 😊

## Signed Request flow

The signed request flow has been implemented with basic functionality on an express.js based server [./express.ts](./express.ts)

## OAuth flow

The OAuth functionality can be implemented using Any Salesforce Javascript SDK on the Angular app. I have planned to implement one just to demonstrate this usecase.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

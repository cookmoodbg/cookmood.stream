[![Netlify Status](https://api.netlify.com/api/v1/badges/5ce6eccf-df68-41d7-864b-380528adda72/deploy-status)](https://app.netlify.com/sites/cookmood/deploys)
# cookmood.stream

This repository contains all the code and data required to generate the cookmood.stream personal blog.

The project consists of pre-generated front end, built with Hugo static site generator and js-based backend, that consists of Netlify (Amazon) lambda functions.

How to run:

1. For FE development, it is enough to run:
```
hugo
```
to build or for local serve of content:
```
hugo server
```
2. To build BE functions:
```
npm install
npm run build:functions
```
3. To run, test all locally:
```
npm install netlify-cli -g
netlify link
netlify env:set <ENV_NAME> <VALUE>
netlify dev
netlify functions:invoke
```
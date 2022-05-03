[![Netlify Status](https://api.netlify.com/api/v1/badges/5ce6eccf-df68-41d7-864b-380528adda72/deploy-status)](https://app.netlify.com/sites/cookmood/deploys)
# cookmood.stream

This repository contains all the code and data required to generate the cookmood.stream personal blog.

The project consists of pre-generated front end, built with Hugo static site generator and js-based backend, that consists of Netlify (Amazon) lambda functions. The FE uses the Tachyons CSS Toolkit library for all CSS related stuff.

Used versions of software:
1. Tachyons CSS Toolkit - 4.12.0
2. Hugo static site generator -  0.93.0

Required environment variables for netlify functions:
1. CONTACT_EMAIL - {secret}
2. SMTP_HOST - {secret}
3. SMTP_PASS - {secret}
4. SMTP_USER - {secret}

Required environment variables for hugo SSG:
1. HUGO_ENV - {production}
2. HUGO_VERSION - {0.93.0}

How to run:

1. For FE development, it is enough to run:
```shell
hugo
```
to build or for local serve of content:
```shell
hugo server
```
2. To build BE functions:
```shell
npm install
npm run build:functions
```
3. To run, test all locally:
```shell
npm install netlify-cli -g
netlify link
netlify env:set <ENV_NAME> <VALUE>
netlify dev
netlify functions:invoke
```
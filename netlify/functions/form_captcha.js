"use strict";

const captchaJs = require("captcha-genjs");

exports.handler = async (event, context) => {
  const envParamsValidationStatus = validateEnvParams();
  if (envParamsValidationStatus.length > 0) {
    return {
      statusCode: 500,
      body: envParamsValidationStatus.toString() + " must be defined",
    };
  }

  const captcha = captchaJs.create(process.env.CAPTCHA_SECRET);

  const alphabet = {
    alphabet: "123456789",
    len: 6,
  };

  captcha.createCanvas(150, 50, alphabet);
  const captchaResult = captcha.generate();

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: captchaResult.url,
      hash: captchaResult.hash,
    }),
  };
};

function validateEnvParams() {
  const missingEnvParams = [];
  if (!process.env.CAPTCHA_SECRET) {
    missingEnvParams.push("CAPTCHA_SECRET");
  }
  return missingEnvParams;
}

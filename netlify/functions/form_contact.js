"use strict";

const nodemailer = require("nodemailer");

exports.handler = async (event, context) => {
  const envParamsValidationStatus = validateEnvParams();
  if (envParamsValidationStatus.length > 0) {
    return {
      statusCode: 500,
      body: envParamsValidationStatus.toString() + " must be defined",
    };
  }

  const fields = JSON.parse(event.body);

  const userParamsValidationStatus = validateUserParams(fields);
  if (Object.keys(userParamsValidationStatus).length > 0) {
    return {
      statusCode: 400,
      body: JSON.stringify(userParamsValidationStatus),
    };
  }

  var transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 2525,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailDescriptor = {
    from: fields.email,
    to: process.env.CONTACT_EMAIL,
    subject: fields.name + " sent you a message from cookmood.stream",
    text: fields.message,
  };

  const startTimeSeconds = new Date().getTime() / 1000.0;
  let success, error;
  do {
    try {
      success = await transporter.sendMail(mailDescriptor);
      break;
    } catch (e) {
      error = e;
    }
  } while (new Date().getTime() / 1000.0 - startTimeSeconds <= 5);

  if (success) {
    return {
      statusCode: 200,
    };
  }
  if (error) {
    return {
      statusCode: 500,
      body: error.name + error.message,
    };
  }
};

function validateEnvParams() {
  const missingEnvParams = [];
  if (!process.env.CONTACT_EMAIL) {
    missingEnvParams.push("CONTACT_EMAIL");
  }
  if (!process.env.SMTP_HOST) {
    missingEnvParams.push("SMTP_HOST");
  }
  if (!process.env.SMTP_USER) {
    missingEnvParams.push("SMTP_USER");
  }
  if (!process.env.SMTP_PASS) {
    missingEnvParams.push("SMTP_PASS");
  }
  if (!process.env.CAPTCHA_SECRET) {
    missingEnvParams.push("CAPTCHA_SECRET");
  }
  return missingEnvParams;
}

function validateUserParams(fields) {
  const badEnvParams = {};

  try {
    validateLength("name", fields.name, 1, 50);
  } catch (e) {
    badEnvParams["name"] = e.message;
  }

  try {
    validateEmail("email", fields.email);
  } catch (e) {
    badEnvParams["email"] = e.message;
  }

  try {
    validateLength("message", fields.message, 1, 1000);
  } catch (e) {
    badEnvParams["message"] = e.message;
  }

  try {
    validateLength("captcha_attempt", fields.captcha_attempt, 1, 1000);
  } catch (e) {
    badEnvParams["captcha_attempt"] = e.message;
  }

  try {
    validateLength("captcha_hash", fields.captcha_hash, 1, 1000);
  } catch (e) {
    badEnvParams["captcha_hash"] = e.message;
  }

  return badEnvParams;
}

function validateEmail(ctx, str) {
  if (typeof str !== "string" && !(str instanceof String)) {
    throw TypeError(`${ctx} must be a string`);
  }

  validateLength(ctx, str, 5, 30);

  if (!/^[\w.-]+@[\w.-]+\.\w+$/.test(str)) {
    throw TypeError(`${ctx} is not an email address`);
  }
}

function validateLength(ctx, str, ...args) {
  let min, max;

  if (args.length === 1) {
    min = 0;
    max = args[0];
  } else {
    min = args[0];
    max = args[1];
  }

  if (typeof str !== "string" && !(str instanceof String)) {
    throw TypeError(`${ctx} must be a string`);
  }

  if (str.length < min) {
    throw TypeError(`${ctx} must be at least ${min} chars long`);
  }

  if (str.length > max) {
    throw TypeError(`${ctx} must contain ${max} chars at most`);
  }
}

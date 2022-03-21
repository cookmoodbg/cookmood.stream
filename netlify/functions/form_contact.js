'use strict';

const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  const envParamsValidationStatus = validateEnvParams();
  if (envParamsValidationStatus.length > 0) {
    const error =
      new Error("Missing environment parameters", envParamsValidationStatus);
    return {
      statusCode: 500,
      body: error.toJson()
    };
  }

  let fields;
  try {
    fields = JSON.parse(event.body);
  } catch (e) {
    const error =
      new Error(e.name + ' : ' + e.message, []);
    return {
      statusCode: 400,
      body: error.toJson(),
    }
  }

  const userParamsValidationStatus = validateUserParams(fields);
  if (userParamsValidationStatus.length > 0) {
    const error =
      new Error("Bad user parameters", userParamsValidationStatus);
    return {
      statusCode: 400,
      body: error.toJson()
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
    subject: fields.name + ' sent you a message from cookmood.stream',
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
      body: 'OK'
    };
  }
  if (error) {
    const returnError =
      new Error(error.name + ' : ' + error.message, []);
    return {
      statusCode: 500,
      body: returnError.toJson(),
    };
  }
};

function validateEnvParams() {
  const missingEnvParams = [];
  const isMissingErrorMessage = 'missing field';
  if (!process.env.CONTACT_EMAIL) {
    missingEnvParams.push(new FieldError('CONTACT_EMAIL', isMissingErrorMessage));
  }
  if (!process.env.SMTP_HOST) {
    missingEnvParams.push(new FieldError('SMTP_HOST', isMissingErrorMessage));
  }
  if (!process.env.SMTP_USER) {
    missingEnvParams.push(new FieldError('SMTP_USER', isMissingErrorMessage));
  }
  if (!process.env.SMTP_PASS) {
    missingEnvParams.push(new FieldError('SMTP_PASS', isMissingErrorMessage));
  }
  return missingEnvParams;
}

function validateUserParams(fields) {
  const badEnvParams = [];

  try {
    validateLength('name', fields.name, 1, 50);
  } catch (e) {
    badEnvParams.push(new FieldError('name', e.message));
  }

  try {
    validateEmail('email', fields.email);
  } catch (e) {
    badEnvParams.push(new FieldError('email', e.message));
  }

  try {
    validateLength('message', fields.message, 1, 1000);
  } catch (e) {
    badEnvParams.push(new FieldError('message', e.message));
  }

  return badEnvParams;
}

function validateEmail(ctx, str) {
  if (typeof str !== 'string' && !(str instanceof String)) {
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

  if (typeof str !== 'string' && !(str instanceof String)) {
    throw TypeError(`${ctx} must be a string`);
  }

  if (str.length < min) {
    throw TypeError(`${ctx} must be at least ${min} chars long`);
  }

  if (str.length > max) {
    throw TypeError(`${ctx} must contain ${max} chars at most`);
  }
}

class FieldError {
  constructor(field, errorMessage) {
    this.field = field;
    this.errorMessage = errorMessage;
  }
}

class Error {
  constructor(message, fieldErrors) {
    this.message = message;
    this.fieldErrors = fieldErrors;
    this.toJson = function () {
      return JSON.stringify(this);
    };
  }
}
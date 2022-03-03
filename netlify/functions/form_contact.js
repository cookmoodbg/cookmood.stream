const sendMail = require('sendmail')
const busboy = require('busboy')

exports.handler = (event, context, callback) => {
  if (!process.env.CONTACT_EMAIL) {
    return callback(null, {
      statusCode: 500,
      body: 'process.env.CONTACT_EMAIL must be defined',
    })
  }

  const busboy = new Busboy({
    headers: event.headers
  });

  const fields = {};

  // whenever busboy comes across a normal field ...
  busboy.on("field", (fieldName, value) => {
    // ... we write its value into `fields`.
    fields[fieldName] = value;
  });

  // once busboy is finished, we resolve the promise with the resulted fields.
  busboy.on("finish", () => {
    resolve(fields)
  });

  // now that all handlers are set up, we can finally start processing our request!
  busboy.write(event.body);

  try {
    //validateLength('body.name', body.name, 3, 50)
  }
  catch (e) {
    return callback(null, {
      statusCode: 403,
      body: e.message
    })
  }

  try {
    //validateEmail('body.email', body.email)
  }
  catch (e) {
    return callback(null, {
      statusCode: 403,
      body: e.message
    })
  }

  try {
    //validateLength('body.message', body.message, 10, 1000)
  }
  catch (e) {
    return callback(null, {
      statusCode: 403,
      body: e.message
    })
  }

  const descriptor = {
    from: `"${fields.email}" <no-reply@cookmood.stream>`,
    to: process.env.CONTACT_EMAIL,
    subject: `${fields.name} sent you a message from cookmood.stream`,
    text: fields.message,
  }

  sendMail(descriptor, (e) => {
    if (e) {
      callback(null, {
        statusCode: 500,
        body: e.message
      })
    }
    else {
      callback(null, {
        statusCode: 200,
        body: '',
      })
    }
  })
}
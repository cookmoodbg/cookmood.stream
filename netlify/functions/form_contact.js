const sendMail = require('sendmail')()

exports.handler = (event, context, callback) => {
  if (!process.env.CONTACT_EMAIL) {
    return callback(null, {
      statusCode: 500,
      body: 'process.env.CONTACT_EMAIL must be defined',
    })
  }

  const body = JSON.parse(event.body)

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
    from: `"${body.email}" <no-reply@cookmood.stream>`,
    to: process.env.CONTACT_EMAIL,
    subject: `${body.name} sent you a message from cookmood.stream`,
    text: body.message,
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
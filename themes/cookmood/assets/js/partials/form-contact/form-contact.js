import * as params from '@params';

function isFormValid(data) {
  let isValid = true;
  for (let [key, value] of Object.entries(data)) {
    if (key === 'name' && value === '') {
      isValid = false;
    }
    if (key === 'email' && !/^[\w.-]+@[\w.-]+\.\w+$/.test(value)) {
      isValid = false;
    }
    if (key === 'message' && value === '') {
      isValid = false;
    }
    // add at least email validation at some time
  }
  return isValid;
}

function transformFormDataToData(form) { 
  const formData = new FormData(form);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
  return data;
}

function postForm(data) {
  fetch('/.netlify/functions/form_contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then((response) => {
    if (response.ok) {
      document.getElementById('form_status').innerHTML =
        params.formSentMessageOk;
    } else {
      throw new Error(response.status + ' : ' + response.statusText);
    }
  })
  .catch((error) => {
    document.getElementById('form_status').innerHTML =
      params.formSentMessageError;
    console.error(error);
  });
}

document.addEventListener('DOMContentLoaded', function () {

  const form = document.getElementById('contact_form');
  form.addEventListener('submit', function (event) {

    event.preventDefault();

    const data = transformFormDataToData(form);

    if(!isFormValid(data)) {
      document.getElementById('form_status').innerHTML = params.formValidationErrorMessage;
      return;
    }

    document.getElementById('form_status').innerHTML = params.formSendingMessage;
    postForm(data);
  });
});

import * as params from "@params";

function postForm(formData) {
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });

  fetch("/.netlify/functions/form_contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  .then((response) => {
    if (response.ok) {
      document.getElementById("form_status").innerHTML =
        params.formSentMessageOk;
    } else {
      throw new Error(response.status + ' : ' + response.statusText);
    }
  })
  .catch((error) => {
    document.getElementById("form_status").innerHTML =
      params.formSentMessageError;
    console.error(error);
  });
}

document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("contact_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    document.getElementById("form_status").innerHTML = params.formSendingMessage;
    const formData = new FormData(form);
    postForm(formData);
  });
});

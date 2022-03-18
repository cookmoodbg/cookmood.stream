import * as params from "@params";

function updateCaptcha() {
  fetch("/.netlify/functions/form_captcha", {
    method: "GET",
  })
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(response.status + ' : ' + response.statusText);
    }
  })
  .then((data) => {
    document
      .getElementById("captcha_image")
      .setAttribute("src", data.url);
    document
      .getElementById("captcha_hash")
      .setAttribute("value", data.hash);
  })
  .catch((error) => {
    console.error(error);
  });
}

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
  document
    .getElementById("captcha_image")
    .addEventListener("click", function () {
      updateCaptcha();
    });

  const form = document.getElementById("contact_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    document.getElementById("form_status").innerHTML = "";
    const formData = new FormData(form);
    postForm(formData);
  });
});

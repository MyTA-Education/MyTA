(function () {
  var form = document.getElementById("student-pilot-signup");

  if (!form) {
    return;
  }

  var submitButton = document.getElementById("signup-submit");
  var status = document.getElementById("signup-status");
  var email = document.getElementById("signup-email");
  var emailError = document.getElementById("signup-email-error");
  var formPanel = document.getElementById("signup-form-panel");
  var successPanel = document.getElementById("signup-success");
  var personalDomains = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "icloud.com",
    "proton.me",
    "protonmail.com",
    "aol.com"
  ];
  var submitting = false;

  var setStatus = function (message) {
    if (!status) {
      return;
    }

    status.textContent = message || "";
    status.hidden = !message;
  };

  var clearEmailError = function () {
    email.removeAttribute("aria-invalid");
    emailError.textContent = "";
    emailError.hidden = true;
  };

  var showEmailError = function (message) {
    email.setAttribute("aria-invalid", "true");
    emailError.textContent = message;
    emailError.hidden = false;
    email.focus();
  };

  var getEmailDomain = function () {
    var value = email.value.trim().toLowerCase();
    var atIndex = value.lastIndexOf("@");
    return atIndex === -1 ? "" : value.slice(atIndex + 1);
  };

  var isPersonalEmail = function () {
    return personalDomains.indexOf(getEmailDomain()) !== -1;
  };

  var setSubmitting = function (isSubmitting) {
    submitting = isSubmitting;
    submitButton.disabled = isSubmitting;
    submitButton.textContent = isSubmitting ? "Signing you up..." : "Sign me up";
  };

  var validateForm = function () {
    clearEmailError();
    setStatus("");

    var requiredFields = Array.from(form.querySelectorAll("[required]"));
    var firstMissing = requiredFields.find(function (field) {
      return !field.value.trim();
    });

    if (firstMissing) {
      setStatus("Please complete all three fields before submitting.");
      firstMissing.focus();
      return false;
    }

    if (!email.validity.valid) {
      showEmailError("Please enter a valid university email address.");
      return false;
    }

    if (isPersonalEmail()) {
      showEmailError("Please use your university email so we can match you with your course roster.");
      return false;
    }

    return true;
  };

  email.addEventListener("input", function () {
    clearEmailError();
    setStatus("");
  });

  form.addEventListener("input", function () {
    setStatus("");
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (submitting || !validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      var response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        formPanel.hidden = true;
        successPanel.hidden = false;
        successPanel.focus();
        return;
      }

      if (response.status === 429) {
        setStatus("We couldn't submit this yet. Please wait a moment and try again.");
      } else {
        setStatus("We couldn't submit your signup. Your information has not been sent yet. Please try again.");
      }
    } catch (error) {
      setStatus("We couldn't submit your signup. Your information has not been sent yet. Please try again.");
    } finally {
      if (!successPanel.hidden) {
        return;
      }

      setSubmitting(false);
    }
  });
})();

$(document).ready(function () {
  $("#btnSubmit").click(function () {
    $("#formAlert").addClass("d-none").text("");
    $("#copyStatus").text("");

    var givenName = String($("#given_name").val() ?? "").trim();
    var familyName = String($("#family_name").val() ?? "").trim();
    var email = String($("#email").val() ?? "").trim();

    if (!email || !email.includes("@")) {
      $("#formAlert").removeClass("d-none").text("Please enter a valid email address.");
      return;
    }

    $("#btnSubmit").prop("disabled", true).text("Generating…");
    $.ajax({
      type: "POST",
      url:
        window.location.protocol +
        "//" +
        window.location.host +
        "/api/createtoken",
      contentType: "application/json",
      data: JSON.stringify({
        given_name: givenName,
        family_name: familyName,
        email: email,
        // Let the server pick a default legacy subject; keep override available if needed.
      }),
    })
      .done(function (data) {
        $("#jsonToken").val(data);
        $("#btnExchange").prop("disabled", !data);
        $("#btnCopy").prop("disabled", !data);

        $("#auth0response").addClass("d-none");
        $("#responseHint").removeClass("d-none");
      })
      .fail(function (jqXHR) {
        const message =
          jqXHR?.responseJSON?.error ||
          jqXHR?.responseJSON?.message ||
          "Failed to generate token.";
        $("#formAlert").removeClass("d-none").text(message);
      })
      .always(function () {
        $("#btnSubmit").prop("disabled", false).text("Generate token");
      });
  });

  $("#btnClear").click(function () {
    $("#given_name").val("");
    $("#family_name").val("");
    $("#email").val("");
    $("#jsonToken").val("");
    $("#btnExchange").prop("disabled", true);
    $("#btnCopy").prop("disabled", true);
    $("#copyStatus").text("");
    $("#formAlert").addClass("d-none").text("");
  });

  $("#btnCopy").click(async function () {
    const token = String($("#jsonToken").val() ?? "");
    if (!token) return;
    try {
      await navigator.clipboard.writeText(token);
      $("#copyStatus").text("Copied.");
      setTimeout(() => $("#copyStatus").text(""), 1500);
    } catch (e) {
      $("#copyStatus").text("Copy failed (browser blocked clipboard).");
    }
  });

  $("#btnClearResponse").click(function () {
    $("#auth0json").text("");
    $("#auth0Alert").addClass("d-none").text("");
    $("#auth0response").addClass("d-none");
    $("#responseHint").removeClass("d-none");
  });

  $("#btnExchange").click(function () {
    var jsonToken = String($("#jsonToken").val() ?? "");
    if (!jsonToken) return;

    $("#auth0Alert").addClass("d-none").text("");
    $("#auth0json").text("");
    $("#auth0response").removeClass("d-none");
    $("#responseHint").addClass("d-none");

    $("#exchangeSpinner").removeClass("d-none");
    $("#btnExchange").prop("disabled", true);

    $.ajax({
      type: "POST",
      url:
        window.location.protocol +
        "//" +
        window.location.host +
        "/api/tokenexchange",
      contentType: "application/json",
      data: JSON.stringify({ jsonToken }),
    })
      .done(function (data) {
        $("#auth0json").text(JSON.stringify(data, null, 2));
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        const status = jqXHR?.status || 500;
        const err =
          jqXHR?.responseJSON?.error_description ||
          jqXHR?.responseJSON?.error ||
          errorThrown ||
          "Token exchange failed.";
        $("#auth0Alert")
          .removeClass("d-none")
          .text(`Error (${status}): ${err}`);
      })
      .always(function () {
        $("#exchangeSpinner").addClass("d-none");
        $("#btnExchange").prop("disabled", !$("#jsonToken").val());
      });
  });
});

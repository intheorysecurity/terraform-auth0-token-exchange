$(document).ready(function () {
  $("#btnSubmit").click(function () {
    // console.log("Button clicked");
    var givenName = $("#given_name").val();
    var familyName = $("#family_name").val();
    var email = $("#email").val();
    // console.log(email);
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
        sub: email
      }),
    }).done(function (data) {
      console.log(data);
      $("#jsonToken").text(data);
    });
  });

  $("#btnExchange").click(function () {
    var jsonToken = $("#jsonToken").text();
    $("#auth0response").empty();
    $("#auth0response").removeClass("d-none");
    $("#auth0response").append(
      '<h4 class="text-center">Minting Auth0 Token....</h4>'
    );
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
        $("#auth0response").empty();
        console.log(data);
        
        for (const key in data) {
          $("#auth0response").append("<h6>" + key + "</h6>");
          $("#auth0response").append("<code>" + data[key] + "</code>");
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
      });
  });
});

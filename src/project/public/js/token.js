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
        }),
      }).done(function (data) {
        console.log(data);
        $("#jsonToken").text(data);
      });
    });

    $("#btnExchange").click(function() {
        var jsonToken = $("#jsonToken").text();
        $.ajax({
            type: "POST",
            url: window.location.protocol + "//" + window.location.host + "/api/tokenexchange",
            contentType: "application/json",
            data: JSON.stringify({jsonToken}),
        }).done(function(data){
            console.log("Call Auth0 Token Exchange End Point")
            console.log(data);
        })
    })
})


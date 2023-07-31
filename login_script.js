$(document).ready(function() {
    $("form").submit(function(event) {
        event.preventDefault();
        $.ajax({
            type: "POST",
            url: "validate.php",
            data: $(this).serialize(),
            success: function(data) {
                if (data === "success") {
                    window.location.href = "home.html";
                } else {
                    alert("Invalid email or password.");
                }
            }
        });
    });
});
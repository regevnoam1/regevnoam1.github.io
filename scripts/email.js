document.addEventListener('DOMContentLoaded', function () {
    var checkbox = document.getElementById("email-checkbox");
    var email = document.getElementById("email");
    var emailDiv = document.getElementById("email-div");
    var mailtoButtons = document.querySelectorAll(".contact-button");
    mailtoButtons.forEach(function(button) {
        button.addEventListener("click", function () {
            // Define the email address and subject
            var emailAddress = "bytecodellm@cyberark.com";

            // Encode the email address and subject for the mailto link
            var mailtoLink = "mailto:" + encodeURIComponent(emailAddress);

            // Open the user's default email client with the mailto link
            window.location.href = mailtoLink;
        });
    });
    checkbox.addEventListener('change', function(){
        if(this.checked){
            email.disabled = true;
            emailDiv.style.borderColor = 'grey';
            email.placeholder = ""
        }
        
        else{
            email.disabled = false;
            emailDiv.style.borderColor = '#fff';
            email.placeholder = "Your Mail Address"
        }
    });
});


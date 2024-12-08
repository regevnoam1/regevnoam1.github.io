document.addEventListener('DOMContentLoaded', function () {
    const openPopupButton = document.getElementById("openPopup");
    const closePopupButton = document.getElementById("closePopup");
    const popupContainer = document.getElementById("popupContainer");
    const closeButton = document.getElementById("popup-footer-close-button");

    const openPopupButtonTwo = document.getElementById("openPopupTwo");

    openPopupButton.addEventListener("click", () => {
        popupContainer.style.display = "flex";
    });

    closePopupButton.addEventListener("click", () => {
        popupContainer.style.display = "none";
    });

    closeButton.addEventListener("click",  ()=>{
        popupContainer.style.display = "none";
    });


    
    openPopupButtonTwo.addEventListener("click", () => {
        popupContainer.style.display = "flex";
    });

});


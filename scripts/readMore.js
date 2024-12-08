document.addEventListener('DOMContentLoaded', function () {
    const showMoreBtn = document.getElementById("readMoreBtn")
    const textToShow = document.getElementById("moreText")
    showMoreBtn.addEventListener("click", () => {
        if (showMoreBtn.textContent == "Read More..."){
            textToShow.style.display  = "flex"
            textToShow.style.flexDirection = "column"
            showMoreBtn.textContent = "Show Less"
            textToShow.style.alignItems = "center"
            textToShow.style.alignSelf = "center"
            textToShow.style.textAlign = "center"
            textToShow.style.justifyContent = "center"


        }
        else{
            textToShow.style.display  = "None"
            showMoreBtn.textContent = "Read More..."
        }
    });
});


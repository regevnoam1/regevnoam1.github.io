document.addEventListener('DOMContentLoaded', function () {
    const dropArea = document.getElementById("decrypt-file");
    const fileInput = document.getElementById('fileInput');

    dropArea.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropArea.classList.add('dragover');
    });

    dropArea.addEventListener('dragleave', (event) => {
        dropArea.classList.remove('dragover');
    });

    dropArea.addEventListener('drop', (event) => {
        event.preventDefault();
        dropArea.classList.remove('dragover');

        const files = event.dataTransfer.files;
        handleFiles(files);
    });

    // Handle files from hidden input if JavaScript is disabled
    fileInput.addEventListener('change', (event) => {
        const files = event.target.files;
        handleFiles(files);
    });

    function handleFiles(files) {
        if (files.length > 0) {
            const fileName = files[0].name;
            document.getElementById('fileName').innerHTML = fileName;
            grecaptcha.render('html_element', {
                'sitekey': '6LfkC_onAAAAAGhriZHpRtLuBGz9qNzj91xu0Hbu',
                'callback': verifyCallback,
                'theme': 'clear'
            });
        } else {
            alert('No file selected');
        }
    }

    var verifyCallback = function (response) {
        const uploadFileBtn = document.getElementById('decryptFileBtn');
        uploadFileBtn.removeAttribute('disabled');
        captchaResponse = response
    };



});

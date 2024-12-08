let progress = 0;

document.addEventListener('DOMContentLoaded', function () {
    var captchaResponse;
    const fetchUrl = "https://zpa672z4r9.execute-api.us-east-1.amazonaws.com/test";

    const chooseFileBtn = document.getElementById('chooseFileBtn');
    const uploadFileBtn = document.getElementById('decryptFileBtn');
    const fileInput = document.getElementById('fileInput');
    const dropArea = document.getElementById("decrypt-file");
    const warning = document.getElementById("warning-file-size")
    var file = null


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

    chooseFileBtn.addEventListener('click', () => {
        fileInput.click();
    });

    function handleFiles(files) {
        if (files.length > 0) {
            file = files[0]
            if (file.size / (1024 * 1024) < 1){
                document.getElementById("warning-file-size").innerHTML = "Please note, this file is under 1MB and probably full encrypted, hence low chance for recovery.";
            }
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

    fileInput.addEventListener('change', function () {
        handleFiles(fileInput.files)
    });

    var verifyCallback = function (response) {
        const uploadFileBtn = document.getElementById('decryptFileBtn');
        uploadFileBtn.removeAttribute('disabled');
        captchaResponse = response
    };


    uploadFileBtn.addEventListener('click', () => {
        if (document.getElementById("email-checkbox").checked == false && document.getElementById("email").value == "") {
            alert('Email field is empty!');
            return;
        }
        if (file != null) {
            sendFile(file)
        }
    });

    function sendFile(input) {
        const seperatedFilesCheckBox = document.getElementById('seperatedFilesCheckBox');
        const seperatedFilesValue = seperatedFilesCheckBox.checked ? 'true' : 'false';
        const ransomNote = document.getElementById("ransom-note").value;
        const email = document.getElementById("email").value;
        const file = input;
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = function (e) {
            const base64Data = reader.result.split(',')[1];
            const decryptDiv = document.getElementById('decrypt-file');
            const progressBarDiv = document.getElementById("progress-container");

            const progressBar = document.getElementById("progress-bar");
            progressBarDiv.style.display = "inline";
            progressBar.style.width = "0";


            var childNodes = decryptDiv.getElementsByTagName('*');
            for (var node of childNodes) {
                node.disabled = true;
            }
            decryptDiv.style.filter = "blur(10px)";
            function updateProgressBar() {
                const progressBar = document.getElementById("progress-bar");
                if (progress <= 95) {
                    progressBar.style.width = progress + "%";
                    progress++;
                    setTimeout(updateProgressBar, 50);
                }
                else {
                    progress = 0;
                }
            }

            updateProgressBar();
            data = {
                'file': base64Data,
                'seperatedFiles': seperatedFilesValue,
                'captchaToken': captchaResponse,
                'fileName': file['name'],
                'email': email,
                'ransomNote': ransomNote
            }
            $.ajax({
                url: fetchUrl,
                type: 'POST',
                contentType: 'application/json',
                processData: false,
                data: JSON.stringify(data),
                xhrFields: {
                    withCredentials: false
                },
                success: function (response, textStatus, jqXHR) {
                    if (jqXHR.status == 200 && response['statusCode'] == 200) {
                        decryptDiv.style.filter = "blur(0px)";
                        for (var node of childNodes) {
                            node.disabled = false;
                        }
                        progressBar.style.width = "100%";
                        const contentDispositionHeader = jqXHR.getResponseHeader('Content-Disposition');
                        const fileExtention = response['fileExtention']
                        const serverFilename = extractFilenameFromHeader(contentDispositionHeader);
                        const base64EncodedContent = response['body']
                        const binaryData = atob(base64EncodedContent);
                        const dataArray = new Uint8Array(binaryData.length);
                        for (let i = 0; i < binaryData.length; i++) {
                            dataArray[i] = binaryData.charCodeAt(i);
                        }
                        const blob = new Blob([dataArray], { type: 'application/octet-stream' });
                        const blobUrl = URL.createObjectURL(blob);
                        const downloadLink = document.createElement('a');
                        downloadLink.href = blobUrl;
                        downloadLink.download = 'output.' + fileExtention;
                        downloadLink.click();
                        URL.revokeObjectURL(blobUrl);
                        progressBarDiv.style.display = "none";
                        grecaptcha.reset();
                        uploadFileBtn.disabled = true;
                    } else {
                        if (response['statusCode'] != null) {
                            alert(`Server responded with ${response['statusCode']}: ${response['Error']}`);
                        }
                        else {
                            alert(`Sorry, we were unable to recover information from your file.
Possible issues:
- The ransomware variant did not leverage partial encryption and/or was fully encrypted.
- The uploaded file wasn’t supported. (not docx, xlsx, pptx, pdf, or zip).
- Your file was larger than 10mb.
- Other
Please try again with another file, or contact us.`);
                        }
                        progressBarDiv.style.display = "none";

                        decryptDiv.style.filter = "blur(0px)";
                        for (var node of childNodes) {
                            node.disabled = false;
                        }
                        progressBar.style.width = "100%";
                        grecaptcha.reset();
                        uploadFileBtn.disabled = true;
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert(`Sorry, we were unable to recover information from your file.
Possible issues:
- The ransomware variant did not leverage partial encryption and/or was fully encrypted.
- The uploaded file wasn’t supported. (not docx, xlsx, pptx, pdf, or zip).
- Your file was larger than 10mb.
- Other
Please try again with another file, or contact us.`);
                    progressBarDiv.style.display = "none";

                    decryptDiv.style.filter = "blur(0px)";
                    for (var node of childNodes) {
                        node.disabled = false;
                    }
                    progressBar.style.width = "100%";
                    grecaptcha.reset();
                    uploadFileBtn.disabled = true;
                }
            });
        };


    }

    function extractFilenameFromHeader(header) {
        if (header) {
            const match = header.match(/filename=(.*?)(;|$)/);
            if (match && match[1]) {
                return match[1];
            }
        }
        return null;
    }
});





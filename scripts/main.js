//bind event to generate QR Code on pressing ENTER
$("#qrData").
    on("keydown", function (e) {
        if (e.keyCode == 13) {
            $('#qrCode').text('');
            $("#qrCode, .qr-actions *").hide();
            generateQRCode();
        }
    });

//bind event to generate QR Code on clicking "Generate QR Code" button
$("#generateQRCode").
    on("click", function (e) {
        $('#qrCode').text('');
        $("#qrCode, .qr-actions *").hide();
        generateQRCode();
    });

//generates QR Code if URL is valid
function generateQRCode () {      
    let elText = document.getElementById("qrData");

    if (!elText.value) {
        //show alert if input field is empty
        alert("Please enter URL.");
        elText.focus();
        return;
    } else {
        //validate URL
        let isURL = validateURL(elText.value);
        if(isURL) {

            //generate QR Code
            let qrcode = new QRCode("qrCode", {
                text: elText,
                width: 200,
                height: 200,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            });

            qrcode.makeCode(elText.value);

            setTimeout(function(){ $("#downloadQRImage").attr("href", typeof $("#qrCode img").attr("src") === "undefined" ? document.querySelector("#qrCode canvas").toDataURL() : $("#qrCode img").attr("src")).attr("download", "download.png"); }, 0);

            //show QR Code actions i.e., Download and Copy to Clipboard buttons 
            $("#qrCode, .qr-actions *").show();
        } else {
            //show alert if URL is invalid
            alert("Please enter a valid URL.");
            elText.focus();
            return;
        }
    }
}

//bind event to copy QR Code as Image on clicking "Generate QR Code" button
$("#copyQRImageToClipboard").
    on("click", function (e) {
        try {
            let pngImageBlob = dataURItoBlob(typeof $("#qrCode img").attr("src") === "undefined" ? document.querySelector("#qrCode canvas").toDataURL() : $("#qrCode img").attr("src"));
            navigator.clipboard.write([
                new ClipboardItem({
                    'image/png': pngImageBlob
                })
            ]).then(
                () => $('#qrCopyToast').toast('show')
            );
        } catch (error) {
            console.error(error);
        }
    });

function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    var ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], {type: mimeString});
    return blob;
}

function validateURL(url) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(url);
}
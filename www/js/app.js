(function() {
    var serverURL = "http://gulfdoctor.net/charm/phonegap_upload.php", // Upload Script on server
        $notification = $('#notification'),
        $tan = $('#tan'),

        // Get the computed ITA value from server
        getFeed = function(randomName) {
            var myData = "image="+ randomName; //post variables
            jQuery.ajax({
                type: "POST", // HTTP method POST or GET
                url: "http://gulfdoctor.net/charm/phonegap_analyse.php", //Where to make Ajax calls
                dataType: "text", // Data type, HTML, json etc.
                data: myData, //post variables
                success: function(response) {
                    window.sessionStorage.setItem("ita", response);
                    $notification.empty();
                    $notification.append('ITA: ');
                    $notification.append(response);
                },
                error: function(xhr, ajaxOptions, thrownError) {
                    alert(thrownError); //throw any errors
                }
            });
        },

        //Create a random file name for image upload
        makeid = function() {
            var text = "";
            var possible = "0123456789";
            for (var i = 0; i < 10; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
        },
        
        // Upload image to server
        upload = function(imageURI) {
            var randomName = makeid();
            var ft = new FileTransfer(),
            options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = randomName + '.jpg'; // The random filename assigned
            options.mimeType = "image/jpeg";
            options.chunkedMode = false;
            options.params = { // Whatever you populate options.params with, will be available in req.body at the server-side.
                "description": "Uploaded from my phone"
            };
            ft.upload(imageURI, serverURL, function(e) {
                getFeed(randomName);
            }, function(e) {
                alert("Upload failed");
            }, options);
        },

        // Exposed ButtonClick
        expClick = function() {
            var ita = window.sessionStorage.getItem("ita");
            var tan_value = 0;
            window.sessionStorage.setItem("exposed", ita);
            var exposed = window.sessionStorage.getItem("exposed");
            var unexposed = window.sessionStorage.getItem("unexposed");
            if(exposed>0 && unexposed>0){
                 tan_value = (Math.round(unexposed/exposed));
            }
            $tan.empty();
            $tan.append(' EXP: '+exposed+' UNEXP: '+unexposed+' TAN: '+tan_value);
        },

        //UnExposed Button Click
        unexpClick = function() {
            var ita = window.sessionStorage.getItem("ita");
            var tan_value = 0;
            window.sessionStorage.setItem("unexposed", ita);
            var exposed = window.sessionStorage.getItem("exposed");
            var unexposed = window.sessionStorage.getItem("unexposed");
            if(exposed>0 && unexposed>0){
                 tan_value = (Math.round(unexposed/exposed));
            }
            $tan.empty();
            $tan.append(' EXP: '+exposed+' UNEXP: '+unexposed+' TAN: '+tan_value);
        },

        // Take a picture using the camera or select one from the library
        takePicture = function(e) {
            var options = {
                quality: 95,
                targetWidth: 1000,
                targetHeight: 1000,
                destinationType: Camera.DestinationType.FILE_URI,
                encodingType: Camera.EncodingType.JPEG,
                sourceType: Camera.PictureSourceType.CAMERA
            };
            navigator.camera.getPicture(function(imageURI) {
                console.log(imageURI);
                upload(imageURI);
            }, function(message) {
                // We typically get here because the use canceled the photo operation. Fail silently.
            }, options);
            return false;
        };

    $('.camera-btn').on('click', takePicture);
    $('#unexposed').on('click', unexpClick);
    $('#exposed').on('click', expClick);
 
}());
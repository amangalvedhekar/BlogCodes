$(document).ready(function() {
      $('[data-toggle="tooltip"]').tooltip({
          html: true
      }); 
     $('#imagesUploadForm').submit( function (evt) {
        evt.preventDefault();
    });
    $('#edit').click(function() {
        console.log('click detected inside circl-o of edit');
        $('#edit').toggleClass('fa-circle-o').toggleClass('fa-check-circle');
        if($('#edit').hasClass('fa-check-circle')) {
            $('#captionForImage').toggleClass('hide-element');                    
        } else {
            $('#captionForImage').toggleClass('hide-element');
        }
    });
    $('#delete').click(function() {
        console.log('click detected inside circl-o of delete');
        $('#delete').toggleClass('fa-circle-o').toggleClass('fa-times-circle');        
    });
     //namespace variable to determine whether to continue or not
    var proceed = false;
    //Ensure that FILE API is supported by the browser to proceed
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        if(window.webkitURL || window.URL ){
        $('#errorMessaage').removeClass('hide-element').addClass(
                'alert-success').html('<span class="glyphicon glyphicon-ok"></span>\n\
            <span class="sr-only">Success:</span>Great your browser is compatiblle for Files API. \n\
Enjoy the demo');
        proceed = true;
    } else {
         $('#errorMessaage').removeClass('hide-element').addClass(
                'alert-warning').html('<span class="glyphicon glyphicon-exclamation-sign"></span>\n\
            <span class="sr-only">Warning:</span>The browser does not support few APIs used in this demo.\n\
But we will be back with a solution.');
    }
        
} else {
        $('#errorMessaage').removeClass('hide-element').addClass(
                'alert-warning').html('<span class="glyphicon glyphicon-exclamation-sign"></span>\n\
            <span class="sr-only">Warning:</span>Snap looks like you still live in stone age. \n\
Wake up..Time to update the browser');
}
if(proceed)
{
    $('input[type=file]').on("change", function(e) { 
        var counter = 0;
        var input = this.files;
        $('#previewImages').removeClass('hide-element');                    
        $('#imagesUpload').removeClass('disabled');
        var successUpload = 0;
        var failedUpload = 0;
        var size = input.length;
        $(input).each(function () {
            var reader = new FileReader();
            var uploadImage = this;
            console.log(this);
            reader.readAsArrayBuffer(this);            
            reader.onload = function (e) { 
                var magicNumbers = validateImage.magicNumbersForExtension(e);
                var fileSize = validateImage.isUploadedFileSizeValid(uploadImage);
                var extension = validateImage.uploadFileExtension(uploadImage);
                var isValidImage = validateImage.validateExtensionToMagicNumbers(magicNumbers);
                var thumbnail = validateImage.generateThumbnail(uploadImage);                
                console.log(magicNumbers+" filesize: "+fileSize+" extension"+extension+"magic number validation: "+isValidImage);                
                if(fileSize && isValidImage) {                    
                    $('#'+counter).attr('src',thumbnail).height('200');
                    $('#preview'+counter).attr('src',imageSrc);
                    $('#uploadDataInfo').removeClass('hide-element').addClass('alert-success');
                    successUpload++;
                    console.log(size);
                }else {
                    $('#uploadDataInfo').removeClass('hide-element alert-success').addClass('alert-warning');
                    $('#'+counter).parents('.media').addClass('hide-element');
                    failedUpload++;
                }
                counter++;
                if(counter === size) {                    
                    $('#filesCount').html(successUpload+ " files are ready to upload");                    
                    $('#filesUnsupported').html(failedUpload+" files were not selected for upload");                    
                }
            };          
        });
    
        
    }); 
    $(document).on('click','.glyphicon-remove-circle', function() {
        $('#file-error-message').addClass('hide-element');
    });
    var validateImage = {
        magicNumbersForExtension : function(event) {
            var headerArray = (new Uint8Array(event.target.result)).subarray(0,4);
            var magicNumber = "";
             for(var counter=0;counter < headerArray.length ; counter++)
          {
              magicNumber += headerArray[counter].toString(16);
          }
            return magicNumber;
        },
        isUploadedFileSizeValid : function(fileUploaded) {
            var fileSize =  fileUploaded.size;
            var maximumSize = 2097125;
            var isValid = "";
            if(fileSize <= maximumSize) {
                isValid = true;
            }else {
                isValid = false;
            }
            return isValid;
        },
        uploadFileExtension : function(fileUploaded) {
            var fileExtension="";
            var imageType ="";
            imageType = fileUploaded.type.toLowerCase();
            fileExtension = imageType.substr((imageType.lastIndexOf('/') + 1));
            return fileExtension;
        },
        validateExtensionToMagicNumbers : function(magicNumbers) {
            var properExtension = "";
            if(magicNumbers.toLowerCase()==="ffd8ffe0" || magicNumbers.toLowerCase()==="ffd8ffe1" ||
                 magicNumbers.toLowerCase()==="ffd8ffe8" ||
                 magicNumbers.toLocaleLowerCase()==="89504e47") {
             properExtension = true;
             
            } else {
                properExtension = false;
            }
            return properExtension;
        },
        generateThumbnail : function(uploadImage) {
            if(window.URL)
                imageSrc = window.URL.createObjectURL(uploadImage);
            else 
                imageSrc = window.webkitURL.createObjectURL(uploadImage);
            return imageSrc;
        }
    };
}
});
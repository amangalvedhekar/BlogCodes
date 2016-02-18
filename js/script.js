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
        $('#previewImages').toggleClass('hide-element');
        for(var counter=0;counter<this.files.length;counter++) {
            var imageFile = this.files[counter];
            var thumbnail = window.URL.createObjectURL(imageFile);
            $('#'+counter).attr('src',thumbnail).height('200').width('200');
            $('#preview'+counter).attr('src',thumbnail);
        }
        var uploadFile = this.files[0];
        var uploadFilesCount = this.files.length;
        if(uploadFilesCount >4) {
           $('#toManyFilesUploaded').html("Only 4 files displayed below will be uploaded");
        }
        var successFiles = 0;
        var unsuccessFiles = 0;
        $('#filesCount').html(uploadFilesCount + " files selected");
        var readerObject = new FileReader();
        /*var imageObject = new Image();*/
      
        readerObject.onload = function(e) {
           /*this code was taken from stack overflow
             *http://stackoverflow.com/questions/18299806/how-to-check-file-mime-type-with-javascript-before-upload
            */ 
          var headerArray = (new Uint8Array(e.target.result)).subarray(0,4);
          $('#uploadDataInfo').toggleClass('hide-element');
          var magicNumbers = "";
          var fileExtension="";
          var imageSrc ="";
          var fileSize = uploadFile.size;
          var maximumSize = 2097152;
          for(var counter=0;counter < headerArray.length ; counter++)
          {
              magicNumbers += headerArray[counter].toString(16);
          }
          var imageType ="";
          imageType = uploadFile.type.toLowerCase();
        fileExtension = imageType.substr((imageType.lastIndexOf('/') + 1));
        console.log (magicNumbers);
        if(fileSize <= maximumSize) {
             if(magicNumbers.toLowerCase()==="ffd8ffe0" || magicNumbers.toLowerCase()==="ffd8ffe1" ||
                     magicNumbers.toLowerCase()==="ffd8ffe8" ||
                     magicNumbers.toLocaleLowerCase()==="89504e47") {
                 //file uploaded was in proper format and proper size
                        if(window.URL)
                            imageSrc = window.URL.createObjectURL(uploadFile);
                        else 
                            imageSrc = window.webkitURL.createObjectURL(uploadFile);
                $('#previewImage').closest('.media').removeClass('hide-element');
                 $('#previewImage').attr('src',imageSrc ).height('200').width('200');
                 $('#previewImage').attr('title',"File Size: "+ fileSize );
                 $('#file-error-message').addClass('hide-element');
                 $('#imagesUpload').removeClass('disabled');
                 successFiles++;
                 $('#filesSupported').html(successFiles + " file ready to upload");
        }
        else {
                 $('#previewImage').closest('.media').addClass('hide-element');
                 $('#previewImage').attr('src','');
                  $('#errorMessaage').addClass('hide-element');
                 $('#file-error-message').removeClass('hide-element').addClass('alert-danger').find('p').html('<span class="glyphicon glyphicon-exclamation-sign"></span>\n\
            <span class="sr-only">Warning:</span>The file uploaded is of not proper format. You file uploaded\n\
            has <strong>'+fileExtension+'</strong> which is not acceptible or has been tampered.File formts accepted are:\n\
<ol><li>jpg/jpeg</li><li>png</li></ol>');
                    unsuccessFiles++;
                    $('#filesUnsupported').html(unsuccessFiles + ' file will be ommited');
        }
        }
        else {
            unsuccessFiles++;
            $('#filesUnsupported').html(unsuccessFiles + ' file will be ommited');
             $('#previewImage').closest('.media').addClass('hide-element');
                 $('#previewImage').attr('src','');
                  $('#errorMessaage').addClass('hide-element');
                 $('#file-error-message').removeClass('hide-element').addClass('alert-danger').find('p').html('<span class="glyphicon glyphicon-exclamation-sign"></span>\n\
            <span class="sr-only">Warning:</span>The file uploaded is bigger than allowed file size.File uploaded has size of '
                        +~~(fileSize/1024)+' KB');
        }
       
        };
         readerObject.readAsArrayBuffer(uploadFile);                  
    }); 
    $(document).on('click','.glyphicon-remove-circle', function() {
        $('#file-error-message').addClass('hide-element');
    });
}
});
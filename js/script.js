$(document).ready(function() {
      $('[data-toggle="tooltip"]').tooltip({
          html: true
      });       
      $('.media').addClass('hide-element');
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
    var input = "";
    var formData = new FormData();
    $('input[type=file]').on("change", function(e) { 
        var counter = 0;
        var modalPreviewItems = "";      
        input = this.files;     
        $($(this)[0].files).each(function(i, file) {
            formData.append('file-'+i, file);
        });
        $('#previewImages').removeClass('hide-element');                    
        $('#imagesUpload').removeClass('disabled');
        var successUpload = 0;
        var failedUpload = 0;
        var extraFiles = 0;
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
                if(fileSize && isValidImage) {    
                    $('#'+counter).parents('.media').removeClass('hide-element');
                    $('#'+counter).attr('src',thumbnail).height('200');                    
                    $('#uploadDataInfo').removeClass('hide-element').addClass('alert-success');
                    successUpload++;
                    modalPreviewItems += carouselInsideModal.createItemsForSlider(thumbnail,counter);
                    
                }else {
                    $('#uploadDataInfo').removeClass('hide-element alert-success').addClass('alert-warning');                    
                    failedUpload++;
                }
                counter++;
                if(counter === size) {                       
                    $('#myCarousel').append(carouselInsideModal.createIndicators(successUpload,"myCarousel"));
                    $('#previewItems').append(modalPreviewItems);
                    $('#previewItems .item').first().addClass('active');
                    $('#carouselIndicators > li').first().addClass('active');
                    $('#myCarousel').carousel({
                            interval: 2000,
                            cycle: true
                    });
                    if(size > 4) {
                        $('#toManyFilesUploaded').html("Only files displayed below will be uploaded");
                        extraFiles = size-4;
                    }
                        
                    $('#filesCount').html(successUpload+ " files are ready to upload");
                    if(failedUpload !== 0 || extraFiles!==0) {
                        failedUpload === 0 ? "" : failedUpload;
                        extraFiles === 0 ? "" : extraFiles;
                        $('#filesUnsupported').html(failedUpload+extraFiles+" files were not selected for upload");                    
                    }
                        
                }
            };          
        });
    
        
    }); 
    $(document).on('click','.glyphicon-remove-circle', function() {
        $('#file-error-message').addClass('hide-element');
    });    
    var toBeDeleted =[];
    var eachImageValues = [];     
    $('.media').each(function(index) {        
        var imagePresent = "";             
        $("body").on("click","#delete"+index, function() {            
           imagePresent = $("#"+index).attr('src');
           $("#undo"+index).removeClass('hide-element');
           $("#"+index).attr('src','./img/200x200.gif');
           $("#delete"+index).addClass('hide-element');
           toBeDeleted.push(index);
           //console.log(toBeDeleted);                      
           $("#delete"+index).parent().find('input[type="text"]').each(function() {
               var attribute = $(this).attr('name');
               var attributeValue = $(this).val();
               eachImageValues[attribute+index] =  attributeValue;             
               //console.log(eachImageValues);
         
           });
                   //console.log(toBeDeleted.length);
        if(toBeDeleted.length === 4) {
            $('#sendImagesToServer').prop('disabled',true).html('No Files to Upload');
            
        }else {
            $('#sendImagesToServer').prop('disabled',false).html('Update &amp; Preview');
        }
           
           $("#delete"+index).parent().find('input[type="text"]').prop('disabled',true).addClass('disabled');           
        });
        $("body").on("click","#undo"+index, function() {
            $("#"+index).attr('src',imagePresent);
            $("#undo"+index).addClass('hide-element');
            $("#delete"+index).removeClass('hide-element');
            var indexToDelete = toBeDeleted.indexOf(index);
            if(indexToDelete > -1) {
                toBeDeleted.splice(indexToDelete,1);
               // console.log(toBeDeleted);
                $("#delete"+index).parent().find('input[type="text"]').prop('disabled',false).removeClass('disabled');           
            }
            if(toBeDeleted.length === 4) {
            $('#sendImagesToServer').prop('disabled',true).html('No Files to Upload');
            
        }else {
            $('#sendImagesToServer').prop('disabled',false).html('Update &amp; Preview');
        }
        });
    });
    $('body').on("click","#sendImagesToServer",function() { 
        //alert('click');
        //var imageData = new Object();
        //console.log(eachImageValues);
        /*var imageData = new imageInformation('desc', 'cap', 'tags', true);
        var imageData2 = new imageInformation('desc1', 'cap1', 'tags1', true);
        var arrayList =[];
        arrayList.push(imageData);
        arrayList.push(imageData2);
        console.log(JSON.stringify(arrayList));*/
        /*
         * custom event for ajax calls code taken from below link:
         * http://stackoverflow.com/questions/166221/how-can-i-upload-files-asynchronously
         * $(':button').click(function(){
    var formData = new FormData($('form')[0]);
    $.ajax({
        url: 'upload.php',  //Server script to process data
        type: 'POST',
        xhr: function() {  // Custom XMLHttpRequest
            var myXhr = $.ajaxSettings.xhr();
            if(myXhr.upload){ // Check if upload property exists
                myXhr.upload.addEventListener('progress',progressHandlingFunction, false); // For handling the progress of the upload
            }
            return myXhr;
        },
        //Ajax events
        beforeSend: beforeSendHandler,
        success: completeHandler,
        error: errorHandler,
        // Form data
        data: formData,
        //Options to tell jQuery not to process data or worry about content-type.
        cache: false,
        contentType: false,
        processData: false
    });
});
        function progressHandlingFunction(e){
    if(e.lengthComputable){
        $('progress').attr({value:e.loaded,max:e.total});
    }
}
         */
        $.ajax({
            type: 'POST',
            url: 'upload.php',
            xhr: function() {
              var customXhr = $.ajaxSettings.xhr();
              if(customXhr.upload) {
                  customXhr.upload.addEventListener('progress',progressHandlingFunction, false); // For handling the progress of the upload
              }
              return customXhr;
            },
            data: formData,
            dataType: 'json',
            cache: false,
            contentType: false,
            processData: false,
            success: function(data) {     
                $('#ajaxLoad').addClass('hide-element');
                $('#successResponse').html(data.message);
                console.log(data.message+" inside success function");
            },
            error: function(data) {
                $('#successResponse').html(data.responseJSON.message).addClass('label label-danger').css({'font-size': '18px'});
                console.log(data.responseJSON.message+" inside error function");
            }
        }       
        );

        function progressHandlingFunction(e) {
          if(e.lengthComputable) {
              $('#progressIndicator').css({'width':e.loaded});
          }  
        };
        var counter = 0;
        var imageData ="";
        var consolidatedData = [];
        $('.media').each(function() {
                var description = "";
                var caption = "";
                var tags = "";                                    
            $('.media').find('input[type="text"]').each(function(index) {                    
                if((index ===0 || index <= 11)&&counter<=11) {
                    counter++;
                    var attributeName = "";
                    var attributeValue = "";                
                    
                    attributeName = $(this).attr('name');
                    attributeValue = $(this).val();
                    switch(attributeName) {
                        case "description" : 
                            description = attributeValue;
                           // console.log(description);
                            break;
                        case "caption" :
                            caption = attributeValue;
                           // console.log(caption);
                            break;
                        case "tags" : 
                            tags = attributeValue;
                           // console.log(tags);
                            break;
                        default :
                            break;
                    }
                    if(counter%3 === 0){                       
                        imageData = new imageInformation(description,caption,tags);
                        consolidatedData.push(imageData);
                        //JSON.stringify(consolidatedData);                        
                        //console.log(toBeDeleted);
                    }                                       
                }                
            });
        });
        imageData = new deleteList(toBeDeleted);
        consolidatedData.push(imageData);
        //
        //console.log(JSON.stringify(consolidatedData));
    });
    function imageInformation(description, caption, tags) {
        this.description = description;
        this.caption =caption;
        this.tags = tags;        
    };
    function deleteList(toBeDeleted) {
        this.toBeDeleted = toBeDeleted;
    };
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
    var carouselInsideModal = {
      createIndicators : function(carouselLength,dataTarget) {
          var carouselIndicators = '<ol class = "carousel-indicators" id="carouselIndicators">';
          for(var counter = 0; counter <carouselLength; counter++) {
              carouselIndicators += '<li data-target = "#'+dataTarget+'"data-slide-to="'+counter+'"></li>';
          }
          carouselIndicators += "</ol>";
          return carouselIndicators;
      },
      createItemsForSlider : function(imgSrc,counter) {          
          var item = '<div class = "item">'+'<img src="'+imgSrc+'" id="preview'+counter +'" /></div>';
          return item;
      }
    };
}
});
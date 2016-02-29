<?php
$target_dir = dirname( __FILE__ ) . DIRECTORY_SEPARATOR."uploads" ;
$target_file = $target_dir .DIRECTORY_SEPARATOR. $_FILES["file-0"]["name"];
$uploadOk = 1;
$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
// Check if image file is a actual image or fake image
if(isset($_FILES["file-0"]["tmp_name"])) {
    $check = getimagesize($_FILES["file-0"]["tmp_name"]);
    if($check !== false) {
       // echo "File is an image - " . $check["mime"] . ".";
        $uploadOk = 1;
    } else {
        echo "File is not an image.";
        $uploadOk = 0;
    }
}
// Check if file already exists
if (file_exists($target_file)) {
    echo "Sorry, file already exists.";
    $uploadOk = 0;
}
// Check file size
if ($_FILES["file-0"]["size"] > 500000) {
     header('HTTP/1.1 500 Internal Server Error');
    die (json_encode(array('message'=>"The file ". basename( $_FILES["file-0"]["name"]). " has been not uploaded.")));
    //echo "Sorry, your file is too large.";
    $uploadOk = 0;
}
// Allow certain file formats
if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
&& $imageFileType != "gif" ) {
     header('HTTP/1.1 500 Internal Server Error');
    die (json_encode(array('message'=>"The file ". basename( $_FILES["file-0"]["name"]). " has been not uploaded.")));
    $uploadOk = 0;
}
// Check if $uploadOk is set to 0 by an error
if ($uploadOk == 0) {
    //echo "Sorry, your file was not uploaded.";
// if everything is ok, try to upload file
} else {
     header('Content-type: application/json');
    if(!file_exists($target_dir))
        mkdir($target_dir);
    if (move_uploaded_file($_FILES["file-0"]["tmp_name"], $target_file)) {
        echo json_encode(array('message'=>"The file ". basename( $_FILES["file-0"]["name"]). " has been uploaded."));
    } else {
        echo "Sorry, there was an error uploading your file.";
    }
}
?>
var http = require('http');
var fs = require('fs');

function UploadFile(request, response){
  response.writeHead(200);

  var destFile = fs.createWriteStream("dest.md");
  request.pipe(destFile);

  var fileSize = request.headers['content-length'];
  var uploadedBytes = 0;

  request.on('data', function(d){
    uploadedBytes += d.length;
    var p = (uploadedBytes/fileSize) * 100
    response.write("Uploading " + parseInt(p) + "%\n");
  });

  request.on('end', function(){
    response.end("File Upload Complete");
  });


}


function DownloadFile(request, response){
  var filestream = fs.createReadStream("dest.md")

  response.setHeader('Content-type', "application/octet-stream");
  response.setHeader('Content-disposition', 'attachment; filename=dest.md');
  filestream.pipe(response);

}

http.createServer(DownloadFile).listen(8080, function(){
    console.log("Server started");
});



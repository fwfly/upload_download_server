var http = require('http');
var fs = require('fs');
var express = require('express');
var app = express();
var router = express.Router()


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

router.use('/upload',UploadFile)
router.get('/download', DownloadFile);
router.get('/', function(req, res){
  console.log("Request from : " + req.socket.remoteAddress);
  res.send("Hello this is fwfly upload download server")
});

app.use('/', router);

app.listen(3000, function(){
  console.log('Server is listening port 3000')
});




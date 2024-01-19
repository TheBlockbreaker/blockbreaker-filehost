const express=require("express"),
      app=express(),
      ratelimit=require("express-rate-limit"),
      multer=require("multer"),
      fs=require("fs"),
      port=process.env.PORT

const limit=ratelimit({
  windowMs:300*1000,
  max: 7,
  message: "You've been ratelimited. The maximum amount of files per minute is 7. Please try again later."
})
const storage=multer.diskStorage({
    destination: function(req,f,cb){cb(null, "./files/uploads")},
    filename: function(req,f,cb){cb(null, f.originalname.substring(0, f.originalname.lastIndexOf('.'))+"_"+Date.now()+"."+f.originalname.split(".").pop())}
})
var send=multer({storage: storage,
                limits: {fileSize: 14680064} });

app.use("/webassets/",express.static("./files/site/assets"))
app.use("/file/raw",express.static("./files/uploads"))

app.use("/sendfile", limit);
app.engine('html', require('ejs').renderFile);

app.get("/", (req,res)=>{
	function getsize(){
		let total = 0;
		const files = fs.readdirSync(__dirname+'/files/uploads');
		for (const file of files) {
			const stat = fs.statSync(`${__dirname+'/files/uploads'}/${file}`);
			if (stat.isFile()) {
				total += stat.size;
			} else if (stat.isDirectory()) {
				total += getDirectorySize(`${__dirname+'/files/uploads'}/${file}`);
			}
		}
		return (total/(1024 * 1024)).toFixed(2);
	}
    res.render(__dirname+'/files/site/index.html',{fsize:getsize()})
})
app.get("/err", (req,res)=>{
  var e=req.query.info
  res.render(__dirname+'/files/site/error.html')
})
app.get("/file/:file",(req,res)=>{
  fn=req.params.file.substring(0,req.params.file.lastIndexOf("_"))+"."+req.params.file.substring(req.params.file.lastIndexOf(".")+1)
  fs.stat(__dirname+'/files/uploads/'+req.params.file,(err,stat)=>{
    if(err){
        res.status(404).send("<h1>404 Not Found.</h1> The file you're looking for doesn't exist.");
      }else{
        res.render(__dirname+'/files/site/file_preview.html',{filename:fn,ogfile:req.params.file,size:(stat.size/(1024 * 1024)).toFixed(2)})
    }
  })
})
app.get("/download/:file",(req,res)=>{
  fn=req.params.file.substring(0,req.params.file.lastIndexOf("_"))+"."+req.params.file.substring(req.params.file.lastIndexOf(".")+1)
  if(fs.existsSync(__dirname+'/files/uploads/'+req.params.file)) {
    res.download(__dirname+'/files/uploads/'+req.params.file,fn);
  } else {
    res.status(404).send("<h1>404 Not Found.</h1> The file you're looking for doesn't exist.");
  }
})
app.post("/sendfile", (req,res,next)=>{
    send.single('src')(req,res, function(err){if(err instanceof multer.MulterError){if(err.code === 'LIMIT_FILE_SIZE'){return res.status(400).send('The file you sent was too large. Please choose a smaller one')}}
  
    if(!req.file){return res.status(400).send('<h1>400 File Not Found</h1> You either didn\'t select a file, or it didn\'t go through.')}
    res.render(__dirname+'/files/site/uploaded.html',{filename:req.file.filename.substring(0,req.file.filename.lastIndexOf("_"))+"."+req.file.filename.substring(req.file.filename.lastIndexOf(".")+1),ogfile:req.file.filename})
})})


app.use(function(req, res, next) {
  res.status(404).send("<h1>404 Not Found.</h1> The file or page you're looking for doesn't exist.");
});

app.listen(port, ()=>{
    console.log("serving on port",port)
})
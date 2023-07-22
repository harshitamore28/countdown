var express = require('express');
var app = express();
var port = process.env.PORT || 4000;

app.listen(port,()=>{
    console.log(
      "Server started on port:" + port + ". Click on http://localhost:"+port
    );
})

//GIF from Images
const fs = require("fs");
const GIFEncoder = require("gifencoder");
const Canvas = require('canvas');
const moment = require('moment');

function startGIF(cb){
  const time = "2023-07-22T23:59";
  const name = "mytimer";
  const width = 100;
  const height = 50;
  const color = "#ffffff";
  const bg = "#03C04A";
  const encoder = new GIFEncoder(width, height);
  const canvas = new Canvas.Canvas(width, height);
  const ctx = canvas.getContext("2d");
  let target = moment(time);
  let current = moment();
  let difference = target.diff(current);
  let timeResult;
  if (difference <= 0) {
    timeResult = "Date has passed";
  } else {
    timeResult = moment.duration(difference);
  }
  console.log(difference);
  console.log(Math.ceil(difference/1000));
  let frames = Math.ceil(difference / 1000);
  let imageStream = encoder
    .createReadStream()
    .pipe(fs.createWriteStream("./output/result1.gif"));
  imageStream.on("finish", () => {
    typeof cb === "function" && cb();
  });
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  encoder.start();
    encoder.setRepeat(0);
    encoder.setDelay(1000);
    encoder.setQuality(10);
    if (typeof timeResult==='object'){
        for(let i=0;i<frames;i++){
            let days = Math.floor(timeResult.asDays());
            let hours = Math.floor(timeResult.asHours() - (days*24));
            let minutes = Math.floor(timeResult.asMinutes()-(days*24*60)-(hours*60));
            let seconds = Math.floor(timeResult.asSeconds()-(days*24*60*60)-(hours*60*60)-(minutes*60));

            days = (days.toString().length ==1)?'0'+days:days;
            hours = hours.toString().length == 1 ? "0" + hours : hours;
            minutes = minutes.toString().length == 1 ? "0" + minutes : minutes;
            seconds = seconds.toString().length == 1 ? "0" + seconds : seconds;

            let string = [days,'d',hours,'h',minutes,'m',seconds,'s'].join('');

            ctx.fillStyle = bg;
            ctx.fillRect(0,0,width,height);

            ctx.fillStyle = color;
            ctx.fillText(string, width/2, height/2);

            encoder.addFrame(ctx);

            timeResult.subtract(1,'seconds');
        }
    }else{
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = color;
        ctx.fillText(timeResult, width / 2, height / 2);

        encoder.addFrame(ctx);
    }
     encoder.finish();
}
app.get("/", (req, res) => {
startGIF(()=>{
    res.sendFile("output/result1.gif", { root: __dirname });
    console.log("In callback");
})
});


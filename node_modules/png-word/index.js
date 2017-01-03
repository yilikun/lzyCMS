var PNG = require("node-png").PNG,
fs = require("fs"),
EventEmitter= require("events").EventEmitter,
inherits = require("util").inherits;
var letters = require("./letters.js")

module.exports = PNGWord;
module.exports.GREEN = {
	pngPath:__dirname+"/green.png",
	charWidth:8,
	charHeight:18,
	repo: letters.repo,
	prefix: letters.opener,
	suffix: letters.closer
}
module.exports.RED = {
	pngPath:__dirname+"/red.png",
	charWidth:8,
	charHeight:18,
	repo: letters.repo,
	prefix: letters.opener,
	suffix: letters.closer
}
module.exports.GRAY = {
	pngPath:__dirname+"/gray.png",
	charWidth:8,
	charHeight:18,
	repo: letters.repo,
	prefix: letters.opener,
	suffix: letters.closer
}


function PNGWord(conf){

	if(!(this instanceof PNGWord)){
		return new PNGWord(conf);
	}

	EventEmitter.call(this);
	this.parsed = false;

	this.conf = conf || {
	pngPath:__dirname+"/nums.png",
	charWidth:20,
	charHeight:20,
	repo:"0123456789",
	prefix:"",
	suffix:""
	}

	var png = this.png = fs.createReadStream(this.conf.pngPath)
	.pipe(new PNG({fill:true})).on("parsed",function(){
		this.conf.png = png;
		this.parsed = true;
		this.emit("parsed");
	}.bind(this));
}

inherits(PNGWord,EventEmitter);

PNGWord.prototype.createReadStream = function(txtword){
	var prefix = this.conf.prefix || "";
	var suffix = this.conf.suffix || "";
	txtword = prefix + txtword + suffix;
	var arr = txtword.split("")
	,png = new PNG({width:this.conf.charWidth*txtword.length,height:this.conf.charHeight});

	arr.forEach(function(char_,index){

		var charPosition = this.conf.repo.indexOf(char_)

		// png picture how many characters a line.
		,hsize = this.png.width/this.conf.charWidth

		// char_ where rows and which columns.
		,rowPosition = parseInt(charPosition/hsize)
		,vfc,val_for_colPosition = vfc = charPosition%hsize
		,colPosition = charPosition === 0 ? 0 : (vfc || hsize-1);

		this.png.bitblt(
			png,
			colPosition*this.conf.charWidth,
			rowPosition*this.conf.charHeight,
			this.conf.charWidth,
			this.conf.charHeight,
			index*this.conf.charWidth,
			0);

	}.bind(this));

	return png.pack();

}

PNGWord.prototype.createPNG = function(txt,cb){
	var rs = this.createReadStream(txt);
	var bufs = [];
	var png = null;
	rs.on("data",function(chunk){
		bufs.push(chunk);
	});
	rs.on("end",function(){
		png = Buffer.concat(bufs);
		cb(png);
	});
}

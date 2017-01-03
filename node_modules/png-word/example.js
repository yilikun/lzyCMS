var PW = require("./"),fs = require("fs");

//var pngword = new PW();
var pngword = PW(PW.GRAY);

pngword.on("parsed",function(){
	this.createPNG("Create a .PNG file from text! :)",function(data){
		fs.writeFileSync("pngword.png",data);
	});
});


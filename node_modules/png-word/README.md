png-word
========

when give a text word , then create a png.

install
=======

  npm install png-word

example
=======
```js
var PW = require("png-word"),fs = require("fs");

var pngword = new PW(); // use defalt config

pngword.on("parsed",function(){
	this.createReadStream("1113221").pipe(fs.createWriteStream("pngword.png"))
});
```
API
===

##### #new
```js
var PW = require("png-word");
var pngword = new PW(); 
```
or
```js
var pngword = PW();
```

##### #createReadStream(txt) 

+ `txt` is a string , return a ReadStream object .

##### #createPNG(txt,callback) 

+ `txt` is a string.
+ `callback` (png) , png is buffer.

Expand
======

`var pw = new PW(conf);` 

`conf` custom self configure, it is a json. 

###### example
```
{
  pngPath: // png image path.

	charWidth:  // is Number, a char width.
	charHeight:

	repo:{  // a char position 
		"X":0,
		"C":1
	}

}
```
Full Text
=========
There are three initial templates ready with full text support:
`.GREEN`, `.RED`, and `.GRAY`.

```js
var PW = require("png-word");
var pngword = new PW(PW.GREEN); 
```


Demo
====

https://github.com/brighthas/validat-num-demo

LICENSE
========

MIT , brighthas <brighthas@gmail.com>

#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");
const clipboard = require("clipboardy");
const color = require("./color").color;

function rainbow(input) {
	input = input.match(/.{1,3}/g);
	let colorTxt = color("underline") + color("bright");
	let index = 0;
	let colors = ["magenta", "cyan", "green", "red"];
	for (let i = 0; i < input.length; i++) {
		const snip = input[i];
		if (index == 3) {
			index = 1;
			colorTxt = colorTxt + color(colors[index]);
		} else {
			index++;
			colorTxt = colorTxt + color(colors[index]);
		}
		colorTxt = colorTxt + snip;
	}
	colorTxt = colorTxt + color("reset");
	return colorTxt;
}

if (!process.argv[2]) {
	console.log(color("red") + "Please input a file directory!");
	return 0;
}

function copyToClipboard(txt) {
	clipboard.writeSync(txt);
}

let option = false;
let options = {
	c: copyToClipboard,
};
let fd;

if (process.argv[2].charAt(0) == "-") {
	fd = fs.createReadStream(process.argv[process.argv.length - 1]);
	option = true;
} else {
	fd = fs.createReadStream(process.argv[2]);
}

var hash = crypto.createHash("sha256");
hash.setEncoding("hex");

fd.on("end", function () {
	hash.end();
	var txt = hash.read();
	if (option) {
		option = process.argv[2].charAt(1);
		if (options[option]) {
			options[option](txt);
		}
	}
	txt = rainbow(txt);
	console.log(txt);
});

fd.pipe(hash);

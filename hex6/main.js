const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const a = 2 * Math.PI / 6;
const r = 30;

const stx = r;
const sty = r;

var hexd = [];
var mlt = [];

function init() {
	initGrid(canvas.width, canvas.height);
	drawGrid(canvas.width, canvas.height);
	updatedata();
}
init();

document.addEventListener('mousedown', function(event) {
	if (event.detail > 1) {
		event.preventDefault();
	}
}, false);

canvas.addEventListener('click', (event) => {
	var cLeft = canvas.offsetLeft + canvas.clientLeft;
	var cTop = canvas.offsetTop + canvas.clientTop;
    var mx = event.pageX - cLeft,
        my = event.pageY - cTop;
	let cndx = [];
	hexd.every((hx) => {
		if(Math.sqrt(Math.pow(hx.x - mx, 2) + Math.pow(hx.y - my, 2)) <= r) {
			clickhex(hx.hexid);
			return false;
		}
		return true;	
	});
});

$(document).ready(function(){
	$("#setbd").click(function(){
		let bd = JSON.parse($("#brd").val());
		updb(bd);
	});

	$("#rdmb").click(function(){
		randomize();
	});
});

function minmov(ls) {
	let ps = [...new Set(ls)];
	let fnl = [];
	ps.forEach((el) => {
		let c = 0;
		ls.forEach((mk) => { if(mk == el){ c++; } });		
		if(c % 6 != 0){
			for(let sy = 0; sy < 6 - (c % 6); sy++){
				fnl.push(el);
			}
		}
	});

	return fnl;
}

function updb(bd) {
	if(bd.length != 37) { 
		alert("Incorrect board array.");
		return;
	}
	
	for(let m = 0; m < hexd.length; m++){
		hexd[m].val = bd[m];
	}

	mlt = [];

	updatedata();

	drawGrid(canvas.width, canvas.height);
}

function randomize() {
	let k = [];
	for(let i = 0; i < hexd.length; i++) {
		hexd[i].val = 1;
	}
	
	var l = hexd.length;
	for(let i = 0; i < 30; i++){
		let j = Math.floor(Math.random() * l);
		k.push(j);
	}

	k = minmov(k);
	for(let i = 0; i < k.length; i++){
		hexd = dmove(hexd, k[i]);
	}

	mlt = k;
	updatedata();
	drawGrid(canvas.width, canvas.height);
}

function getboard() {
	let bc = [];
	for(let k = 0; k < hexd.length; k++){
		bc.push(hexd[k].val);
	}

	return bc;
}

function updatedata() {
	let h = minmov(mlt);
	$('#mov').text("Moves (" + mlt.length + "): " + JSON.stringify(mlt));
	$('#iov').text("Min Moves (" + h.length + "): " + JSON.stringify(h));
	$('#btb').text("Board: " + JSON.stringify(getboard()));
}

function clickhex(id) {
	let dlp = 1;
	if($("#tcl").is(":checked")) {
		dlp = 3;
	}
	
	for(let lx = 0; lx < dlp; lx++){
		chvl(id);

		for(let i = 0; i < hexd[id].ng.length; i++){
			chvl(hexd[id].ng[i]);
		}
		
		mlt.push(id);
	}

	updatedata();

	drawGrid(canvas.width, canvas.height);
	return;
}

function chvl(id) {
	hexd[id].val = (hexd[id].val % 6) + 1;
}

function regid(id, xp, yp) {
	var lv = 1;

	var dc = {
		hexid: id,
		val: lv,
		x: xp,
		y: yp,
		ng: []
	};
	hexd.push(dc);
}

function addng(id, nid) {
	hexd.forEach((hx) => {
		if(hx.hexid == id){
			hx.ng.push(nid);
			return;
		}
	});
}

function getfillst(vl) {
	let cl = 51 * (vl - 1);
	return "rgb("+cl+","+cl+","+cl+")";
}
function getfillsttx(vl) {
	if(vl <= 3){
		return "white";
	}
	else{
		return "black";
	}
}

function initGrid(width, height) {
	let x = stx;	
	let y = sty;
	let hexid = 0;

	for(var i = 0; i < 4; i++){
		for(var n = 0; n < 4 + i; n++){
			x = stx + 3 * i * r * Math.cos(a);
			y = sty + (3 - i) * r * Math.sin(a) + 2 * n * r * Math.sin(a);
			regid(hexid, x, y);

			if(i == 3){
				if(n != 0){
					addng(hexid, hexid + (4 + i) - 1);
				}
				if(n != i + 3){
					addng(hexid, hexid + (4 + i));
				}
			}
			else {
				addng(hexid, hexid + (4 + i));
				addng(hexid, hexid + (4 + i) + 1);
			}

			if(i != 0){
				if(n != 0){
					addng(hexid, hexid - (4 + i));
				}
				if(n != i + 3){
					addng(hexid, hexid - (4 + i) + 1);
				}			
			}

			if(n != 0){
				addng(hexid, hexid - 1);
			}
			if(n != i + 3){
				addng(hexid, hexid + 1);
			}

			hexid++;
		}
	}

	for(var i = 0; i < 3; i++){
		for(var n = 0; n < 6 - i; n++){
			x = stx + 3 * (i + 4) * r * Math.cos(a);
			y = sty + (i +1) * r * Math.sin(a) + 2 * n * r * Math.sin(a);
			regid(hexid, x, y);
			
			if(i != 2){
				if(n != (6 - i) - 1){				
					addng(hexid, hexid + (6 - i));
				}

				if(n != 0){
					addng(hexid, hexid + (6 - i) - 1);
				}
			}

			if(n != (6 - i) - 1){				
				addng(hexid, hexid + 1);
			}
			if(n != 0){
				addng(hexid, hexid - 1);
			}

			addng(hexid, hexid - (6 - i));
			addng(hexid, hexid - (6 - i) - 1);

			hexid++;
		}
	}
}

function drawGrid(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	let hexid = 0;
	let tfn = "8px mono";
	let vfn = "bold 12px ubuntu";
	for(var i = 0; i < 4; i++){
		for(var n = 0; n < 4 + i; n++){
			drawHexagon(hexd[hexid].x, hexd[hexid].y, hexd[hexid].val);

  			ctx.font = tfn;
  			ctx.fillStyle = getfillsttx(hexd[hexid].val);
  			ctx.fillText(hexid, hexd[hexid].x-r/2, hexd[hexid].y-r/2);
  			ctx.font = vfn;
  			ctx.fillText(hexd[hexid].val, hexd[hexid].x-r/8, hexd[hexid].y+r/5);

			hexid++;
		}
	}
	for(var i = 0; i < 3; i++){
		for(var n = 0; n < 6 - i; n++){
			drawHexagon(hexd[hexid].x, hexd[hexid].y, hexd[hexid].val);

  			ctx.font = tfn;
  			ctx.fillStyle = getfillsttx(hexd[hexid].val);
  			ctx.fillText(hexid, hexd[hexid].x-r/2, hexd[hexid].y-r/2);
  			ctx.font = vfn;
  			ctx.fillText(hexd[hexid].val, hexd[hexid].x-r/8, hexd[hexid].y+r/5);

			hexid++;		
		}
	}
}

function dmove(data, move){
	var nd = JSON.parse(JSON.stringify(data));
	nd[move].val = (nd[move].val % 6) + 1;
	for(let x = 0; x < nd[move].ng.length; x++) {
		let k = nd[nd[move].ng[x]].val;
		nd[nd[move].ng[x]].val = (k % 6) + 1;
	}

	return nd;
}

function drawHexagon(x, y, fill) {
	ctx.beginPath();
	for (var i = 0; i < 6; i++) {
		ctx.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
	}
	ctx.closePath();
	
	ctx.fillStyle = getfillst(fill);
	ctx.fill();
	
	ctx.strokeStyle = getfillsttx(fill);
	ctx.stroke();
}


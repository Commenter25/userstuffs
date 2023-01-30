// ==UserScript==
// @name         Reference Detector
// @namespace    github.com/Commenter25
// @version      1.0.0
// @description  We've all wandered the web and wondered "wow, i wonder if what i'm witnessing is a reference to something?". Never live in doubt again, for this script uses the tried and true clickbait strategy of red circles to draw your eyes to any reference you wish!
// @author       Commenter25
// @license      MIT
// @homepageURL  https://github.com/Commenter25/userstuffs
// @supportURL   https://github.com/Commenter25/userstuffs/issues
// @updateURL    https://raw.githubusercontent.com/Commenter25/userstuffs/main/refdetect/refdetect.meta.js
// @downloadURL  https://raw.githubusercontent.com/Commenter25/userstuffs/main/refdetect/refdetect.user.js
// @copyright    Copyright (c) 2023 Commenter25
// @icon         https://raw.githubusercontent.com/Commenter25/userstuffs/main/refdetect/icon.png
// @match        <all_urls>
// @run-at       document-idle
// @inject-into  content
// @sandbox      JavaScript
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// ==/UserScript==

/* @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt MIT License */
(async ()=>{"use strict";
const timer = ms => new Promise(res => setTimeout(res, ms));

const defaultRefer = "nano";
const defaultRefed = "https://raw.githubusercontent.com/Commenter25/userstuffs/main/refdetect/nano.webp";

function blobToData(blob) {
	return new Promise(res=> {
		let reader = new FileReader()
		reader.addEventListener("load", () => {
			res(reader.result);
		}, false);
		reader.readAsDataURL(blob);
	});
}

// fallback on dirtier methods if csp is a bitch
let allClear = true, problems = false, noblobs = false, nostyletag = false, noframes = false;
let genericWarn = "Reference Detector: CSP too strict, unable to run! "
document.addEventListener("securitypolicyviolation", async (e)=> {
	if (problems) return;
	if (e.violatedDirective === "style-src-elem" && !nostyletag) {
		nostyletag = true;
		console.log("Reference Detector: CSP blocks style tag, attempting inlines...");
		let test = document.createElement("img");
		test.style = "opacity: 0";
	}
	if (e.violatedDirective === "style-src-attr" && nostyletag) {
		problems = true; allClear = true;
		console.log(genericWarn + "(Blocks CSS)");
	}

	if (e.violatedDirective === "img-src" && e.blockedURI === "blob" && !noblobs) {
		allClear = false; noblobs = true;
		console.log("Reference Detector: CSP blocks blobs, attempting Data URI...");
		theReferenced = theURI;
		allClear = true;
	}
	if (e.violatedDirective === "img-src" && e.blockedURI === "data" && noblobs) {
		problems = true; allClear = true;
		console.log(genericWarn + "(Unable to use either blobs or Data URIs)");
	}

	if (e.violatedDirective === "child-src") noframes = true;
});

let testStyle = document.createElement("style");
document.head.appendChild(testStyle);
testStyle.remove();

let theReferencer = await GM_getValue("theReferencer", defaultRefer).split(',');
theReferencer = theReferencer.map(s => s.trim());
let theURI = await GM_getValue("theReferenced", defaultRefed);
let theBlob;
let theReferenced = await new Promise(async res=>{
	GM_xmlhttpRequest({
		url: theURI,
		responseType: "blob",
		onload: async ({ response }) => { theBlob = response; res(URL.createObjectURL(response)); }
	});
})

async function checkProblems() {
	await timer(1);
	while (!allClear) await timer(50);
}
await checkProblems(); if (problems) return;

async function downscaleImg() {
	const tempImg = new Image();
	await new Promise(res=>{
		tempImg.addEventListener('load', res);
		tempImg.src = theReferenced;
	})
	const width = tempImg.naturalWidth;
	const height = tempImg.naturalHeight;
	if (width > 100 || height > 100) {
		const cavDown = document.createElement('canvas');
		const cotDown = cavDown.getContext('2d');

		let wrh = width / height;
		let newWidth = width;
		let newHeight = newWidth / wrh;
		if (newHeight > height) {
			newHeight = height;
			newWidth = newHeight * wrh;
		}
		cavDown.width = newWidth;
		cavDown.height = newHeight;

		cotDown.drawImage(tempImg, 0, 0, cavDown.width, cavDown.height);

		let downs = 1;
		async function downscale() {
			downs = downs * 2; let oldCav;
			await new Promise(async res=>{
				await cavDown.toBlob(async (blob) => { oldCav = await URL.createObjectURL(blob); res(); });
			});
			let img = new Image();
			await new Promise(res=>{
				img.addEventListener('load', res);
				img.src = oldCav;
			});
			cotDown.clearRect(0, 0, cavDown.width / 2, cavDown.height / 2);
			cotDown.drawImage(img, 0, 0, cavDown.width / 2, cavDown.height / 2);
		}
		while (cavDown.width / downs > 100 && cavDown.height / downs > 100) await downscale();

		const cav = document.createElement('canvas');
		const cot = cav.getContext('2d');

		// the following math is awful and doesnt work and is bodged together from my tiny brain with stuff i found online
		// in an ideal world, it would always result in an image with a largest edge of 50px
		// however, i have not done this, for i do not know how and i am fucking tired of this

		const finalWidth = cavDown.width / downs;
		const finalHeight = cavDown.height / downs;
		const ratioWidth = finalHeight / finalWidth;
		const ratioHeight = finalWidth / finalHeight;

		let percentWidth, percentHeight;
		if (finalWidth > finalHeight) {
			percentWidth = 50;
			percentHeight = 50 / ratioHeight;
		} else if (finalHeight > finalWidth) {
			percentWidth = 50 / ratioWidth;
			percentHeight = 50;
		} else {
			percentWidth = 50;
			percentHeight = 50;
		}

		const pixelsWidth = finalWidth * finalHeight * (percentWidth / 100);
		const pixelsHeight = finalWidth * finalHeight * (percentHeight / 100);
		cav.width = Math.sqrt( pixelsWidth / ratioWidth );
		cav.height = Math.sqrt( pixelsHeight / ratioHeight );

		cot.drawImage(cavDown, 0,0, finalWidth, finalHeight, 0,0, cav.width, cav.height);

		theURI = await cav.toDataURL("image/webp", 0.9);
		if (noblobs) {
			theReferenced = theURI;
		} else {
			await cav.toBlob(async (blob) => { theBlob = blob; theReferenced = await URL.createObjectURL(blob); });
		}
	}
	GM_setValue("theReferenced", theURI)
	allClear = true;
}

allClear = false;
await downscaleImg()

await checkProblems(); if (problems) return;

async function openMenu() {
	if (document.getElementById("refdetectconfig")) return;

	const frame = document.createElement("iframe");
	frame.id = "refdetectconfig"
	frame.title = "Reference Detector Settings Window"
	frame.style = `
	position: fixed;
	inset: 20px 20px 0 auto;
	width: 450px; height: 480px;
	border: none; z-index: 999999;`
	frame.srcdoc = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>settings</title>
	<style>
		html {
			display: none;
			box-sizing: border-box;
			min-height: 100vh;
			color: #252525; background: #ccc;
			border: #252525 1px solid;
			color-scheme: light;
		}
		@media ( prefers-color-scheme: dark ) { html {
			color: #ccc; background: #252525;
			border: #ccc 1px solid; color-scheme: dark;
		}}
		body {
			font-family: Ubuntu, Tahoma, system-ui, -apple-system, ui-sans-serif, sans-serif;
			text-align: right; margin: auto; width: 90vw;
		}
		h1 { font-size: 3em; margin: 0; font-weight: 900; }
		h2 { font-size: 2em; margin: 1em 0 0; }
		input { box-sizing: border-box; width: 100%; }
		button { margin: 25px 0 3px 25px }
	</style>
</head>
<body>

<h1>settings</h1>
<p>Changes will be applied on refresh.</p>

<h2><label for="refdetect-keywords">keywords</label></h2>
<p>Comma-separated, case-insensitive strings to find.</p>
<input type="text" id="refdetect-keywords" spellcheck="true" placeholder="place a word here">

<h2><label for="refdetect-image">image url</label></h2>
<p>It looks better if it fits within 50x50.<br>
	 If it won't load, or for local images, <a href="https://ezgif.com/image-to-datauri">use a Data URI</a>.</p>
<input type="text" id="refdetect-image" spellcheck="false" placeholder="place a url here">

<button id="refdetect-defaults">defaults</button><button id="refdetect-cancel">cancel</button><button id="refdetect-save">save changes</button>

</body></html>`;

	document.body.appendChild(frame);
	await new Promise(res => frame.addEventListener('load', res));

	const framedoc = frame.contentDocument;
	const keywords = framedoc.getElementById("refdetect-keywords");
	const image = framedoc.getElementById("refdetect-image");
	const bcancel = framedoc.getElementById("refdetect-cancel");
	const bsave = framedoc.getElementById("refdetect-save");
	const bdef = framedoc.getElementById("refdetect-defaults");

	keywords.value = await GM_getValue("theReferencer", defaultRefer);
	image.value = await GM_getValue("theReferenced", defaultRefed);

	function close() {
		frame.remove();
	}
	bcancel.onclick = close;

	async function save() {
		framedoc.documentElement.style.display = "none";
		if (!keywords.value) keywords.value = defaultRefer;
		if (!image.value) image.value = defaultRefed;
		await GM_setValue("theReferencer", keywords.value);
		theURI = image.value; theReferenced = image.value;
		await downscaleImg();
		close();
	}
	bsave.onclick = save;

	function defaults() {
		keywords.value = defaultRefer;
		image.value = defaultRefed;
		save();
	}
	bdef.onclick = defaults;

	framedoc.documentElement.style.display = "flex";
}
if (nostyletag || noframes) {
	GM_registerMenuCommand("PAGE BLOCKS OPENING SETTINGS!", ()=>{});
} else {
	GM_registerMenuCommand("Settings", ()=>{ openMenu() });
}


const styleBox = `display: inline !important; position: relative !important; box-shadow: 0 0 0 0.1em #f00 !important; border-radius: 100% !important;`
const styleGeneric = `
all: initial !important; display: inline !important; position: absolute !important;
-webkit-user-select: none !important; -moz-user-select: none !important;
user-select: none !important; cursor: default !important; pointer-events: none !important;`
const styleImg = `
width: 50px !important; height: 50px !important; vertical-align: top !important;
object-fit: contain !important; object-position: bottom !important;
transform: translateY(-90%) translateX(calc(-1em + -30px)) !important;`
const styleLine = `
width: 1px !important; height: 1.2em !important;
border-left: 0.1em solid red !important; vertical-align: middle !important;
transform: translate(-0.65em, -0.3em) rotate(-68deg) !important;`
if (!nostyletag) {
	document.head.insertAdjacentHTML("beforeend", `<style id="refdetectcss">
	.refdetect { ${styleBox} }
	.refdetect-gen { ${styleGeneric} }
	.refdetectimg { ${styleImg} }
	.refdetectline  { ${styleLine} }
	</style>`);
}

async function scanDoc(from) {
	let references = [];

	function search(node) {
		if (!node.childNodes) return;
		if (node.className !== undefined && typeof node.className === "string" && node.className.includes("refdetect")) return;
		for (let i of node.childNodes) {
			search(i);
			if (i.nodeType !== 3) continue;

			const val = i.nodeValue;
			if (val === null) continue;

			let str, poststr;
			for (let ref of theReferencer) {
				const match = val.search(new RegExp(ref, "gi"));
				if (match < 0) continue;

				str = i.splitText(match);
				poststr = str.splitText(ref.length);
				break;
			}
			if (!str) continue;

			const span = document.createElement("span");
			span.className = "refdetect";
			if (nostyletag) span.style = styleBox;
			/* broken by pointer-events: none, as i don't know how else to make it not show the link hover
			span.onclick = (e)=> {
				e.preventDefault();
				span.className = "";
				span.style = "";
				span.replaceChildren(span.innerText);
			};*/
			references.push(span)

			const range = document.createRange();
			range.selectNode(str);
			range.surroundContents(span);

			search(node); // may be possible to start at mutated node for slightly better performance
			break;
		}
	}
	search(from)

	if (!references.length) return;
	await checkProblems();
	if (problems) {
		for (let i of references) { i.style = ""; i.className = ""; }
	}

	for (let i of references) {
		const line = document.createElement("div");
		line.className = "refdetect-gen refdetectline";
		if (nostyletag) line.style = styleGeneric + styleLine;

		const img = document.createElement("img");
		img.className = "refdetect-gen refdetectimg";
		if (nostyletag) img.style = styleGeneric + styleImg;
		img.src = theReferenced

		i.prepend(line); i.prepend(img);
	}
}

await checkProblems(); if (problems) return;
while (document.readyState !== 'complete') await timer(200);


await scanDoc(document.body);

async function callback(mutations) {
	await checkProblems(); if (problems) return;
	for (let i of mutations) {
		if (i.target.className !== undefined && typeof i.target.className === "string" && i.target.className.includes("refdetect")) return;
		if (i.target.parentNode.tagName == "TITLE");
		scanDoc(i.target.parentNode);
	}
};

const observer = new MutationObserver(callback);
observer.observe(document.body, {
	subtree: true,
	childList: true,
	attributes: false,
	characterData: true
});


})();
/* @license-end */

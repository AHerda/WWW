const galleryContainer = document.getElementById("galeria");

const imagesSrc = [
    "./zdjecia/20220429_162955.jpg",
    "./zdjecia/20220903_180231(0).jpg",
    "./zdjecia/20230101_161812.jpg",
    "./zdjecia/20220528_133916.jpg",
    "./zdjecia/20220913_121600.jpg",
    "./zdjecia/20220822_140609(0).jpg",
    "./zdjecia/20221102_121354.jpg",
    "./zdjecia/20220823_192212.jpg",
    "./zdjecia/20230101_161526.jpg",
    "./zdjecia/received_1491094641337527.jpeg"
];


function loadImage(url) {
    return new Promise((resolve, reject) => {
		let img = new Image();
		img.addEventListener('load', e => resolve(img));
		img.addEventListener('error', () => {
			reject(new Error(`Failed to load image's URL: ${url}`));
		});
		img.src = url;
    img.tabIndex = -1
    });
}

Promise.all(imagesSrc.map(loadImage)).then((images) => {
	images.forEach((image) => {
		galleryContainer.appendChild(image);
	});
});
/*const form = document.querySelector('form');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const liczba = document.getElementById("difficulty").value;
    const zdjecie = document.getElementById("img").files[0];
    const reader = new FileReader();

    reader.onload = () => {
        const img = document.createElement("img");
        img.src = reader.result;
        document.body.appendChild(img);
    }

    reader.readAsDataURL(zdjecie);
});*/

document.getElementById('btn').onclick = function() {
    var val = document.getElementById('imagename').value,
        src = 'www.example.com/Category-3/Images/' + val +'.png',
        img = document.createElement('img');
        img.src = src;
        img.setAttribute('width', '190px');
        img.setAttribute('height', '190px');
        document.body.appendChild(img);
}
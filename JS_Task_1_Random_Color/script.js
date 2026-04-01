const widthInput = document.getElementById('widthInput');
const heightInput = document.getElementById('heightInput');
const square = document.getElementById('square');
const colorBtn = document.getElementById('colorBtn');

function updateSize() {
    const width = widthInput.value;
    const height = heightInput.value;

    square.style.width = width + 'px';
    square.style.height = height + 'px';
}

function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

widthInput.addEventListener('input', updateSize);
heightInput.addEventListener('input', updateSize);

colorBtn.addEventListener('click', () => {
    square.style.backgroundColor = getRandomColor();
});
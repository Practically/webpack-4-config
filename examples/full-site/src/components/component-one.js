/**
 * Import the image
 */
const image = require('../images/icon.png');

/**
 * Make the logo spin
 */
export function rotate(image) {
    image.classList.add('rotate');
}

/**
 * Set the image source
 */
export function setImage(img) {
    img.src = image;
}

/**
 * Run the functions
 */
const img = document.getElementById('logo');

setImage(img);
rotate(img);

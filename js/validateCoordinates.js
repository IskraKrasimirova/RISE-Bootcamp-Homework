export function validateCoordinates(x, y, topX = 280, topY = 280) {
    if (typeof (x) != 'number') {
        throw new TypeError('x-coordinate must be a number');
    }

    if (typeof (y) != 'number') {
        throw new TypeError('y-coordinate must be a number');
    }

    if (x > topX || y > topY) {
        console.log('The point is out of map.');
    }
}
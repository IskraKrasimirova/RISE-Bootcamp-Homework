export default class Drone {
    constructor(capacity, consumption, status = 'ready', x = null, y = null) {
        this.capacity = capacity;
        this.consumption = consumption;
        this.status = status;
        this.x = x;
        this.y = y;
    }

    get maxDistance() {
        return (this.capacity * 1000) / this.consumption;
    }

    move(distance) {
        if (distance * 2 > this.maxDistance) {
            console.log('This drone has not enought power.');
        }

        this.capacity = (this.capacity * 1000 - this.consumption * distance * 2) / 1000;
    }
}
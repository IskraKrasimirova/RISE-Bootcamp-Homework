export default class Warehouse {
    constructor(x, y, name, drones = []) {
        this.x = x;
        this.y = y;
        this.name = name;
        this.drones = drones;
    }
}
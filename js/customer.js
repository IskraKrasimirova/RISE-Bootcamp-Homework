export default class Customer {
    constructor(id, name, coordinates = { x, y }) {
        this.id = id;
        this.name = name;
        this.coordinates = coordinates;
    }
}
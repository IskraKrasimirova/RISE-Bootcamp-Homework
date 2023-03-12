import Order from "./Order.js";

export default class CustomerOrder extends Order {
    constructor(customerId, productList = [{ productName, productQuantity }], coordinates = { x, y }, status = 'pending') {
        super(customerId, productList);
        this.coordinates = coordinates;
        this.status = status;
    }
}


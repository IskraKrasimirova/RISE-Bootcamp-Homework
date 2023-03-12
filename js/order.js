export default class Order {
    constructor(customerId, productList = [{ productName, productQuantity }]) {
        this.customerId = customerId;
        this.productList = productList;
    }
}
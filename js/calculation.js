import { validateCoordinates } from "./validateCoordinates.js";

export function calculateDistance(customerCoordinates = { x, y }, warehouseX, warehouseY) {
    validateCoordinates(customerCoordinates.x, customerCoordinates.y);
    validateCoordinates(warehouseX, warehouseY);

    const dx = customerCoordinates.x - warehouseX;
    const dy = customerCoordinates.y - warehouseY;
    return Math.sqrt(dx ** 2 + dy ** 2);
}
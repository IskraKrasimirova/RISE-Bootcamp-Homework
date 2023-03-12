import Warehouse from "./Warehouse.js";
import Order from "./Order.js";
import Drone from "./Drone.js";
import CustomerOrder from "./CustomerOrder.js";
import { calculateDistance } from "./calculation.js";

export default function realTime(data) {
    const [deliveryStatus, products, output, mapTopRightCoordinate, warehouses, customers, orders, typesOfDrones] = Object.values(data);
    if (deliveryStatus.output == true && output.poweredOn == true) {
        let frequency = deliveryStatus.frequency;
        setTimeout(() => {
            const allOrders = [];
            for (const item of orders) {
                let order = new Order(item.customerId, item.productList);
                allOrders.push(order);
            }

            const allCustomerOrders = [];  // customer with order
            for (const customer of customers) {
                for (const order of allOrders) {
                    if (order.customerId == customer.id) {
                        let customerOrder = new CustomerOrder(customer.id, order.productList, customer.coordinates);
                        allCustomerOrders.push(customerOrder);
                    }
                }
            }

            console.log('All orders: ', allCustomerOrders.length);
            for (const order of allCustomerOrders) {
                console.log(`Order for client ${order.customerId}: ${order.status}`);
            }

            const drones = [];
            for (let i = 0; i < typesOfDrones.length; i++) {
                let capacityString = typesOfDrones[i].capacity;
                if (capacityString.endsWith('kW')) {
                    capacityString = capacityString.slice(0, -2);
                } else {
                    capacityString = capacityString.slice(0, -1);
                }

                let consumptionString = typesOfDrones[i].consumption.slice(0, -1);
                let consumption = Number(consumptionString);
                let capacity = Number(capacityString);
                if (capacity == 500) {
                    capacity /= 1000;
                }

                const drone = new Drone(capacity, consumption);
                drones.push(drone);
            }

            const allWarehouses = [];
            let availableDrones = [];
            for (const item of warehouses) {
                const warehouse = new Warehouse(item.x, item.y, item.name);
                warehouse.drones = drones.concat(drones);
                console.log(`Drones at ${warehouse.name}: `);
                warehouse.drones.forEach(drone => {
                    drone.x = warehouse.x;
                    drone.y = warehouse.y;
                    console.log('status: ', drone.status);
                    console.log('capacity: ', drone.capacity);
                    //console.log(drone);
                });
                allWarehouses.push(warehouse);
                availableDrones = availableDrones.concat(warehouse.drones);
                console.log('Available drones: ', availableDrones.length);
            }

            let totalDistance = 0;
            const lostDrones = [];

            for (const order of allCustomerOrders) {
                if (order.status == 'delivered') {
                    return;
                }

                let distances = [];
                for (const warehouse of allWarehouses) {
                    let distance = calculateDistance(order.coordinates, warehouse.x, warehouse.y);
                    distances.push(distance);
                }

                distances.sort((a, b) => a - b);
                let distance = distances[0];
                let minDistance = 18.4; //само в конкретния случай възможно най-малкото разстояние

                availableDrones.sort(() => Math.random() - Math.random()).slice(0, availableDrones.length - 1);
                for (let i = 0; i < availableDrones.length; i++) {
                    let drone = availableDrones[i];
                    if ((drone.capacity * 1000 > (drone.consumption) * distance * 2) //Ако искаме дрона да се върне, distance*2
                        && drone.status == 'ready'
                        && order.status == 'pending') {
                        order.status = 'delivered';
                        let delay = distance * 2 * 60 * 1000;
                        setTimeout(() => {
                            drone.move(distance);
                            drone.status = 'delivering';
                        }, delay);
                    } else if ((drone.capacity * 1000 <= (drone.consumption) * minDistance * 2)
                        && drone.status == 'ready'
                        && order.status == 'pending') {
                        const removed = availableDrones.splice(i, 1);
                        removed.status = 'low';
                        lostDrones.push(removed);
                    }
                }

                totalDistance += distance * 2;

                if (allCustomerOrders.every(o => o.status == 'delivered')) {
                    console.log('All orders are delivered.');
                    break;
                }
            }

            for (const drone of lostDrones) {
                setTimeout(() => {
                    drone.status = 'charging';
                    switch (drone.consumption) {
                        case 1:
                            drone.capacity = 0.5;
                            break;
                        case 3:
                            drone.capacity = 1;
                            break;
                        case 5:
                            drone.capacity = 2;
                            break;
                        default:
                            break;
                    }
                }, 20 * 60 * 1000);

                drone.status = 'ready';
                lostDrones.splice(lostDrones.indexOf(drone), 1);
                availableDrones.push(drone);
                console.log('Available drones: ', availableDrones.length);
                console.log('Lost drones: ', lostDrones.length);
            }

            let programTimeFactor = output.minutes.program;
            let realTimeFactor = output.minutes.real;
            let programTotalTime = Math.ceil(totalDistance + 5 * allOrders.length);
            let programTotalDistance = totalDistance;
            let realTotalTime = programTotalTime * realTimeFactor / programTimeFactor;
            let realTotalDistance = totalDistance * realTimeFactor / programTimeFactor;
            let averageTimeDelivering = realTotalTime / allOrders.length;

            console.log('Total program distance: ', programTotalDistance.toFixed(2));
            console.log('Total program time in minutes: ', programTotalTime);
            console.log('Total real distance: ', realTotalDistance.toFixed(2));
            console.log('Total real time in minutes: ', realTotalTime);
            console.log('Used drones: ', allOrders.length);
            console.log('Average time of delivering: ', Math.ceil(averageTimeDelivering));
            console.log('Available drones: ', availableDrones.length);
            for (const drone of availableDrones) {
                console.log('status: ', drone.status);
                console.log('capacity: ', drone.capacity);
            }
            console.log('Lost drones: ', lostDrones.length);

            for (const order of allCustomerOrders) {
                console.log(`Order for client ${order.customerId}: ${order.status}`);
            }
        }, frequency);
    }
}
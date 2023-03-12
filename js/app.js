import realTime from "./realTime.js";

export default function App() {
    (function loop() {
        setTimeout(() => {
            fetch('../input1.json')
                .then((response) => response.json())
                .then((data) => {
                    //console.log(data);
                    realTime(data);
                })
                .catch((err) => console.error(err));

            loop();
        }, 3000);
    })();


    // fetch('../input1.json')
    //     .then((response) => response.json())
    //     .then((data) => {
    //         console.log(data);
    //         realTime(data);
    //     })
    //     .catch((err) => console.error(err));
}

App();
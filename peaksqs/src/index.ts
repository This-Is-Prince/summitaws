import { startConsumer } from "./consumer";
import { producer } from "./producer";

const main = async () => {
    await producer(true);
    await startConsumer(true);
};

main();
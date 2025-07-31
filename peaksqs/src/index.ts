import { startConsumer } from "./consumer";
import { producer } from "./producer";

const main = async () => {
    await producer(false);
    await startConsumer(true);
};

main();
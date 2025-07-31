import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { MAIN_QUEUE_URL, sqsClient } from "./config";

const sendMessage = async (messageBody: object) => {
    console.log(`Sending message to SQS...`);

    const command = new SendMessageCommand({
        QueueUrl: MAIN_QUEUE_URL,
        MessageBody: JSON.stringify(messageBody),
        MessageAttributes: {
            "ContentType": {
                DataType: "String",
                StringValue: "JSON",
            },
        },
    });

    try {
        const response = await sqsClient.send(command);
        console.log(`✅ Message sent successfully! MessageId: ${response.MessageId}`);
    } catch (error) {
        console.log("❌ Error sending message:", error);
    }
};

export const producer = async (run: boolean) => {
    if (!run) {
        return;
    }

    const orderMessage = {
        orderId: `order-${Date.now()}`,
        customerName: "John Doe",
        items: [
            {
                productId: "prod-123",
                quantity: 2,
            },
            {
                productId: "prod-456",
                quantity: 1,
            },
        ],
        total: 150.75,

        // For DLQ
        fail: true,
    };

    await sendMessage(orderMessage);
};
import { DeleteMessageCommand, Message, ReceiveMessageCommand } from "@aws-sdk/client-sqs";
import { MAIN_QUEUE_URL, sqsClient } from "./config";

const deleteMessage = async (receiptHandle: string) => {
    console.log(`Deleting message from SQS...`);

    const command = new DeleteMessageCommand({
        QueueUrl: MAIN_QUEUE_URL,
        ReceiptHandle: receiptHandle,
    });

    try {
        await sqsClient.send(command);
        console.log(`✅ Message deleted successfully.`);
    } catch (error) {
        console.error("❌ Error deleting message:", error);
    }
};

const processMessage = async (message: Message) => {
    console.log(`\n📨 Received message:`, {
        MessageId: message.MessageId,
        Body: message.Body,
        Attributes: message.MessageAttributes,
    });

    try {
        const body = JSON.parse(message.Body as string);

        if (body.fail === true) {
            throw new Error("This is a poison pill message! Processing failed.");
        }

        // If processing is successful...
        console.log("✅ Processing successful.");

        await deleteMessage(message.ReceiptHandle as string);
    } catch (error) {
        console.error(`- - - ❌ PROCESSING FAILED: ${(error as Error).message} - - -`);
    }
};

export const startConsumer = async (run: boolean) => {
    if (!run) {
        return;
    }

    console.log("🚀 Consumer started. Polling for messages...");

    while (true) {
        const command = new ReceiveMessageCommand({
            QueueUrl: MAIN_QUEUE_URL,
            MessageAttributeNames: ["All"],
            WaitTimeSeconds: 20,
            MaxNumberOfMessages: 5,
        });

        try {
            const response = await sqsClient.send(command);

            if (response.Messages && response.Messages.length > 0) {
                for (const message of response.Messages) {
                    await processMessage(message);
                }
            } else {
                console.log("No messages in queue. Waiting...");
            }
        } catch (error) {
            console.error("❌ Error receiving messages:", error);
        }
    }

};

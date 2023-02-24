import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';
export interface Event {
    subject: Subjects;
    data: any;
}
export declare abstract class Listener<T extends Event> {
    abstract subject: T['subject'];
    abstract queueGroupName: string;
    abstract onMessage(data: T['data'], message: Message): void;
    protected ackWait: number;
    protected client: Stan;
    constructor(client: Stan);
    subscriptionOptions(): import("node-nats-streaming").SubscriptionOptions;
    listen(): void;
    parseMessage(message: Message): any;
}

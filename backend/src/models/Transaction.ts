export class Transaction {
    public id: string;
    public senderAddress: string;
    public recipientAddress: string;
    public amount: number;
    public timestamp: number;

    constructor(id: string, senderAddress: string, recipientAddress: string, amount: number, timestamp?: number) {
        this.id = id;
        this.senderAddress = senderAddress;
        this.recipientAddress = recipientAddress;
        this.amount = amount;
        this.timestamp = timestamp || Date.now();
    }
}

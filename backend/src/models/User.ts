export class User {
    public id: string;
    public email: string;
    public passwordHash: string;
    public walletAddress: string;

    constructor(id: string, email: string, passwordHash: string, walletAddress: string) {
        this.id = id;
        this.email = email;
        this.passwordHash = passwordHash;
        this.walletAddress = walletAddress;
    }
}

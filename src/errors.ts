export class BaseError extends Error {
    constructor(obj: any) {
        super(JSON.stringify(obj));
    }
}

export class DuplicatePhoneError extends Error {
  constructor() {
    super("This phone number is already registered as a lead.");
    this.name = "DuplicatePhoneError";
  }
}

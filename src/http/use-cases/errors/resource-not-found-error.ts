export class ResourceNotFoundError extends Error {
  constructor() {
    super('Invalid Resource not found.')
  }
}

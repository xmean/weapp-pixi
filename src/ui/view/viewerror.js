export default class ViewError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, ViewError);
  }
}
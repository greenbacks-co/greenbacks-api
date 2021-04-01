export class InputError extends Error {
  constructor(key, parent) {
    if (key && parent)
      super(`Value '${key}' in '${parent}' was missing or invalid`);
    else if (key) super(`Value '${key}' was missing or invalid`);
    else super('Input was invalid');
  }
}

export default {
  InputError,
};

HTMLDialogElement.prototype.showModal = function showModal() {
  this.setAttribute('open', '');
};

HTMLDialogElement.prototype.close = function close(returnValue?: string) {
  if (returnValue !== undefined) {
    this.returnValue = returnValue;
  }
  this.removeAttribute('open');
  this.dispatchEvent(new Event('close'));
};

window.matchMedia = (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
});

window.scrollTo = () => {};

Object.defineProperty(globalThis, 'CSS', {
  configurable: true,
  value: {
    escape: (value: string) => String(value)
      .replace(/[^a-zA-Z0-9_-]/g, (character) => `\\${character}`),
  },
});

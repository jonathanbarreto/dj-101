import {installCssEscape} from './cssEscape';

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

installCssEscape(globalThis);

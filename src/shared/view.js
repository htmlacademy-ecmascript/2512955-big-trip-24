import {
  createElement,
  render,
  RenderPosition
} from '../render';

export default class View {
  #element = null;
  #getElementTemplate = null;

  constructor(getElementTemplate) {
    this.#getElementTemplate = getElementTemplate;
  }

  getElement() {
    if (!this.#element) {
      this.#element = createElement(this.#getElementTemplate());
    }

    return this.#element;
  }

  unmount() {
    if (this.#element) {
      this.#element.remove();
    }
  }

  render(root, position = RenderPosition.BEFOREEND) {
    this.unmount();
    render(this, root, position);
  }
}

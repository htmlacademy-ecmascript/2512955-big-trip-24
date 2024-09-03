import {
  createElement,
  render,
  RenderPosition
} from '../render';

export default class View {
  #element = null;
  #getElementTemplate = null;
  #data = null;

  constructor({
    getElementTemplate,
    data
  }) {
    this.#getElementTemplate = getElementTemplate;
    this.#data = data;
  }

  #getFilledTemplate() {
    return this.#getElementTemplate({data: this.#data});
  }

  getElement() {
    if (!this.#element) {
      this.#element = createElement(this.#getFilledTemplate());
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

import {
  createElement,
  render,
  RenderPosition
} from '../render';

/**
* GetTemplateCallback params
* @typedef { Object } GetTemplateCallbackParams
* @property { any } GetTemplateCallbackParams.data
*/

/**
* @callback GetTemplateCallback
* @param { GetTemplateCallbackParams } params
* @return { string }
*/

/**
* View constructor params
* @typedef { Object } ViewConstructorParams
* @property { GetTemplateCallback } GetTemplateCallbackParams.getElementTemplate
* @property { any } GetTemplateCallbackParams.data
*/

/**
 * View parent abstract class
 */
export default class View {
  /**
   * DOM Element
   * @type { HTMLElement | null }
   */
  #element = null;

  /**
   * @type { GetTemplateCallback }
   */
  #getElementTemplate = null;

  /**
   * Component data DTO
   * @type { any }
   */
  #data = null;

  /**
   * View constructor
   * @param { ViewConstructorParams } params
   */
  constructor({
    getElementTemplate,
    data
  }) {
    if (new.target === View) {
      throw new Error('View is abstract class!');
    }
    this.#getElementTemplate = getElementTemplate;
    this.#data = data;
  }

  /**
   * Create View template
   * @returns { string }
   */
  #getFilledTemplate() {
    return this.#getElementTemplate({data: this.#data});
  }

  /**
   * Get component DOM Element
   * @returns { HTMLElement }
   */
  getElement() {
    if (!this.#element) {
      this.#element = createElement(this.#getFilledTemplate());
    }

    return this.#element;
  }

  /**
   * Destroy component into DOM
   */
  unmount() {
    if (this.#element) {
      this.#element.remove();
    }
  }

  /**
   * Render view in root element
   * @param { HTMLElement } root
   * @param { RenderPosition } position
   */
  render(root, position = RenderPosition.BEFOREEND) {
    this.unmount();
    render(this, root, position);
  }
}

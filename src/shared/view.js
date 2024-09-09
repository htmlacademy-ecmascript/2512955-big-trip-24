import AbstractView from '../framework/view/abstract-view';
import {
  RenderPosition,
  render
} from '../framework/render';

/**
 * Tuned AbstractView parent abstract class
 * @template TDataDto
 */
export default class View extends AbstractView {
  /**
   * @type { GetTemplateCallback<TDataDto> }
   */
  #getElementTemplate = null;

  /**
   * Component data DTO
   * @type { TDataDto }
   */
  #data = null;

  /**
   * View constructor
   * @param { ViewConstructorParams<TDataDto> } params
   */
  constructor({
    getElementTemplate,
    data = null
  }) {
    if (new.target === View) {
      throw new Error('View is abstract class!');
    }
    super();

    this.#getElementTemplate = getElementTemplate;
    this.#data = data;
  }

  /**
   * View data object
   */
  get _data() {
    return this.#data;
  }

  /**
   * View template
   * @returns { string }
   */
  get template() {
    return this.#getElementTemplate({ data: this.#data });
  }

  /**
   * Render view in root element
   * @param { HTMLElement } root
   * @param { RenderPosition } position
   */
  render(root, position = RenderPosition.BEFOREEND) {
    render(this, root, position);
  }
}

/**
* GetTemplateCallback params
* @template TDataDto
* @typedef { Object } GetTemplateCallbackParams
* @property { TDataDto } GetTemplateCallbackParams.data
*/

/**
* @template TDataDto
* @callback GetTemplateCallback
* @param { GetTemplateCallbackParams<TDataDto> } params
* @returns { string }
*/

/**
* View constructor params
* @template TDataDto
* @typedef { Object } ViewConstructorParams
* @property { GetTemplateCallback<TDataDto> } GetTemplateCallbackParams.getElementTemplate
* @property { TDataDto } GetTemplateCallbackParams.data
*/

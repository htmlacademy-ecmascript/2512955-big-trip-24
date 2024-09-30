import he from 'he';

/**
 * he encoding service
 * @static
 */
class EncodeService {
  /**
   * @private
   * @param {*} value
   * @param { Function } htmlEntitiesAction
   * @returns {*}
   */
  static #applyHtmlEntitiesAction(value, htmlEntitiesAction) {
    switch(typeof value) {
      case 'object': {
        if (!value) {
          return value;
        }

        if (Array.isArray(value)) {
          return value.map((current) => EncodeService.encode(current));
        }

        const encodedValue = {};
        Object.keys(value).forEach((current) => {
          encodedValue[current] = EncodeService.encode(value[current]);
        });

        return encodedValue;
      }

      case 'string': {
        return htmlEntitiesAction(value);
      }

      default: {
        return value;
      }
    }
  }

  /**
   * @param {*} value decoding value
   * @returns {*} decoded value
   */
  static encode(value) {
    return EncodeService.#applyHtmlEntitiesAction(value, he.encode);
  }
}

export default EncodeService;

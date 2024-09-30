import Observable from '../framework/observable';

/**
 * @template TValueType
 */
export default class ValueModel extends Observable {
  /**
   * @type { TValueType }
   */
  _value = null;

  constructor() {
    super();
    if (new.target === ValueModel) {
      throw new Error('SyncModel is abstract class');
    }
  }

  /**
   * @template TChangeEventType
   * @param { TChangeEventType } changeType
   * @param { TValueType } newValue
   */
  _changeValue(changeType, newValue) {
    if (this._value !== newValue) {
      this._value = newValue;
      this._notify(changeType, this._value);
    }
  }
}

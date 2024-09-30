import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import EncodeService from '../service/encode-service';

export default class EncodedStatefulView extends AbstractStatefulView {

  _setState(update) {
    super._setState(EncodeService.encode(update));
  }
}

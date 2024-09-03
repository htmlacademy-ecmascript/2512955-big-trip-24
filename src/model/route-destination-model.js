import Model from '../shared/model';
import { getDestinationsMock } from '../mock/route-destination';

export default class RouteDestinationModel extends Model {
  constructor() {
    super({defaultData: []});
  }

  async init() {
    super._fetchData({ fetchFn: getDestinationsMock });
  }

  getDestinationById(destinationId) {
    const destination = this.data.find((current) => destinationId === current.id);
    return destination ? destination : null;
  }
}

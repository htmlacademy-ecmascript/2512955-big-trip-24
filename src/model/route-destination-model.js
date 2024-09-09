import Model from '../shared/model';
import { getDestinationsMock } from '../mock/route-destination';

/**
 * RouteDestinationModel
 * @extends Model<RouteDestinationData[]>
 */
export default class RouteDestinationModel extends Model {
  constructor() {
    super({defaultData: []});
  }

  async init() {
    super._fetchData({ fetchFn: getDestinationsMock });
  }

  /**
   * Get destination info by Id
   * @param { string } destinationId
   * @returns { RouteDestinationData | null }
   */
  getDestinationById(destinationId) {
    const destination = this.data.find((current) => destinationId === current.id);
    return destination ? destination : null;
  }
}

/**
 * DestinationPictureData
 * @typedef { Object } DestinationPictureData
 * @property { string } DestinationPictureData.src
 * @property { string } DestinationPictureData.description
 */

/**
 * RouteDestinationData
 * @typedef { Object } RouteDestinationData
 * @property { string } RouteDestinationData.id
 * @property { string } RouteDestinationData.description
 * @property { string } RouteDestinationData.name
 * @property { DestinationPictureData[] } RouteDestinationData.pictures
 */

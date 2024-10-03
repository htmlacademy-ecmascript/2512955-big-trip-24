import ServerDataAdapter from '../service/server-data-adapter';
import Model from '../shared/model';

/**
 * RouteDestinationModel
 * @extends { Model<DestinationModelData[], RouteApiService> }
 */
export default class RouteDestinationModel extends Model {
  /**
   * @param { RouteDestinationModelConstuctorParams } params
   */
  constructor({ api }) {
    super({defaultData: [], api});
  }

  /**
   * Get destination info by Id
   * @param { string } destinationId
   * @returns { DestinationModelData | null }
   */
  getDestinationById(destinationId) {
    const destination = this.data.find((current) => destinationId === current.id);
    return destination ? destination : null;
  }

  async init() {
    try {
      const serverData = await this._api.getDestinations();
      this.data = serverData.map((current) => ServerDataAdapter.adaptDestinationToModel(current));
    } catch(err) {
      throw new Error(err?.message ?? 'Can\'t init destination model');
    }
  }
}

/**
 * @typedef { Object } DestinationPictureModelData
 * @property { string } DestinationPictureModelData.src
 * @property { string } DestinationPictureModelData.description
 */

/**
 * @typedef { Object } DestinationModelData
 * @property { string } DestinationModelData.id
 * @property { string } DestinationModelData.name
 * @property { DestinationPictureModelData[] } DestinationModelData.pictures
 */

/**
 * @typedef { import('../service/route-api-service').ObjectWithApiInstance } RouteDestinationModelConstuctorParams
 */

/**
 * @typedef { import('../service/route-api-service').default } RouteApiService
 */

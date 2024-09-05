import Model from '../shared/model';
import { getRandomRouteMock } from '../mock/route';

export default class RouteModel extends Model {
  constructor() {
    super({defaultData: []});
  }

  async init() {
    super._fetchData({ fetchFn: getRandomRouteMock });
  }
}

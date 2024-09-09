import { getRandomElementInArray } from '../utills/random';

const MAX_POINTS_COUNT = 4;
/**
 * Route points mock
 * @constant
 * @type { RoutePointData[] }
 */
const ROUTE_POINTS = JSON.parse(`[
  {
    "id": "1167e634-9406-429b-a249-11bb2c57482c",
    "base_price": 8332,
    "date_from": "2024-10-22T11:02:17.074Z",
    "date_to": "2024-10-23T04:00:17.074Z",
    "destination": "f0281b25-7390-47d8-b1bd-c5c4628c4a0a",
    "is_favorite": true,
    "offers": [
      "f3363117-7d95-47cb-94dd-0554732b1442"
    ],
    "type": "train"
  },
  {
    "id": "09b853c1-6725-4b0e-96ab-0961c4eb1ddd",
    "base_price": 2932,
    "date_from": "2024-10-24T21:12:17.074Z",
    "date_to": "2024-10-25T16:18:17.074Z",
    "destination": "c675c4c0-be22-4308-b48d-bb2b83fbf8bf",
    "is_favorite": true,
    "offers": [
      "b1025907-4092-4ae0-a00b-8a7709c13bb0",
      "a3f277e9-d7c1-49be-85b4-3a50b885edbd",
      "234432b2-bc69-48c0-841c-e8dc7e8a0119",
      "ed53bfa7-4300-4ab0-ac12-778a90dd4a73",
      "44794498-dfe9-41eb-a888-c346d5634d1c"
    ],
    "type": "check-in"
  },
  {
    "id": "f2b91597-f7de-4aa8-b26b-248155e06d6f",
    "base_price": 8867,
    "date_from": "2024-10-27T08:00:17.074Z",
    "date_to": "2024-10-27T15:22:17.074Z",
    "destination": "13ddcced-bab4-4593-8848-2457ef02d2c6",
    "is_favorite": true,
    "offers": [],
    "type": "check-in"
  },
  {
    "id": "76d6d828-9652-4352-82ff-8665e3a5a531",
    "base_price": 5554,
    "date_from": "2024-10-28T22:09:17.074Z",
    "date_to": "2024-10-29T21:48:17.074Z",
    "destination": "410df6a2-db0e-48da-a7b1-0ff5affbbb84",
    "is_favorite": true,
    "offers": [
      "a3f277e9-d7c1-49be-85b4-3a50b885edbd",
      "234432b2-bc69-48c0-841c-e8dc7e8a0119",
      "ed53bfa7-4300-4ab0-ac12-778a90dd4a73",
      "44794498-dfe9-41eb-a888-c346d5634d1c"
    ],
    "type": "check-in"
  },
  {
    "id": "198e2cfd-28d0-4b50-9eb4-493a7d010b67",
    "base_price": 3941,
    "date_from": "2024-10-31T18:45:17.074Z",
    "date_to": "2024-11-02T03:39:17.074Z",
    "destination": "98e910de-0335-4b0f-88af-cde7eca4bb26",
    "is_favorite": true,
    "offers": [],
    "type": "sightseeing"
  },
  {
    "id": "75976b30-cae8-437e-b1b1-02e118e2c158",
    "base_price": 4816,
    "date_from": "2024-11-02T13:44:17.074Z",
    "date_to": "2024-11-03T12:07:17.074Z",
    "destination": "398f4bf0-08ca-4f02-8c49-2e784e1466ed",
    "is_favorite": true,
    "offers": [],
    "type": "sightseeing"
  },
  {
    "id": "e78ca8a7-1d20-48c1-8606-3a4c9f4e85ac",
    "base_price": 3268,
    "date_from": "2024-11-04T07:28:17.074Z",
    "date_to": "2024-11-05T06:00:17.074Z",
    "destination": "98e910de-0335-4b0f-88af-cde7eca4bb26",
    "is_favorite": false,
    "offers": [
      "9dca0ca2-966e-4718-8d14-3ef7f121fa0a"
    ],
    "type": "bus"
  },
  {
    "id": "69f13e92-4374-4130-8a6d-cc2e47b9b79e",
    "base_price": 2827,
    "date_from": "2024-11-06T18:40:17.074Z",
    "date_to": "2024-11-08T10:00:17.074Z",
    "destination": "13ddcced-bab4-4593-8848-2457ef02d2c6",
    "is_favorite": false,
    "offers": [],
    "type": "check-in"
  },
  {
    "id": "2e6d1dca-b745-4965-939a-cdb2b206c8fc",
    "base_price": 5995,
    "date_from": "2024-11-09T19:17:17.074Z",
    "date_to": "2024-11-10T20:15:17.074Z",
    "destination": "2598d3f0-f078-405b-a0e1-3c8b8b368f5a",
    "is_favorite": true,
    "offers": [
      "5570fb65-dbd2-490c-bc73-10eba5faed57",
      "a4940f3c-ce6d-45e1-9fb5-43dc5e6c343f",
      "2ee81745-5b9c-479c-896b-09783e6917ec"
    ],
    "type": "ship"
  },
  {
    "id": "5c64404b-7b39-4c91-8fb2-e36bf81029ba",
    "base_price": 3614,
    "date_from": "2024-11-12T13:37:17.074Z",
    "date_to": "2024-11-14T01:49:17.074Z",
    "destination": "35834a98-0e4d-4fcd-8cdc-69cc7e48c365",
    "is_favorite": true,
    "offers": [
      "6972c573-f47b-4325-a582-e1cf73e35958",
      "2b5b3ae7-1305-4b36-a99d-db2dab930120"
    ],
    "type": "taxi"
  },
  {
    "id": "13f736e3-d89d-43a1-ad15-6046fecd9c5e",
    "base_price": 1267,
    "date_from": "2024-11-16T02:44:17.074Z",
    "date_to": "2024-11-16T10:50:17.074Z",
    "destination": "2598d3f0-f078-405b-a0e1-3c8b8b368f5a",
    "is_favorite": false,
    "offers": [],
    "type": "taxi"
  },
  {
    "id": "aec71330-e56a-43ae-8850-2773352047e8",
    "base_price": 417,
    "date_from": "2024-11-17T03:16:17.074Z",
    "date_to": "2024-11-18T20:23:17.074Z",
    "destination": "d7897530-315e-45a7-afcf-3e01e4b33169",
    "is_favorite": true,
    "offers": [],
    "type": "sightseeing"
  },
  {
    "id": "e820a3ae-d7d1-45d3-8c8a-5e50a877e115",
    "base_price": 8415,
    "date_from": "2024-11-19T11:42:17.074Z",
    "date_to": "2024-11-21T09:00:17.074Z",
    "destination": "13ddcced-bab4-4593-8848-2457ef02d2c6",
    "is_favorite": false,
    "offers": [
      "f3363117-7d95-47cb-94dd-0554732b1442"
    ],
    "type": "train"
  },
  {
    "id": "7e508f50-bb54-4bc0-82b5-a47981587048",
    "base_price": 2276,
    "date_from": "2024-11-21T22:55:17.074Z",
    "date_to": "2024-11-23T21:05:17.074Z",
    "destination": "8965401b-7372-45d4-b7d1-212eff64c3ce",
    "is_favorite": false,
    "offers": [
      "d2941105-a655-426f-a40f-d482483a0f14",
      "c13277fa-5487-42c8-a64a-c2da79d1d0b8",
      "25767bb6-241f-48bc-8ef8-8104d4392d26",
      "6972c573-f47b-4325-a582-e1cf73e35958",
      "2b5b3ae7-1305-4b36-a99d-db2dab930120"
    ],
    "type": "taxi"
  },
  {
    "id": "f86f2e46-a732-479a-835e-c3668fc3173f",
    "base_price": 4718,
    "date_from": "2024-11-24T04:11:17.074Z",
    "date_to": "2024-11-24T21:20:17.074Z",
    "destination": "c675c4c0-be22-4308-b48d-bb2b83fbf8bf",
    "is_favorite": true,
    "offers": [
      "99d83a2b-5ed5-42c1-b590-f6030c3ce764"
    ],
    "type": "restaurant"
  },
  {
    "id": "5f958d38-dd75-4af5-bff7-f12c211b67bc",
    "base_price": 7246,
    "date_from": "2024-11-25T19:21:17.074Z",
    "date_to": "2024-11-26T03:45:17.074Z",
    "destination": "98e910de-0335-4b0f-88af-cde7eca4bb26",
    "is_favorite": false,
    "offers": [
      "f3363117-7d95-47cb-94dd-0554732b1442"
    ],
    "type": "train"
  },
  {
    "id": "084b1127-3300-4cf1-a05f-517d3f5e9771",
    "base_price": 4464,
    "date_from": "2024-11-27T17:11:17.074Z",
    "date_to": "2024-11-28T10:43:17.074Z",
    "destination": "13ddcced-bab4-4593-8848-2457ef02d2c6",
    "is_favorite": false,
    "offers": [],
    "type": "taxi"
  },
  {
    "id": "908e8f49-74ed-4a1f-897b-fab7147a0353",
    "base_price": 1279,
    "date_from": "2024-11-29T00:01:17.074Z",
    "date_to": "2024-11-30T01:14:17.074Z",
    "destination": "2598d3f0-f078-405b-a0e1-3c8b8b368f5a",
    "is_favorite": false,
    "offers": [
      "c13277fa-5487-42c8-a64a-c2da79d1d0b8",
      "25767bb6-241f-48bc-8ef8-8104d4392d26",
      "6972c573-f47b-4325-a582-e1cf73e35958",
      "2b5b3ae7-1305-4b36-a99d-db2dab930120"
    ],
    "type": "taxi"
  },
  {
    "id": "1957677b-ea8b-4241-8c62-4df27222e669",
    "base_price": 669,
    "date_from": "2024-12-01T02:06:17.074Z",
    "date_to": "2024-12-02T18:51:17.074Z",
    "destination": "2598d3f0-f078-405b-a0e1-3c8b8b368f5a",
    "is_favorite": true,
    "offers": [
      "958489ee-6517-44b5-8235-e3ce477f1724",
      "8c3f890d-82fe-442e-9817-e32da42aeb67",
      "9dca0ca2-966e-4718-8d14-3ef7f121fa0a"
    ],
    "type": "bus"
  },
  {
    "id": "dff497c8-4160-4e0c-8a46-e788380916a6",
    "base_price": 6178,
    "date_from": "2024-12-03T01:39:17.074Z",
    "date_to": "2024-12-03T19:14:17.074Z",
    "destination": "398f4bf0-08ca-4f02-8c49-2e784e1466ed",
    "is_favorite": false,
    "offers": [
      "958489ee-6517-44b5-8235-e3ce477f1724",
      "8c3f890d-82fe-442e-9817-e32da42aeb67",
      "9dca0ca2-966e-4718-8d14-3ef7f121fa0a"
    ],
    "type": "bus"
  },
  {
    "id": "3d9ecd7e-196c-4e5d-8f38-e7270f3899ef",
    "base_price": 3461,
    "date_from": "2024-12-04T17:50:17.074Z",
    "date_to": "2024-12-05T05:57:17.074Z",
    "destination": "f0281b25-7390-47d8-b1bd-c5c4628c4a0a",
    "is_favorite": true,
    "offers": [
      "fa564508-0ce5-4dd4-9bac-26a7476dce52",
      "e8bfc2ed-34fd-45ad-b25e-1c142b853275"
    ],
    "type": "drive"
  },
  {
    "id": "cbd37817-1f5c-4431-8471-9a89cd6d0e93",
    "base_price": 6108,
    "date_from": "2024-12-06T05:15:17.074Z",
    "date_to": "2024-12-06T13:17:17.074Z",
    "destination": "f0281b25-7390-47d8-b1bd-c5c4628c4a0a",
    "is_favorite": false,
    "offers": [
      "2430b58a-83b8-4de9-9e17-29832553f916",
      "1fb92974-efcf-4ab9-b14a-dd6be96116f6",
      "a80bfc1b-4642-4049-8e13-7ad62cd3637d",
      "98a079d2-ed59-4d03-a6e0-3b2e3d834b18"
    ],
    "type": "flight"
  },
  {
    "id": "72d010b6-4e0d-4083-94a6-950352d3890e",
    "base_price": 3883,
    "date_from": "2024-12-08T05:54:17.074Z",
    "date_to": "2024-12-09T04:25:17.074Z",
    "destination": "8965401b-7372-45d4-b7d1-212eff64c3ce",
    "is_favorite": false,
    "offers": [
      "d2941105-a655-426f-a40f-d482483a0f14",
      "c13277fa-5487-42c8-a64a-c2da79d1d0b8",
      "25767bb6-241f-48bc-8ef8-8104d4392d26",
      "6972c573-f47b-4325-a582-e1cf73e35958",
      "2b5b3ae7-1305-4b36-a99d-db2dab930120"
    ],
    "type": "taxi"
  },
  {
    "id": "4910f70f-b07f-4c82-81b5-85dd87607187",
    "base_price": 7962,
    "date_from": "2024-12-10T07:34:17.074Z",
    "date_to": "2024-12-11T08:58:17.074Z",
    "destination": "398f4bf0-08ca-4f02-8c49-2e784e1466ed",
    "is_favorite": false,
    "offers": [],
    "type": "sightseeing"
  },
  {
    "id": "5a89e322-a7b4-4db5-81fb-f1f571a50a98",
    "base_price": 5990,
    "date_from": "2024-12-12T03:47:17.074Z",
    "date_to": "2024-12-13T15:58:17.074Z",
    "destination": "35834a98-0e4d-4fcd-8cdc-69cc7e48c365",
    "is_favorite": true,
    "offers": [
      "2ee81745-5b9c-479c-896b-09783e6917ec"
    ],
    "type": "ship"
  }
]`);

/**
 * Get route of pointsCount points
 * @param { number } [pointsCount=MAX_POINTS_COUNT]
 * @returns { RoutePointData[] }
 */
export const getRandomRouteMock = async (pointsCount = MAX_POINTS_COUNT) => {
  const route = [];

  for (let pointIndex = 0; pointIndex < pointsCount; pointIndex++) {
    route.push(structuredClone(getRandomElementInArray(ROUTE_POINTS)));
  }

  return route;
};

/**
 * @typedef { import('../model/route-model').RoutePointData } RoutePointData
 */

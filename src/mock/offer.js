/**
 * Offers mock
 * @type { OfferModelData[] }
 */
const OFFERS = JSON.parse(
  `
[
  {
    "type": "taxi",
    "offers": [
      {
        "id": "d2941105-a655-426f-a40f-d482483a0f14",
        "title": "<h1>Upgrade to a business class</h1>",
        "price": 86
      },
      {
        "id": "c13277fa-5487-42c8-a64a-c2da79d1d0b8",
        "title": "<h1>Choose the radio station</h1>",
        "price": 47
      },
      {
        "id": "25767bb6-241f-48bc-8ef8-8104d4392d26",
        "title": "<h1>Choose temperature</h1>",
        "price": 33
      },
      {
        "id": "6972c573-f47b-4325-a582-e1cf73e35958",
        "title": "<h1>Drive quickly, I'm in a hurry</h1>",
        "price": 144
      },
      {
        "id": "2b5b3ae7-1305-4b36-a99d-db2dab930120",
        "title": "<h1>Drive slowly</h1>",
        "price": 199
      }
    ]
  },
  {
    "type": "bus",
    "offers": [
      {
        "id": "958489ee-6517-44b5-8235-e3ce477f1724",
        "title": "Infotainment system",
        "price": 186
      },
      {
        "id": "8c3f890d-82fe-442e-9817-e32da42aeb67",
        "title": "Order meal",
        "price": 56
      },
      {
        "id": "9dca0ca2-966e-4718-8d14-3ef7f121fa0a",
        "title": "Choose seats",
        "price": 104
      }
    ]
  },
  {
    "type": "train",
    "offers": [
      {
        "id": "3c43187c-cd18-452d-a50a-823b0df4f83b",
        "title": "Book a taxi at the arrival point",
        "price": 59
      },
      {
        "id": "7d3c2199-2aa4-46b6-b19c-1e40f8a3f9d4",
        "title": "Order a breakfast",
        "price": 101
      },
      {
        "id": "f3363117-7d95-47cb-94dd-0554732b1442",
        "title": "Wake up at a certain time",
        "price": 86
      }
    ]
  },
  {
    "type": "flight",
    "offers": [
      {
        "id": "25de60b7-6aed-4942-9550-a0424654ba3f",
        "title": "Choose meal",
        "price": 140
      },
      {
        "id": "f54787c4-6a07-4dc2-81d3-e7f8c1ffca10",
        "title": "Choose seats",
        "price": 199
      },
      {
        "id": "2430b58a-83b8-4de9-9e17-29832553f916",
        "title": "Upgrade to comfort class",
        "price": 58
      },
      {
        "id": "1fb92974-efcf-4ab9-b14a-dd6be96116f6",
        "title": "Upgrade to business class",
        "price": 78
      },
      {
        "id": "a80bfc1b-4642-4049-8e13-7ad62cd3637d",
        "title": "Add luggage",
        "price": 70
      },
      {
        "id": "98a079d2-ed59-4d03-a6e0-3b2e3d834b18",
        "title": "Business lounge",
        "price": 181
      }
    ]
  },
  {
    "type": "check-in",
    "offers": [
      {
        "id": "b1025907-4092-4ae0-a00b-8a7709c13bb0",
        "title": "Choose the time of check-in",
        "price": 178
      },
      {
        "id": "a3f277e9-d7c1-49be-85b4-3a50b885edbd",
        "title": "Choose the time of check-out",
        "price": 195
      },
      {
        "id": "234432b2-bc69-48c0-841c-e8dc7e8a0119",
        "title": "Add breakfast",
        "price": 197
      },
      {
        "id": "ed53bfa7-4300-4ab0-ac12-778a90dd4a73",
        "title": "Laundry",
        "price": 193
      },
      {
        "id": "44794498-dfe9-41eb-a888-c346d5634d1c",
        "title": "Order a meal from the restaurant",
        "price": 96
      }
    ]
  },
  {
    "type": "sightseeing",
    "offers": []
  },
  {
    "type": "ship",
    "offers": [
      {
        "id": "8e79ea2e-8700-48a7-bed0-3bb1996399e0",
        "title": "Choose meal",
        "price": 199
      },
      {
        "id": "2be7313e-e030-47e8-8579-027085436e6f",
        "title": "Choose seats",
        "price": 100
      },
      {
        "id": "aa424fa0-5a00-4580-91f3-a7d08c8098d1",
        "title": "Upgrade to comfort class",
        "price": 40
      },
      {
        "id": "5570fb65-dbd2-490c-bc73-10eba5faed57",
        "title": "Upgrade to business class",
        "price": 67
      },
      {
        "id": "a4940f3c-ce6d-45e1-9fb5-43dc5e6c343f",
        "title": "Add luggage",
        "price": 49
      },
      {
        "id": "2ee81745-5b9c-479c-896b-09783e6917ec",
        "title": "Business lounge",
        "price": 85
      }
    ]
  },
  {
    "type": "drive",
    "offers": [
      {
        "id": "fa564508-0ce5-4dd4-9bac-26a7476dce52",
        "title": "With automatic transmission",
        "price": 121
      },
      {
        "id": "e8bfc2ed-34fd-45ad-b25e-1c142b853275",
        "title": "With air conditioning",
        "price": 133
      }
    ]
  },
  {
    "type": "restaurant",
    "offers": [
      {
        "id": "cb6b44c3-88e9-407a-af76-f2ab8af12bd3",
        "title": "Choose live music",
        "price": 53
      },
      {
        "id": "99d83a2b-5ed5-42c1-b590-f6030c3ce764",
        "title": "Choose VIP area",
        "price": 197
      }
    ]
  }
]`
);

export const getOffersMock = async () => structuredClone(OFFERS);

/**
 * OfferModelData
 * @typedef { import('../model/offer-model').OfferModelData } OfferModelData
 */

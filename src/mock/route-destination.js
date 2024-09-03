const ROUTE_DESTINATIONS = JSON.parse(
  `
[
  {
    "id": "8965401b-7372-45d4-b7d1-212eff64c3ce",
    "description": "Madrid - full of of cozy canteens where you can try the best coffee in the Middle East",
    "name": "Madrid",
    "pictures": []
  },
  {
    "id": "2598d3f0-f078-405b-a0e1-3c8b8b368f5a",
    "description": "Oslo - with a beautiful old town",
    "name": "Oslo",
    "pictures": []
  },
  {
    "id": "35834a98-0e4d-4fcd-8cdc-69cc7e48c365",
    "description": "Munich - for those who value comfort and coziness",
    "name": "Munich",
    "pictures": [
      {
        "src": "https://24.objects.htmlacademy.pro/static/destinations/5.jpg",
        "description": "Munich with a beautiful old town"
      },
      {
        "src": "https://24.objects.htmlacademy.pro/static/destinations/18.jpg",
        "description": "Munich with crowded streets"
      },
      {
        "src": "https://24.objects.htmlacademy.pro/static/destinations/2.jpg",
        "description": "Munich with an embankment of a mighty river as a centre of attraction"
      },
      {
        "src": "https://24.objects.htmlacademy.pro/static/destinations/8.jpg",
        "description": "Munich famous for its crowded street markets with the best street food in Asia"
      },
      {
        "src": "https://24.objects.htmlacademy.pro/static/destinations/11.jpg",
        "description": "Munich middle-eastern paradise"
      }
    ]
  },
  {
    "id": "f0281b25-7390-47d8-b1bd-c5c4628c4a0a",
    "description": "Monaco - in a middle of Europe",
    "name": "Monaco",
    "pictures": [
      {
        "src": "https://24.objects.htmlacademy.pro/static/destinations/9.jpg",
        "description": "Monaco a perfect place to stay with a family"
      },
      {
        "src": "https://24.objects.htmlacademy.pro/static/destinations/4.jpg",
        "description": "Monaco a perfect place to stay with a family"
      },
      {
        "src": "https://24.objects.htmlacademy.pro/static/destinations/11.jpg",
        "description": "Monaco for those who value comfort and coziness"
      }
    ]
  },
  {
    "id": "398f4bf0-08ca-4f02-8c49-2e784e1466ed",
    "description": "Den Haag - with crowded streets",
    "name": "Den Haag",
    "pictures": [
      {
        "src": "https://24.objects.htmlacademy.pro/static/destinations/17.jpg",
        "description": "Den Haag is a beautiful city"
      }
    ]
  },
  {
    "id": "13ddcced-bab4-4593-8848-2457ef02d2c6",
    "description": "Moscow - famous for its crowded street markets with the best street food in Asia",
    "name": "Moscow",
    "pictures": [
      {
        "src": "https://24.objects.htmlacademy.pro/static/destinations/19.jpg",
        "description": "Moscow in a middle of Europe"
      },
      {
        "src": "https://24.objects.htmlacademy.pro/static/destinations/9.jpg",
        "description": "Moscow middle-eastern paradise"
      },
      {
        "src": "https://24.objects.htmlacademy.pro/static/destinations/18.jpg",
        "description": "Moscow in a middle of Europe"
      },
      {
        "src": "https://24.objects.htmlacademy.pro/static/destinations/13.jpg",
        "description": "Moscow with crowded streets"
      }
    ]
  },
  {
    "id": "98e910de-0335-4b0f-88af-cde7eca4bb26",
    "description": "Valencia - famous for its crowded street markets with the best street food in Asia",
    "name": "Valencia",
    "pictures": [
      {
        "src": "https://24.objects.htmlacademy.pro/static/destinations/4.jpg",
        "description": "Valencia with a beautiful old town"
      },
      {
        "src": "https://24.objects.htmlacademy.pro/static/destinations/5.jpg",
        "description": "Valencia in a middle of Europe"
      },
      {
        "src": "https://24.objects.htmlacademy.pro/static/destinations/11.jpg",
        "description": "Valencia a perfect place to stay with a family"
      },
      {
        "src": "https://24.objects.htmlacademy.pro/static/destinations/17.jpg",
        "description": "Valencia is a beautiful city"
      }
    ]
  },
  {
    "id": "c675c4c0-be22-4308-b48d-bb2b83fbf8bf",
    "description": "Rome - in a middle of Europe",
    "name": "Rome",
    "pictures": [
      {
        "src": "https://24.objects.htmlacademy.pro/static/destinations/4.jpg",
        "description": "Rome for those who value comfort and coziness"
      },
      {
        "src": "https://24.objects.htmlacademy.pro/static/destinations/6.jpg",
        "description": "Rome for those who value comfort and coziness"
      },
      {
        "src": "https://24.objects.htmlacademy.pro/static/destinations/17.jpg",
        "description": "Rome in a middle of Europe"
      }
    ]
  },
  {
    "id": "410df6a2-db0e-48da-a7b1-0ff5affbbb84",
    "description": "Berlin - middle-eastern paradise",
    "name": "Berlin",
    "pictures": [
      {
        "src": "https://24.objects.htmlacademy.pro/static/destinations/7.jpg",
        "description": "Berlin famous for its crowded street markets with the best street food in Asia"
      },
      {
        "src": "https://24.objects.htmlacademy.pro/static/destinations/12.jpg",
        "description": "Berlin is a beautiful city"
      }
    ]
  },
  {
    "id": "d7897530-315e-45a7-afcf-3e01e4b33169",
    "description": "Rotterdam - a true asian pearl",
    "name": "Rotterdam",
    "pictures": [
      {
        "src": "https://24.objects.htmlacademy.pro/static/destinations/5.jpg",
        "description": "Rotterdam for those who value comfort and coziness"
      },
      {
        "src": "https://24.objects.htmlacademy.pro/static/destinations/14.jpg",
        "description": "Rotterdam famous for its crowded street markets with the best street food in Asia"
      },
      {
        "src": "https://24.objects.htmlacademy.pro/static/destinations/17.jpg",
        "description": "Rotterdam with a beautiful old town"
      }
    ]
  }
]`
);

export const getDestinationsMock = async () => structuredClone(ROUTE_DESTINATIONS);

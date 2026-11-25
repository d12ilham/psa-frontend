// ABS December quarter 2025, original Table 3, Persons quarterly rows 67,69-72, columns B:I.
// Unit confirmed by title A3 and footnote A91: rate per 100,000 adult population.
// All 40 values from supplied tidy.csv individually matched to original workbook.
export const stateImprisonmentRates = [
  {
    "jurisdiction": "NSW",
    "values": [
      190.7,
      196.9,
      196.9,
      191.7,
      191.7
    ]
  },
  {
    "jurisdiction": "VIC",
    "values": [
      107.3,
      111.3,
      116.7,
      118.4,
      122.0
    ]
  },
  {
    "jurisdiction": "QLD",
    "values": [
      247.6,
      254.5,
      255.6,
      257.7,
      258.1
    ]
  },
  {
    "jurisdiction": "SA",
    "values": [
      223.6,
      227.6,
      227.0,
      221.1,
      223.6
    ]
  },
  {
    "jurisdiction": "WA",
    "values": [
      339.8,
      354.8,
      359.9,
      356.0,
      356.2
    ]
  },
  {
    "jurisdiction": "TAS",
    "values": [
      168.5,
      166.6,
      170.2,
      180.7,
      183.4
    ]
  },
  {
    "jurisdiction": "NT",
    "values": [
      1238.0,
      1381.6,
      1410.9,
      1426.0,
      1409.4
    ]
  },
  {
    "jurisdiction": "ACT",
    "values": [
      107.3,
      108.9,
      111.1,
      116.8,
      121.6
    ]
  }
] as const;

import { readonlyURL } from 'readonly-types'

type WMOCategoriesImageUrls = {
  readonly imageUrl: string | undefined,
  WMOCategories: string[],
}

const getURLString = (internalUrl: string): string | undefined =>
  readonlyURL(internalUrl, import.meta.url)?.href

const WMOCategoriesImages: WMOCategoriesImageUrls[] = [
  {
    imageUrl: '@assets/images/weather/sunny-bg.jpeg',
    WMOCategories: ['Clear sky', 'Mainly clear'],
  },
  {
    imageUrl: getURLString('@assets/images/weather/cloudy-bg.jpeg'),
    WMOCategories: ['Partly cloudy', 'Overcast', 'Foggy', 'Depositing rime fog'],
  },
  {
    imageUrl: getURLString('@assets/images/weather/rainy-bg.jpeg'),
    WMOCategories: [
      'Slight Rain',
      'Moderate Rain',
      'Heavy Rain',
      'Light Freezing Rain',
      'Heavy Freezing Rain',
      'Slight Rain showers',
      'Moderate Rain showers',
      'Violent Rain showers',
      'Slight snow showers ',
      'Heavy snow showers ',
    ],
  },
  {
    imageUrl: getURLString('@assets/images/weather/snowy-bg.jpeg'),
    WMOCategories: ['Slight Snow fall', 'Moderate Snow fall', 'Heavy Snow fall', 'Snow grains'],
  },
  {
    imageUrl: getURLString('@assets/images/weather/foggy-bg.jpeg'),
    WMOCategories: [
      'Light Drizzle',
      'Moderate Drizzle',
      'Dense Drizzle',
      'Light Freezing Drizzle',
      'Dense Freezing Drizzle',
    ],
  },
  {
    imageUrl: getURLString('@assets/images/weather/thunderstorm-bg.jpeg'),
    WMOCategories: [
      'Thunderstorm with slight hail',
      'Thunderstorm with hail',
      'Thunderstorm with heavy hail',
    ],
  },
]

const getImageNameByWMOCategories = (WMOCategory: string): string | undefined => {
  const image =
    WMOCategoriesImages.find(wmoCategoriesImage =>
      wmoCategoriesImage.WMOCategories.some(category => WMOCategory.includes(category))
    ) ?? undefined

  return image
    ? image.imageUrl
    : WMOCategoriesImages[0].imageUrl
}

export { getImageNameByWMOCategories }

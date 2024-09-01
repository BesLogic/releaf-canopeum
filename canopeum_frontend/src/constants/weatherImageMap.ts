import { type ReadonlyURL, readonlyURL } from 'readonly-types'

type WMOCategoriesImageUrls = {
  readonly imageUrl: ReadonlyURL | undefined,
  WMOCategories: string[],
}

const WMOCategoriesImages: WMOCategoriesImageUrls[] = [
  {
    imageUrl: readonlyURL('../assets/images/weather/sunny-bg.jpeg', import.meta.url),
    WMOCategories: ['Clear sky', 'Mainly clear'],
  },
  {
    imageUrl: readonlyURL('../assets/images/weather/cloudy-bg.jpeg', import.meta.url),
    WMOCategories: ['Partly cloudy', 'Overcast', 'Foggy', 'Depositing rime fog'],
  },
  {
    imageUrl: readonlyURL('../assets/images/weather/rainy-bg.jpeg', import.meta.url),
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
    imageUrl: readonlyURL('../assets/images/weather/snowy-bg.jpeg', import.meta.url),
    WMOCategories: ['Slight Snow fall', 'Moderate Snow fall', 'Heavy Snow fall', 'Snow grains'],
  },
  {
    imageUrl: readonlyURL('../assets/images/weather/foggy-bg.jpeg', import.meta.url),
    WMOCategories: [
      'Light Drizzle',
      'Moderate Drizzle',
      'Dense Drizzle',
      'Light Freezing Drizzle',
      'Dense Freezing Drizzle',
    ],
  },
  {
    imageUrl: readonlyURL('../assets/images/weather/thunderstorm-bg.jpeg', import.meta.url),
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

  return image && image.imageUrl
    ? image.imageUrl.href
    : WMOCategoriesImages[0].imageUrl?.href
}

export { getImageNameByWMOCategories }

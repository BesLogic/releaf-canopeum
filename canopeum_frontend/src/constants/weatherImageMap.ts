type WMOCategoriesImageUrls = {
  readonly imageUrl: string | undefined,
  WMOCategories: string[],
}

const WMOCategoriesImages: WMOCategoriesImageUrls[] = [
  {
    imageUrl: new URL('@assets/images/weather/sunny-bg.jpeg', import.meta.url).href,
    WMOCategories: ['Clear sky', 'Mainly clear'],
  },
  {
    imageUrl: new URL('@assets/images/weather/cloudy-bg.jpeg', import.meta.url).href,
    WMOCategories: ['Partly cloudy', 'Overcast', 'Foggy', 'Depositing rime fog'],
  },
  {
    imageUrl: new URL('@assets/images/weather/rainy-bg.jpeg', import.meta.url).href,
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
    imageUrl: new URL('@assets/images/weather/snowy-bg.jpeg', import.meta.url).href,
    WMOCategories: ['Slight Snow fall', 'Moderate Snow fall', 'Heavy Snow fall', 'Snow grains'],
  },
  {
    imageUrl: new URL('@assets/images/weather/foggy-bg.jpeg', import.meta.url).href,
    WMOCategories: [
      'Light Drizzle',
      'Moderate Drizzle',
      'Dense Drizzle',
      'Light Freezing Drizzle',
      'Dense Freezing Drizzle',
    ],
  },
  {
    imageUrl: new URL('@assets/images/weather/thunderstorm-bg.jpeg', import.meta.url).href,
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

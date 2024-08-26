type WMOCategoriesImageUrls = {
  image_url: string,
  WMOCategories: string[],
}

const WMOCategoriesImages: WMOCategoriesImageUrls[] = [
  {
    image_url: new URL('@assets/images/weather/sunny-bg.jpeg', import.meta.url).href,
    WMOCategories: ['Clear sky', 'Mainly clear'],
  },
  {
    image_url: new URL('cloudy-bg.jpeg', import.meta.url).href,
    WMOCategories: ['Partly cloudy', 'Overcast', 'Foggy', 'Depositing rime fog'],
  },
  {
    image_url: new URL('rainy-bg.jpeg', import.meta.url).href,
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
    image_url: new URL('snowy-bg.jpeg', import.meta.url).href,
    WMOCategories: ['Slight Snow fall', 'Moderate Snow fall', 'Heavy Snow fall', 'Snow grains'],
  },
  {
    image_url: new URL('foggy-bg.jpeg', import.meta.url).href,
    WMOCategories: [
      'Light Drizzle',
      'Moderate Drizzle',
      'Dense Drizzle',
      'Light Freezing Drizzle',
      'Dense Freezing Drizzle',
    ],
  },
  {
    image_url: new URL('thunderstorm-bg.jpeg', import.meta.url).href,
    WMOCategories: [
      'Thunderstorm with slight hail',
      'Thunderstorm with hail',
      'Thunderstorm with heavy hail',
    ],
  },
]

const getImageNameByWMOCategories = (WMOCategory: string): string => {
  const image = WMOCategoriesImages.find(image =>
    image.WMOCategories.some(category => WMOCategory.includes(category))
  )
  return image ? image.image_url : WMOCategoriesImages[0].image_url
}

export { getImageNameByWMOCategories }

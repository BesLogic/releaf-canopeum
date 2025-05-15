import cloudyURL from '@assets/images/weather/cloudy-bg.jpeg'
import foggyURL from '@assets/images/weather/foggy-bg.jpeg'
import rainyURL from '@assets/images/weather/rainy-bg.jpeg'
import snowyURL from '@assets/images/weather/snowy-bg.jpeg'
import sunnyURL from '@assets/images/weather/sunny-bg.jpeg'
import thunderstormURL from '@assets/images/weather/thunderstorm-bg.jpeg'

type WMOCategoriesImageUrls = {
  readonly imageUrl: string | undefined,
  WMOCategories: string[],
}

const WMOCategoriesImages: WMOCategoriesImageUrls[] = [
  {
    imageUrl: sunnyURL,
    WMOCategories: ['Clear sky', 'Mainly clear'],
  },
  {
    imageUrl: cloudyURL,
    WMOCategories: ['Partly cloudy', 'Overcast', 'Foggy', 'Depositing rime fog'],
  },
  {
    imageUrl: rainyURL,
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
    imageUrl: snowyURL,
    WMOCategories: ['Slight Snow fall', 'Moderate Snow fall', 'Heavy Snow fall', 'Snow grains'],
  },
  {
    imageUrl: foggyURL,
    WMOCategories: [
      'Light Drizzle',
      'Moderate Drizzle',
      'Dense Drizzle',
      'Light Freezing Drizzle',
      'Dense Freezing Drizzle',
    ],
  },
  {
    imageUrl: thunderstormURL,
    WMOCategories: [
      'Thunderstorm with slight hail',
      'Thunderstorm with hail',
      'Thunderstorm with heavy hail',
    ],
  },
]

const getImageNameByWMOCategories = (WMOCategory: string) =>
  WMOCategoriesImages
    .find(wmoCategoriesImage => wmoCategoriesImage.WMOCategories.includes(WMOCategory))
    ?.imageUrl
    ?? WMOCategoriesImages[0].imageUrl

export { getImageNameByWMOCategories }

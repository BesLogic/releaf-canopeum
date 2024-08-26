import openmeteo_requests
import requests_cache
from retry_requests import retry

WMO_Categories = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing rime fog",
    51: "Light Drizzle",
    53: "Moderate Drizzle",
    55: "Dense Drizzle",
    56: "Light Freezing Drizzle",
    57: "Dense Freezing Drizzle",
    61: "Slight Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    66: "Light Freezing Rain",
    67: "Heavy Freezing Rain",
    71: "Slight Snow fall",
    73: "Moderate Snow fall",
    75: "Heavy Snow fall",
    77: "Snow grains",
    80: "Slight Rain showers",
    81: "Moderate Rain showers",
    82: "Violent Rain showers",
    85: "Slight snow showers ",
    86: "Heavy snow showers ",
    95: "Thunderstorm with slight hail",
    96: "Thunderstorm with hail",
    99: "Thunderstorm with heavy hail",
}


def get_weather_data(latitude: float, longitude: float):
    cache_session = requests_cache.CachedSession(".cache", expire_after=3600)
    retry_session = retry(cache_session, retries=5, backoff_factor=0.2)
    openmeteo = openmeteo_requests.Client(session=retry_session)

    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": ["temperature_2m", "relative_humidity_2m", "weathercode"],
    }
    responses = openmeteo.weather_api(url, params=params)

    response = responses[0]
    current = response.Current()
    temperature_value = current.Variables(0).Value()  # pyright: ignore[reportOptionalMemberAccess]
    current_temperature = round(temperature_value, 3) if temperature_value is not None else 0.0
    humidity_value = current.Variables(1).Value()  # pyright: ignore[reportOptionalMemberAccess]
    current_relative_humidity = round(humidity_value, 3) if humidity_value is not None else 0.0
    current_description = WMO_Categories.get(int(current.Variables(2).Value()), "Unknown weather")  # pyright: ignore[reportOptionalMemberAccess]

    return {
        "temperature": current_temperature,
        "humidity": current_relative_humidity,
        "description": current_description,
    }

const axios = require('axios').default;
const redis = require('../../src/clients').redis

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const API_KEY_ENC = process.env.NEXT_PUBLIC_API_KEY_ENC
const API_KEY_DEC = process.env.NEXT_PUBLIC_API_KEY_DEC

async function fetchCities() {
  const cities = await redis.getAsync('cities') || []
  if (cities.length > 0)
    return cities
  for (let page = 1; ; ++page) {
    const {data: citiesRes} = await axios.get(`${API_BASE_URL}/getCityList`, {
      params: {
        'ServiceKey': API_KEY_DEC,
        'type': 'json',
        page,
      }
    })
    if (citiesRes.data.list.length == 0)
      break
    cities.push(...citiesRes.data.list)
  }
  await redis.setAsync('cities', JSON.stringify(cities), 'EX', 60 * 60 * 24)
  return JSON.parse(cities)
}

export default async (req, res) => {
  const cities = await fetchCities()
  return res.status(200).json(cities)
}
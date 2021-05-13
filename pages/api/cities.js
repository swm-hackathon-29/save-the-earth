const axios = require('axios').default;
const redis = require('../../src/clients').redis

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const API_KEY_ENC = process.env.NEXT_PUBLIC_API_KEY_ENC
const API_KEY_DEC = process.env.NEXT_PUBLIC_API_KEY_DEC

async function fetchCities() {
  const cities = JSON.parse(await redis.getAsync('cities')) || {}
  if (Object.keys(cities).length > 0)
    return cities
  for (let page = 1; ; ++page) {
    const {data: {data: citiesRes}} = await axios.get(`${API_BASE_URL}/getCityList`, {
      params: {
        'ServiceKey': API_KEY_DEC,
        'type': 'json',
        page,
      }
    })
    if (citiesRes.list === null || citiesRes.list.length == 0)
      break
    for (const city of citiesRes.list)
      cities[city.cityCode] = city
  }
  await redis.setAsync('cities', JSON.stringify(cities), 'EX', 60 * 60 * 24)
  return cities
}

export default async (req, res) => {
  const cities = await fetchCities()
  return res.status(200).json(cities)
}

module.exports.fetchCities = fetchCities

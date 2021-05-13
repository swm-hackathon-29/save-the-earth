const axios = require('axios').default;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const API_KEY_ENC = process.env.NEXT_PUBLIC_API_KEY_ENC
const API_KEY_DEC = process.env.NEXT_PUBLIC_API_KEY_DEC

export default async (req, res) => {
  const charges = (await axios.get(`${API_BASE_URL}/getCommonList`, {
    params: {
      'ServiceKey': API_KEY_DEC,
      'type': 'json',
      'groupCode': '01',
    }
  })).data.data.list
  const machines = (await axios.get(`${API_BASE_URL}/getCommonList`, {
    params: {
      'ServiceKey': API_KEY_DEC,
      'type': 'json',
      'groupCode': '11',
    }
  })).data.data.list
  return res.status(200).json({charges, machines})
}

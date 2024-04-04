import axios from 'axios'

// get all users 

export const getAllusers =  async () => {
  const req = await axios.get('/user/all')
  const data = await req.data
  try {
    if(data) return data
  } catch (error) {
    return error.response.message
  }
}


//  async axios javascript function?
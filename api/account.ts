import Axios from 'axios'


export const axiosWithCredentials = Axios.create({
	baseURL: process.env.NEXT_PUBLIC_BE_URL
})

export const login = () => {
	return axiosWithCredentials.post('/account/login').then(res=> res.data)
}
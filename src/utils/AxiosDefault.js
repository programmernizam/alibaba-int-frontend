import axios from 'axios';


export const axiosFileUpload = axios.create({
  // eslint-disable-next-line no-undef
  baseURL: process.env.REACT_APP_API_URL,
  // headers: {
  //   'Content-Type': 'application/json',
  //   'Content-Type': 'multipart/form-data',
  // }
});


export const axiosInstance = axios.create({
  // eslint-disable-next-line no-undef
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const instanceAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    axiosInstance.defaults.headers.common['Authorization'] = ""
  }
};
import axios from 'axios';
import { BASE_URL } from  './url'
import dotenv from 'dotenv';
import { toast } from 'react-toastify';

const getBaseUrl = () => {
    console.log(`${import.meta.env.VITE_PUBLIC_BASE_URL}`, 'api url')
    // Implement logic to fetch or determine the base URL dynamically
    return import.meta.env.VITE_PUBLIC_BASE_URL || '';
  };

export const instance = axios.create({
    baseURL: `${getBaseUrl()}/`,
    timeout: 5000,
    headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
    }
})


instance.interceptors.request.use(function(config){
    const token = typeof window !== 'undefined' && localStorage.getItem('token')
    const bearerToken = token;
    return{
        ...config,
        headers: {
            authorization:  bearerToken
        }
    }
})

const responseBody = (response) => response.data;

const error = (error) => {
    if(error?.response?.status === 401){
        if (typeof window !== 'undefined') {
        localStorage.removeItem("token");
        localStorage.removeItem("user");;
        }
        return toast.error('session expired, unauthourized!, please login again to continue')
    }

    if(error?.response){
        // do nothing 
    }

    if(error?.request){
        return {status: false, message: 'some error occured, please try again'};
    }else{
        return {status: false, message: 'some error occured, please try again'};
    }
}

const requests = {
    get: (url, body, headers) => 
        instance.get(url, body, headers).then(responseBody).catch(error),
    post:  (url, body, headers) => 
        instance.post(url, body, headers).then(responseBody).catch(error),
    put:  (url, body, headers) => 
        instance.put(url, body, headers).then(responseBody).catch(error),
    patch:  (url, body) => 
        instance.patch(url, body).then(responseBody).catch(error),
    delete:  (url) => 
        instance.delete(url).then(responseBody).catch(error),
    download:  (url, headers) => 
        instance.get(url, {responseType : 'blob'}, headers).then(responseBody).catch(error),
}

export default requests;
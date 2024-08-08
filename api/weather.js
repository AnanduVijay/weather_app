import axios from "axios";
// import { apiKey } from "../constants";
const apiKey = '8cee8192928d45c29ed80903240808';
 
const forecastEndpoint = params => `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.cityName}&days=${params.days}=no&alerts=no`;
const locationsEndpoint = params => `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.cityName}`;

const apiCall = async (endpoint)=>{
    const options  = {
        method: 'GET',
        url : endpoint
    }
    try {
        const response = await axios.request(options);
        return response.data;
    }catch(err){
        console.log('error:', err);
        return null;

    }
}


export const fetchweatherForecast = params=>{
    
    return apiCall(forecastEndpoint(params));
}

export const fetchLocation = params=>{
    return apiCall(locationsEndpoint(params));
}

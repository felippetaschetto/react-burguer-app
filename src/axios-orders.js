import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://burger-app-4afdb.firebaseio.com/'
});

//instance.defaults.headers.common['Authorization'] = 'Auth Token 2';

export default instance;
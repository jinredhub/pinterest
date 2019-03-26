import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://trainscheduler-d3a50.firebaseio.com/-KsvSXlLmZRq_i-pAUhx'
});

export default instance;
import axios from 'axios'
import {BASE_URL} from '../lib/store'
export class TranslateController {
    err = {}
    constructor() {
        this.err.isError = false
        this.err.message = ""
        this.err.code = ""
    }
    
    async reqTranslate(image, source, target, config) {
        //axios here
        let req = await axios.post(`${BASE_URL}/upload`, {image, source, target}, config).catch(error => {
            this.err.isError = true
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                this.err.message = error.response.data.message
                this.err.code = error.response.status
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                this.err.message = JSON.stringify(error.request)
                this.err.code = 500
            } else {
                // Something happened in setting up the request that triggered an Error
                this.err.message = error.message
            }
        })
        
        if (req) {     
            this.err.isError = false
            this.err.message = ""
            this.err.code = ""
            return req.data
        }
    }

    getError() {
        return this.err
    }
}
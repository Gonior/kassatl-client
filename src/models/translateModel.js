import {TranslateController} from '../controller/translateController'
export class TranslateModel extends TranslateController {
    parsedtext = ""
    furigana = ""
    translate = ""
    romanji = ""
    constructor() {
        super()
        
    }
    async getTranslate(image, source, target, config, endpoint) {    
        try {
            
            let data = await this.reqTranslate(image, source, target, config, endpoint)
            
            this.parsedText = data.parsedText,
            this.furigana = data.furigana,
            this.translate = data.translate,
            this.romanji = data.romanji
            
        } catch (error) {
            return 
        }
    }

    getProperty() {
        let obj = {
            parsedText : this.parsedText,
            furigana : this.furigana,
            translate : this.translate,
            romanji : this.romanji
        }
        return obj
    }
}
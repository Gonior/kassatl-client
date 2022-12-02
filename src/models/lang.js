import {writable} from 'svelte/store'
export class Lang{

    config = writable()
    
    constructor() {
        this.initConfig()
        this.config.subscribe(value => localStorage.configLang = JSON.stringify(value))

        this.source = JSON.parse(localStorage.configLang).source
        this.target = JSON.parse(localStorage.configLang).target
        
    }

    initConfig() {
        
        if (localStorage.configLang) {
            if (Object.keys(JSON.parse(localStorage.configLang)).length !== 0) {
                this.config.set(JSON.parse(localStorage.configLang))
            }
            else this.config.set({source : 'ja', target : 'id'})
        } else {
            this.config.set({source : 'ja', target : 'id'})
        }
        
    }
    switchLang() {
        let temp = this.source
        this.source = this.target   
        this.target = temp
        this.config.set({source : this.source, target:this.target})
    }

    getSource() {
        return Lang.getProperty(this.source)
    }

    static getProperty(code) {
        let result = {}
        
        if (code === "ja") {
            result.flag = 'Flag_of_Japan.svg'
            result.text = 'Jepang'
            result.alt = 'Flag of Japan'
            
        } else {
            result.flag = 'Flag_of_Indonesia.svg'
            result.text = 'Indonesia'
            result.alt = 'Flag of Indonesia'
        }
        result.code = code
        return result
    }
    getTarget() {
        
        return Lang.getProperty(this.target)
    }
}

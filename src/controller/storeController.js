import { Lang } from "../models/lang"

export class StoreController {
    constructor() {
        
        this.initConfig()
    }
    initConfig() {
        //init localStorage
        if (!localStorage.favorites) localStorage.setItem('favorites', JSON.stringify(str))
    }

    addToLocalStorage(str) {
        localStorage.setItem('favorites', JSON.stringify(str))
    }

    getListFavorites() {
        // console.log(localStorage.favorites)
        return JSON.parse(localStorage.favorites)
    }

    updateListFavorites(id) {
        let favs = this.getListFavorites()
        // console.log(favs)

        let favsFilter = favs.filter(x=> x.id !== id)

        this.addToLocalStorage(favsFilter)
    }

    addListFavorites(obj) {
        obj.id = `ID-${Math.random().toString(16).slice(2)}`
        obj.source = {...Lang.getProperty(obj.source)}
        obj.target = {...Lang.getProperty(obj.target)}
        let favs = this.getListFavorites()
        favs.push(obj)
        this.addToLocalStorage(favs)
        return obj.id
    }

    getDetailFavorites(id) {
        let favs = this.getListFavorites()
        // console.log(favs)

        let fav = favs.find(x=> x.id === id)
        // console.log(fav)
        return fav
    }

    copyToClipboard(text, callback) {
        
        navigator.clipboard.writeText(text)
            .then(() => {
                callback()
            })
            .catch(() => {
                alert("terjadi kesalahan");
            });
        
    }

}
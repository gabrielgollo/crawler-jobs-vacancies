const axios = require('axios');

export class RequestService{
    url: string;
    cheerio: (data:any, getPage:any) => void;

    constructor(url: string, cheerio: (data:any) => void){
        this.url = url;
        this.cheerio = cheerio;
    }

    getPage(url: string | undefined | null): Promise<any>{
        if(url) this.url = url

        return axios.get(this.url, {headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36'}});
    }

    startCheerio(data: any){
        if(typeof this.cheerio === 'function'){
            return this.cheerio(data, this.getPage);
        }
        console.warn('No cheerio function defined');
    }

    async startProcess(){
        try{
            const data = await this.getPage(undefined);
            //console.log(data)

            return this.startCheerio(data)

        } catch(error) {
            console.log(error);
        }
    }
}
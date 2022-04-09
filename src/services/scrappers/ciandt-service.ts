import { JobType } from "../../types/response";

const cheerio = require('cheerio');

interface ProcessEnv extends NodeJS.ProcessEnv{
    JOB_FILTERS: string;
}

const { JOB_FILTERS } = process.env as ProcessEnv
const jobFilters = JSON.parse(JOB_FILTERS)

function treatString(data: string): string{
    return data.replace(/\s\s+/g, ' ').trim();
}

function determineIsHomeOffice(data: string): boolean{
    const treatedData = data.replace(/\s/g, '').trim().toLowerCase();
    const keywords = ['homeoffice', 'remoto', 'homeofice', 'remoto']

    for(const keyword of keywords){
        if(treatedData.includes(keyword)){
            return true;
        }
    }

    return false;
}

function filterTitle(title: string): boolean{
    
    if(Array.isArray(jobFilters)){
        
        for(const filter of jobFilters){
            if(title.toLowerCase().includes(filter.toLowerCase())){
                return true;
            }
        }

    } else {
        return true;
    }

    return false
}

export function startProcess(data: any): any{
        const $ = cheerio.load(data.data);
        const jobs = $('.opprtunity-item');
        const jobList:JobType[] = [];

        jobs.each( (_index:number, element: HTMLDivElement) => {
            try {
                const job = $(element);

                const title: string = job.find('.wp-block-cit-block-ciandt-heading').text()
                if(filterTitle(title)){
                    const treatedTitle = treatString(title)

                    const location: string =  job.find('.wp-block-cit-block-ciandt-short-text').text()
                    const treatedLocation = treatString(location)

                    const href = job.find('a').attr('href')
                    
                    const link: string = "https://ciandt.com" + href
                    const treatedLink = treatString(link)


                    const filter:string = job.find('.sr-only.filters-item').text();
                    const isRemoteJob: boolean = determineIsHomeOffice(filter);
                    
                    // /br/pt-br/carreiras/oportunidades/candidate-se?opportunity=92e9822e-3a56-405b-86d6-5d779a0c0584

                    const idJob: string = href.split('?').find((text: string) => text.includes('opportunity')).split('=')[1];

                    jobList.push({
                        title: treatedTitle,
                        location: treatedLocation,
                        link: treatedLink,
                        isRemoteJob,
                        idJob,
                        company: 'ciandt',
                        description: null
                    });
                }
            } catch (error) {
                console.log(error);
            }
            
        });

        return jobList;
    }

    export default startProcess
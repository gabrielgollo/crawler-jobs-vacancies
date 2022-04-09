import { JobType } from "../../types/response";

const cheerio = require('cheerio');


function getTableOfJobs($: any) {
    const selector: string = "div.job-list.jobs-to-filter"
    const container = $(selector);

    if(!container.length){
        throw new Error('Container not found');
    }

    return container;
}

export function startProcess(data: string): JobType[] {
    const $ = cheerio.load(data);
    const jobsTable = getTableOfJobs($);

    const scrappedJobs: JobType[] = [];
    
    jobsTable.each( (_index: number, element: any) => {
        console.log(element.text())
    })


    return scrappedJobs
}


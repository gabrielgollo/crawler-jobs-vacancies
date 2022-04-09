require('dotenv').config({path: './env/.env'});

const CronJob = require('cron').CronJob;
const { RequestService } = require('./src/services/request-service');
const { QueueService } = require("./src/services/rabbitmq-service");
const { ciandtService, gupyService } = require('./src/services/scrappers/index.ts')


const crawlerCiandT = new RequestService("https://ciandt.com/br/pt-br/carreiras/oportunidades", ciandtService);
const crawlerGupy = new RequestService("http://tech-career.gupy.io/", gupyService);
console.log('Starting Cron job');



async function startCrawlers(): Promise<void> {
    try {
        const dados = await crawlerCiandT.startProcess();

        //const dados2 = await crawlerGupy.startProcess();
        console.info(dados);

        const queueService = new QueueService()
        await queueService.sendMessage(JSON.stringify(dados))
    } catch (error) {
        console.log(error)
    }
}

const job = new CronJob('*/1 * * * *', function() {
    console.log('Starting Crawler');
    startCrawlers();
});

job.start();
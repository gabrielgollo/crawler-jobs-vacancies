const amqp = require('amqplib/callback_api');

const { AMQP_HOST, AMQP_QUEUE_NAME, AMQP_PARAMS } = process.env

export class QueueService{
    connection: any;
    constructor(){
        this.connection = null
    }
    async createConnection(){
        return new Promise((resolve, reject)=>{
            amqp.connect(AMQP_HOST, (error:any, connection:any)=>{
                if(error){
                    reject(error)
                }
                this.connection = connection
                resolve(connection)
            })
        })
    }

    async getOrCreateConnection(){
        if(this.connection){
            return this.connection
        }
        return this.createConnection()
        
    }

    async sendMessage(message: string) : Promise<Promise<void>>{
        const connection = await this.getOrCreateConnection()
        return new Promise ((resolve, reject)=>{

            connection.createChannel((errorChannel:any, channel:any): void =>{
                if(errorChannel){
                    reject(errorChannel)
                }
                
                channel.assertQueue(AMQP_QUEUE_NAME, { durable: true });
                channel.sendToQueue(AMQP_QUEUE_NAME, Buffer.from(message))
                
                setTimeout(():void=>{
                    connection.close()
                    resolve()
                }, 1000)
            })

        })
    }
}

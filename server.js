const express = require ('express');
const bodyParse = require ('body-parser');
const aedes = require ('aedes')();
const cors = require('cors');

const app = express();

const mqttServer = require('net').createServer(aedes.handle);
const mqttPort = 1883;
mqttServer.listen(mqttPort, ()=>{
    console.log('MQTT Server is running on port ${mqttPort}');
})

aedes.on('client',(client)=>{
    console.log("New Client Connected: ", client)
} );

aedes.on('cliewntDisconect', (client)=>{
    console.log("Client Disconnected: ", client);
})
aedes.on('publish', (packet, client)=>{
    console.log(`Mensagem Recebida do cliente ${client} - Topico: ${packet.topic} => ${packet.payload.toString()} `)
})


app.use(cors());

app.use(bodyParse.json());
app.get('/',(req,res)=>{
res.send({message:"API MQTT RODANDO"});
});

app.post('/send', (req,res)=>{
    try{
        const mensagem= req.body.mensagem;
        aedes.publish({topic: 'esp32/data', payload: mensagem});
        res.status(200).send({message: 'Mensagem publicada'});

    }catch(error){
        throw new error("Falha ao publicar mensagem")
    }

})



const port = 3000;
app.listen(port,()=>{
    console.log("Servidor rodando na porta "+port);
})
const config = require('config')
const app = require('./app');
const { readConfig } = require('./config/readConfig');


const PORT = readConfig(config, 'server.port') || 5000

app.listen(PORT,() => {
    console.log(`🔥 Server is running at: ${PORT}`)
})
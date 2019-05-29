const express = require('express')
const {Wit, log} = require('node-wit')

const pages = {
    'produktovy_katalog': 'https://ipexas.atlassian.net/wiki/spaces/IPK/overview',
    'ceniky-mobily': 'https://ipexas.atlassian.net/wiki/spaces/IPK/pages/763559968/Mobily',
    'produktovy_katalog-velkoobchod': 'https://ipexas.atlassian.net/wiki/spaces/IPK/pages/756350977/Produkty+pro+velkoobchodn+partnery+ISP+TSP',
    'produktovy_katalog-maloobchod': 'https://ipexas.atlassian.net/wiki/spaces/IPK/pages/743243780/Produkty+pro+firmy',
    'produktovy_katalog-mobily': 'https://ipexas.atlassian.net/wiki/spaces/IPK/pages/763559968/Mobily',
}

const client = new Wit({
    accessToken: process.env.WIT_AI_API_TOKEN,
    logger: new log.Logger(log.DEBUG) // optional
})

const app = express()
app.use(express.json())

const {PORT: port = 3000} = process.env

app.post('/', async (req, res) => {
    const {msg, id} = req.body
    const {entities} = await client.message(msg)
    console.log(entities)

    let {intent=[], pricelist_type = []} = entities
    let replyText = null

    if (intent.length) {
        intent = intent[0].value
    }
    
    switch (intent) {
        case 'produktovy_katalog':
            replyText = `Zde je odkaz na produktový katalog IPEXu. ${pages[intent]}.`
        case 'ceniky':
            if (pricelist_type.length) {
                const {value: pricelistType = null} = pricelist_type[0]
                replyText = `Zde je odkaz na cenik pro ${pricelistType}. `
            }
            break;
        default:
            replyText = 'Nerozumím otázce, zkuste to prosím znovu. Děkuji.'
    }  

    if (replyText) {
        res.json({msg: replyText})
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
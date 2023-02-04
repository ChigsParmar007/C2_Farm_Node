const fs = require('fs')
const http = require('http')
const url = require('url')
const slugify = require('slugify')
const replaceTemplate =  require('./moduls/replaceTemplate')

// **************************************************
//FILES

// Blocking, synchronous way
/* 
const textIn = fs.readFileSync('./txt/input.txt', 'utf-8')
console.log(textIn);

const textOut = `This is what we know about the avocado ${textIn}.\n Created on ${Date.now()}`
fs.writeFileSync('./txt/output.txt', textOut)
console.log('File written!')
*/

// Non-bloking, asynchronous way
/*
fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
    if (err) return console.log('ERROR!')
    fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
        console.log(data2)
        fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
            console.log(data3)

            fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
                console.log('Your file has been written')
            })
        })
    })
})
console.log('Will read file!')
*/


// **************************************************
// SERVER
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8')

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj =  JSON.parse(data)

const slugs = dataObj.map(element => slugify(element.productName, { lower: true }))

console.log(slugs)

const server = http.createServer((req, res) => {
    const { query , pathname} = url.parse(req.url, true)

    // Overview
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(404, { 'content-type': 'text/html' })

        const cardsHtml = dataObj.map(element => replaceTemplate(tempCard, element)).join('')
        const output = tempOverview.replace('{%Product_Card%}', cardsHtml)
        // console.log(cardsHtml)

        res.end(output)
    }

    // Product
    else if (pathname === '/product') {
        res.writeHead(404, { 'content-type': 'text/html' })
        const product = dataObj[query.id]
        const output = replaceTemplate(tempProduct, product)
        res.end(output)
    }

    // API
    else if (pathname === '/API') {
        res.writeHead(200, { 'content-type': 'application/json' })
        res.end(data)
    }

    // Not Found
    else {
        res.writeHead(404, { 'content-type': 'text/html' })
        res.end('<h1>Page not found!</h1>')
    }
})

server.listen(5000, () => {
    console.log(`Server listening on port 5000...`)
})
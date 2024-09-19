import bodyParser from "body-parser"

export let bodyjson =  bodyParser.json();
export let bodyurlencoded = bodyParser.urlencoded({ extended: true })
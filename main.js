const { captureOutgoingRequests } = require("./crawl")

async function main() {
    if (process.argv.length < 3){
        console.log("No website provided")
        process.exit
    }

    if (process.argv.length > 3){
        console.log("Too many command line args")
        process.exit
    }

    const baseUrl = new URL(process.argv[2])
    const userID = "44284867";
    const articles = await captureOutgoingRequests(baseUrl, userID, 5)
    console.log(articles)
}

main()
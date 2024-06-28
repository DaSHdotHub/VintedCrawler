const { totalmem } = require('os');
const puppeteer = require('puppeteer');
const fs = require('fs').promises; // Use fs promises to handle async operations


async function captureOutgoingRequests(baseUrl, id) {
    const url = `${baseUrl}member/${id}`;
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    let currentPage = 0;
    let totalPages = 1;

    // Listen for responses
    page.on('response', async response => {
        const responseUrl = response.url();
        const headers = response.headers();
        if (responseUrl.startsWith(`https://www.vinted.de/api/v2/users/${id}/items?`) && response.status() === 200) {
            if (headers['content-type'] && headers['content-type'].includes('application/json')) {
                try {
                    const responseBody = await response.json();
                    if (responseBody.pagination) {
                        currentPage = responseBody.pagination.current_page;
                        totalPages = responseBody.pagination.total_pages;
                        console.log(`Current page: ${currentPage} / Total pages: ${totalPages}`);
                    }
                    // Save the response to a file
                    const filename = `response_page_id_${id}_${currentPage}_of_${totalPages}.json`;
                    await fs.writeFile(filename, JSON.stringify(responseBody, null, 2));
                    console.log(`Saved response to ${filename}`);
                } catch (error) {
                    console.error(`Failed to save response: ${error}`);
                }
            }
        }
    });

    //Navigate to the URL
    await page.goto(url, { waitUntil: 'networkidle0' });
    await timeout(5000);

    
    while (currentPage < totalPages) {
        await page.evaluate(() => window.scrollBy(0, window.innerHeight));
        await timeout(500);
    }
    console.log("All pages captured!");
    await browser.close();
}

async function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    captureOutgoingRequests
}
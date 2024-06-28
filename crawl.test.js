const {normalizeURL, getUrlFromHTML} = require('./crawl.js')
const {test, expect} = require('@jest/globals')

test('normalizeURL strip https protocol', () => {
    const input = 'https://github.com/DaSHdotHub'
    const actual = normalizeURL(input)
    const expected = 'github.com/dashdothub'
    expect(actual).toEqual(expected)
    })

test('normalizeURL strip slash', () => {
    const input = 'https://github.com/DaSHdotHub/'
    const actual = normalizeURL(input)
    const expected = 'github.com/dashdothub'
    expect(actual).toEqual(expected)
    })

test('normalizeURL capitals', () => {
    const input = 'https://Github.com/DaSHdotHub/'
    const actual = normalizeURL(input)
    const expected = 'github.com/dashdothub'
    expect(actual).toEqual(expected)
    })
    
test('normalizeURL strp http protocol', () => {
    const input = 'http://Github.com/DaSHdotHub/'
    const actual = normalizeURL(input)
    const expected = 'github.com/dashdothub'
    expect(actual).toEqual(expected)
    })

test('getUrlFromHTML absolute', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href="https://github.com/profile/">
                GitHub
            </a>
        </body>
    </html>
    `
    const inputBaseUrl = "https://github.com"
    const actual = getUrlFromHTML(inputBaseUrl, inputHTMLBody)
    const expected = ["https://github.com/profile/"]
    expect(actual).toEqual(expected)
    })

test('getUrlFromHTML relative', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href="/path/">
                GitHub
            </a>
        </body>
    </html>
    `
    const inputBaseUrl = "https://github.com"
    const actual = getUrlFromHTML(inputBaseUrl, inputHTMLBody)
    const expected = ["https://github.com/path/"]
    expect(actual).toEqual(expected)
    })

test('getUrlFromHTML combination', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href="/path/">
                GitHub
            </a>
            <a href="https://gitlab.com/"
                Gitlab
            </a>
        </body>
    </html>
    `
    const inputBaseUrl = "https://github.com"
    const actual = getUrlFromHTML(inputBaseUrl, inputHTMLBody)
    const expected = ["https://github.com/path/", "https://gitlab.com/"]
    expect(actual).toEqual(expected)
    })

    test('getUrlFromHTML invalid', () => {
        const inputHTMLBody = `
        <html>
            <body>
                <a href="invalid">
                    Invalid URL
                </a>
                <a href="https://gitlab.com/"
                    Gitlab
                </a>
            </body>
        </html>
        `
        const inputBaseUrl = "https://github.com"
        const actual = getUrlFromHTML(inputBaseUrl, inputHTMLBody)
        const expected = ["https://gitlab.com/"]
        expect(actual).toEqual(expected)
        })
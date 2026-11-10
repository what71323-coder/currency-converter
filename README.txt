CURRENCY CONVERTER

PROJECT DESCRIPTION
Currency Converter is a web application that converts one currency
into another using live exchange rates from a public API.

TECHNOLOGIES USED
1. HTML5
2. CSS3
3. JavaScript
4. Fetch API
5. ExchangeRate-API

API USED
https://open.er-api.com/v6/latest/USD

FEATURES
1. Convert currencies using exchange rates.
2. Validate amount and currency inputs.
3. Handle network and API errors.
4. Display loading messages.
5. Swap source and target currencies.
6. Reset converter.
7. Display recent conversions.
8. Cache exchange rates in memory.
9. Display last updated information.
10. Responsive design.

CONVERSION FORMULA

Converted Amount = Amount × Exchange Rate

Example:
10 USD × 88 INR = 880 INR

The API provides exchange rates relative to the selected
base currency.

VALIDATION
1. Amount cannot be empty.
2. Amount must be numeric.
3. Amount must be greater than zero.
4. Source and target currencies must be valid.
5. Missing exchange rates are handled using custom errors.

ERROR HANDLING
1. try...catch handles conversion errors.
2. throw new Error() creates custom errors.
3. finally hides loading messages and restores the button.
4. Helpful error messages are displayed to users.
5. console.error() is used for debugging.

RATE CACHING
Exchange rates are stored in a JavaScript Map.
Repeated requests for the same base currency use cached data
instead of making another API request.

HOW TO RUN
1. Download or clone the project.
2. Open the project folder in VS Code.
3. Open index.html using Live Server.
4. Enter an amount.
5. Select source and target currencies.
6. Click Convert Currency.

DEBUGGING
Use browser Developer Tools:
F12 -> Console
F12 -> Network

Check API requests and errors during development.

PROJECT STRUCTURE
day21-currency-converter/
|-- index.html
|-- style.css
|-- script.js
|-- README.txt

AUTHOR
Raj
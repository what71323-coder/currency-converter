"use strict";

// DOM Elements
const converterForm = document.getElementById("converterForm");
const amountInput = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const convertButton = document.getElementById("convertButton");
const swapButton = document.getElementById("swapButton");
const resetButton = document.getElementById("resetButton");
const loadingMessage = document.getElementById("loadingMessage");
const errorMessage = document.getElementById("errorMessage");
const convertedAmount = document.getElementById("convertedAmount");
const conversionDetails = document.getElementById("conversionDetails");
const lastUpdated = document.getElementById("lastUpdated");
const historyList = document.getElementById("historyList");

// Valid currencies
const validCurrencies = [
    "USD", "INR", "EUR", "GBP", "JPY",
    "AED", "CAD", "AUD", "CHF", "CNY"
];

// In-memory cache
const ratesCache = new Map();

// Conversion history
const conversionHistory = [];

// Validate amount
function validateAmount() {
    const amount = amountInput.value.trim();

    if (amount === "") {
        throw new Error("Please enter an amount.");
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount)) {
        throw new Error("Please enter a valid numeric amount.");
    }

    if (numericAmount <= 0) {
        throw new Error("Amount must be greater than zero.");
    }

    return numericAmount;
}

// Validate currencies
function validateCurrencies() {
    const source = fromCurrency.value;
    const target = toCurrency.value;

    if (
        !validCurrencies.includes(source) ||
        !validCurrencies.includes(target)
    ) {
        throw new Error("Please select valid currencies.");
    }

    return { source, target };
}

// Fetch exchange rates
async function getExchangeRates(baseCurrency) {
    // Return cached rates if available
    if (ratesCache.has(baseCurrency)) {
        return ratesCache.get(baseCurrency);
    }

    const apiURL = `https://open.er-api.com/v6/latest/${baseCurrency}`;

    const response = await fetch(apiURL);

    // Check HTTP response
    if (!response.ok) {
        throw new Error("Unable to fetch exchange rates.");
    }

    const data = await response.json();

    // Validate API response
    if (
        data.result !== "success" ||
        !data.rates ||
        typeof data.rates !== "object"
    ) {
        throw new Error("Invalid exchange rate data received.");
    }

    // Cache rates and update time
    const rateData = {
        rates: data.rates,
        updatedAt: data.time_last_update_utc || "Not available"
    };

    ratesCache.set(baseCurrency, rateData);

    return rateData;
}

// Convert currency
async function convertCurrency(amount, source, target) {
    if (source === target) {
        return {
            amount: amount,
            rate: 1,
            updatedAt: "Not required"
        };
    }

    const rateData = await getExchangeRates(source);

    const exchangeRate = rateData.rates[target];

    // Check whether target currency exists
    if (
        typeof exchangeRate !== "number" ||
        !Number.isFinite(exchangeRate) ||
        exchangeRate <= 0
    ) {
        throw new Error("Exchange rate for selected currency is unavailable.");
    }

    const result = amount * exchangeRate;

    if (!Number.isFinite(result)) {
        throw new Error("Conversion result is invalid.");
    }

    return {
        amount: result,
        rate: exchangeRate,
        updatedAt: rateData.updatedAt
    };
}

// Display result
function displayResult(amount, source, target, result) {
    const formattedResult = result.amount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4
    });

    convertedAmount.textContent = `${formattedResult} ${target}`;

    conversionDetails.textContent =
        `${amount} ${source} = ${result.amount.toFixed(4)} ${target} | ` +
        `Rate: 1 ${source} = ${result.rate} ${target}`;

    lastUpdated.textContent =
        `Last updated: ${result.updatedAt}`;

    // Add to history
    addToHistory(amount, source, target, result.amount);
}

// Add conversion to history
function addToHistory(amount, source, target, result) {
    conversionHistory.unshift({
        amount,
        source,
        target,
        result
    });

    // Keep only latest 5 conversions
    if (conversionHistory.length > 5) {
        conversionHistory.pop();
    }

    displayHistory();
}

// Display conversion history
function displayHistory() {
    historyList.replaceChildren();

    if (conversionHistory.length === 0) {
        const emptyItem = document.createElement("li");
        emptyItem.className = "empty-history";
        emptyItem.textContent = "No conversions yet.";
        historyList.appendChild(emptyItem);
        return;
    }

    conversionHistory.forEach((item) => {
        const listItem = document.createElement("li");

        listItem.textContent =
            `${item.amount} ${item.source} → ` +
            `${item.result.toFixed(4)} ${item.target}`;

        historyList.appendChild(listItem);
    });
}

// Clear error message
function clearError() {
    errorMessage.textContent = "";
    errorMessage.hidden = true;
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.hidden = false;
}

// Form submit event
converterForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    clearError();

    let isLoading = false;

    try {
        // Validate user input
        const amount = validateAmount();
        const currencies = validateCurrencies();

        // Show loading
        loadingMessage.hidden = false;
        convertButton.disabled = true;
        convertButton.textContent = "Converting...";
        isLoading = true;

        // Fetch and convert
        const result = await convertCurrency(
            amount,
            currencies.source,
            currencies.target
        );

        // Display result
        displayResult(
            amount,
            currencies.source,
            currencies.target,
            result
        );

    } catch (error) {
        // Developer debugging
        console.error("Conversion error:", error);

        // User-friendly error
        showError(error.message || "Something went wrong. Please try again.");

    } finally {
        // Cleanup after request
        loadingMessage.hidden = true;
        convertButton.disabled = false;
        convertButton.textContent = "Convert Currency";
    }
});

// Swap currencies
swapButton.addEventListener("click", function () {
    const previousSource = fromCurrency.value;

    fromCurrency.value = toCurrency.value;
    toCurrency.value = previousSource;

    clearError();
});

// Reset converter
resetButton.addEventListener("click", function () {
    amountInput.value = "";

    fromCurrency.value = "USD";
    toCurrency.value = "INR";

    convertedAmount.textContent = "0.00 INR";
    conversionDetails.textContent = "";
    lastUpdated.textContent = "";

    clearError();
});

// Initial history display
displayHistory();
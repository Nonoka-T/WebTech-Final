const checkboxes = document.querySelectorAll('.toggle-checkbox');
const airportApi = document.getElementById('airports-api');
const exchangeApi = document.getElementById('exchange-api');
const apiInputLabel = document.getElementById('api-input-label');
const apiInput = document.getElementById('api-input');
const apiForm = document.getElementById('api-form');
const responseArea = document.getElementById('response-area');

const apiKey = 'Kf1w19XctwbkYEnTcoQY5N1ZflagOiJxfrmOfqIu';

checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => {

        checkboxes.forEach((cb) => {
            if (cb !== checkbox) {
                cb.checked = false;
            }
        });

        apiInput.value = '';
        responseArea.textContent = '';

        if (airportApi.checked) {
            apiInputLabel.textContent = 'Enter an IATA airport code (e.g. SYD, HND)';
            apiInput.placeholder = 'e.g. SYD';
        } else if (exchangeApi.checked) {
                apiInputLabel.textContent = 'Enter a currency pair e.g. GBP_AUD';
                apiInput.placeholder = 'e.g. GBP_AUD';
            } else {
                apiInputLabel.textContent = 'Choose API first';
                apiInput.placeholder = 'e.g. SYD or GBP_AUD';
            }
    });
});

apiForm.addEventListener('submit', (event) => {
    event.preventDefault();
    fetchApiData();
});

async function fetchApiData() {

    //clear response area
    responseArea.innerHTML = '<h3>API Response</h3>';

    if (!airportApi.checked && !exchangeApi.checked) {
        responseArea.innerHTML = '<h3>API Response</h3><p>Please select API first.</p>';
        return;
    }

    const userInput = apiInput.value.trim().toUpperCase();

    if (userInput === '') {
        responseArea.innerHTML = '<h3>API Response</h3><p>Please enter a value in the input area.</p>';
        return;
    }

    //build URL based on selected API
    let url = '';
    if (airportApi.checked) {
        url = 'https://api.api-ninjas.com/v1/airports?iata=' + encodeURIComponent(userInput);
    }
        else if (exchangeApi.checked) {
            url = 'https://api.api-ninjas.com/v1/exchangerate?pair=' + encodeURIComponent(userInput);
        }
    
    responseArea.innerHTML = '<h3>API Response</h3><p>Please wait...</p>';

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {'X-Api-Key': apiKey}
        });

        const data = await response.json();

        //Api response error
        if (!response.ok) {
            throw new Error(data.error || 'Error: ' + response.status);
        }

        //display airport API result
        if (airportApi.checked) {
            if (!data || data.length === 0) {
                throw new Error('No airport found. Please check IATA code.');
            }

            const airport = data[0];
            responseArea.innerHTML = '<h4>' + airport.name + '</h4>' +
            '<p><strong>IATA:</strong> ' + (airport.iata || 'N/A') + '</p>' +
            '<p><strong>City:</strong> ' + (airport.city || 'N/A') + '</p>' +
            '<p><strong>Country:</strong> ' + (airport.country || 'N/A') + '</p>' +
            '<p><strong>Timezone:</strong> ' + (airport.timezone || 'N/A') + '</p>';

        } else if (exchangeApi.checked) {
            if (!data || !data.exchange_rate) {
                throw new Error('No exchange rate found. Please check currency pair (e.g.GBP_AUD).');
            }

            responseArea.innerHTML =
            '<h4> Exchange Rate Result</h4>' +
            '<p><strong> Pair: </strong>' + userInput + '</p>' +
            '<p><strong> Rate: </strong>' + data.exchange_rate + '</p>';

        }
    } 
    catch (error) {
        responseArea.innerHTML = '<p style="color:red;">' + error.message + '</p>';
    }
}
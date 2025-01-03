fetch('https://www.bigbasket.com/_next/data/0eIIjTUu73qC3SfxaEdbI/pc/fruits-vegetables/exotic-fruits-veggies.json?listing=pc&slug=fruits-vegetables&slug=exotic-fruits-veggies')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Parse the response JSON
    })
    .then(data => {
        console.log(data); // Handle the JSON data
        // Perform operations with the fetched data here
    })
    .catch(error => {
        console.error('There was an error fetching the data:', error);
    });

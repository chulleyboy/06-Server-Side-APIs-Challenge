const APIKey = 'd383ab09154c3f80111225ae5d2de436';
const searchButtonEl = document.getElementById("search-button");
const searchInputEl = document.getElementById("search-input");
const searchHistoryEl = document.getElementById("search-history");
const cityEl = document.getElementById("city");
const dateEl = document.getElementById("date");
const iconEl = document.getElementById("icon");
const temperatureEl = document.getElementById("temperature");
const humidityEl = document.getElementById("humidity");
const windSpeedEl = document.getElementById("wind-speed");

// runs search when search button is clicked
searchButtonEl.addEventListener('click', () => {
	weather (searchInputEl.value);
});

// runs search when a history button is clicked
document.addEventListener('click', event => {
	const clickedButton = event.target;
	if (clickedButton.matches('.history-button')) {
		weather (clickedButton.textContent);
	}
  });


// searches for the weather data
function weather (cityName) {
	// find the coordinates with city name
	fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${APIKey}`)
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        const { lat, lon } = data[0];
        console.log(`Latitude: ${lat}, Longitude: ${lon}`);

		// find the weather using coordinates
		fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`)
		.then(response => response.json())
		.then(data => {
		  // set weather information
		  cityEl.textContent = `${data.city.name}`;
		  dateEl.textContent = dayjs().format('M/D/YYYY');
		  iconEl.setAttribute("src", `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}.png`);
		  temperatureEl.textContent = `Temperature: ${Math.round(ktof(data.list[0].main.temp))} °F`;
		  humidityEl.textContent = `Humidity: ${data.list[0].main.humidity}%`;
		  windSpeedEl.textContent = `Wind Speed: ${data.list[0].wind.speed} MPH`;
		  // set forecast information
		  for(let i=1; i<6; i++) {
			console.log(i)
			document.getElementById(`date-forecast-${i}`).textContent = dayjs().add(i, 'day').format('M/D/YYYY');
			document.getElementById(`icon-forecast-${i}`).setAttribute("src", `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png`);
			document.getElementById(`temperature-forecast-${i}`).textContent = `Temperature: ${Math.round(ktof(data.list[i].main.temp))} °F`;
			document.getElementById(`humidity-forecast-${i}`).textContent = `Humidity: ${data.list[i].main.humidity}%`;
			document.getElementById(`wind-speed-forecast-${i}`).textContent = `Wind Speed: ${data.list[i].wind.speed} MPH`;
		  }
		// 
		var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
		if(searchHistory === null){
			searchHistory = [data.city.name];
		}
		else{
			var inHistory = false;
			for(i=0; i<searchHistory.length; i++){
				if(data.city.name === searchHistory[i]){
					var inHistory = true;
				}
			}
			if(inHistory === false) {
				for(let i=7 -1; i >= 0; i--){
					searchHistory[i+1] = searchHistory[i];
				}
				searchHistory[0] = data.city.name;
			}

		}
		console.log(searchHistory);
		localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
		renderHistory()
		})
		.catch(error => {
		  console.error(error);
		});
      } else {
        console.error(`No location found for "${cityName}"`);
      }
    })
    .catch(error => {
      console.error(error);
    });
};

//convert kelvin to fahrenheit
function ktof(k) {
	return (k - 273.15) * 1.8 + 32;
}

// renders the search historry buttons
function renderHistory() {
	let historyTexts = JSON.parse(localStorage.getItem("searchHistory"));
	searchHistoryEl.innerHTML = '';
	for (let i = 0; i < historyTexts.length; i++) {
		if (historyTexts[i] !== null) {
			const button = document.createElement("button");
			button.textContent = historyTexts[i];
			button.classList.add("history-button");
			searchHistoryEl.appendChild(button);
		}
	}
	historyButtons = document.querySelectorAll('history-button');
}


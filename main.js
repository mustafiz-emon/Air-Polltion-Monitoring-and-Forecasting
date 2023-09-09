let weatherReport;

// let weatherApi = "http://api.openweathermap.org/geo/1.0/direct?q=dhaka,state code,bd&limit=5&appid=769f096cebb7779b7a20979cb40c0cbc";
// let a = "https://api.openweathermap.org/data/3.0/onecall?lat=23.7644025&lon=90.389015&appid=769f096cebb7779b7a20979cb40c0cbc";
// let weatherApi = "https://api.openweathermap.org/data/2.5/weather?lat=23.7644025&lon=90.389015&appid=769f096cebb7779b7a20979cb40c0cbc&units=imperial";
let weatherApi = "https://api.weatherapi.com/v1/current.json?key=a0ec2279c37746779d4114837231708&q=dhaka&aqi=yes";

fetch(weatherApi)
    .then(response => response.json())
    .then(data => {
        weatherReport = data;
        displayWeather();
    });

let tableElement = document.getElementsByClassName("table")[0];
let filePath = "Final Air Quality Dataset.csv";
xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET",filePath,false);
xmlhttp.overrideMimeType('text/plain');
xmlhttp.send(null);
//maybe check status !=404 here
let fileContent = xmlhttp.responseText;
let fileArray = fileContent.split('\n')
let n = fileArray.length;

function displayWeather() {
    // variables
    // let icon = weatherReport.weather[0].icon;
    let weatherIcon = weatherReport.current.condition.icon; 
    // let weatherDesc = weatherReport.weather[0].description;
    let weatherDesc = weatherReport.current.condition.text;
    let temp = weatherReport.current.temp_c;
    let feelsLike = weatherReport.current.feelslike_c;
    let humidity = weatherReport.current.humidity;
    let visibility = weatherReport.current.vis_km;
    let windSpeed = weatherReport.current.wind_kph;
    let windDirection = weatherReport.current.wind_dir;
    let uv = weatherReport.current.uv;
    let pressure = weatherReport.current.pressure_mb;
    let precipitation = weatherReport.current.precip_mm;


    // elements
    let weatherIconElement = document.getElementsByClassName("weather-icon")[0];
    let weatherDescElement = document.getElementsByClassName("weather-desc")[0];
    let tempElement = document.getElementsByClassName("temp")[0];
    let feelsLikeElement = document.getElementsByClassName("feels-like")[0];
    let humidityElement = document.getElementsByClassName("humidity")[0];
    let visibilityElement = document.getElementsByClassName("visibility")[0];
    let windSpeedElement = document.getElementsByClassName("wind-speed")[0];
    let uvElement = document.getElementsByClassName("uv")[0];
    let pressureElement = document.getElementsByClassName("pressure")[0];
    let precipitationElement = document.getElementsByClassName("precipitation")[0];

    weatherIconElement.src = "https:" + weatherIcon;
    weatherDescElement.innerHTML = weatherDesc;
    tempElement.innerHTML = temp + "°C";
    feelsLikeElement.innerHTML = feelsLike + "°C";
    humidityElement.innerHTML = humidity + "%";
    visibilityElement.innerHTML = visibility + " km";
    windSpeedElement.innerHTML = windSpeed + " kph" + " " + windDirection;
    uvElement.innerHTML = uv;
    pressureElement.innerHTML = pressure + " mb";
    precipitationElement.innerHTML = precipitation + " mm";

};


function generateTable() {
    console.log(n, fileArray);

    for(let i=0; i <= 50; i++) {
        let row = fileArray[i].split(',');
        if(i != 0) {
            tableElement.innerHTML += `
                <div class="row text-center fw-bold row-${row[0]}" role="button" style="font-size: 1rem;">
                    <div class="col border-end border-bottom border-light">${row[1]}</div>
                    <div class="col border-end border-bottom border-light">${row[2]}</div>
                    <div class="col border-end border-bottom border-light">${row[3]}</div>
                    <div class="col border-end border-bottom border-light">${row[4]}</div>
                    <div class="col border-end border-bottom border-light">${row[5]}</div>
                    <div class="col border-bottom border-light">${row[6]}</div>
                </div>`;
        } else {
            tableElement.innerHTML += `
                <div class="row text-center fw-bold row-${row[0]}" style="font-size: 1.1rem;">
                    <div class="col border-end border-bottom border-light">${row[1]}</div>
                    <div class="col border-end border-bottom border-light">${row[2]}</div>
                    <div class="col border-end border-bottom border-light">${row[3]}</div>
                    <div class="col border-end border-bottom border-light">${row[4]}</div>
                    <div class="col border-end border-bottom border-light">${row[5]}</div>
                    <div class="col border-bottom border-light">${row[6]}</div>
                </div>`;
        }
    }

    for(let i = 1; i <= 50; i++) {
        let rowElement = document.getElementsByClassName(`row-${i}`)[0];
        rowElement.addEventListener("click", () => {
            handleRowClick(i);
        });
    }
};

function handleRowClick(i) {
    let rowElement = document.getElementsByClassName(`row-${i}`)[0];
    rowElement.classList.toggle("selected");
    removeSelections(i);
    let o3Element = document.getElementsByClassName("o3")[0];
    let no2Element = document.getElementsByClassName("no2")[0];
    let so2Element = document.getElementsByClassName("so2")[0];
    let coElement = document.getElementsByClassName("co")[0];
    let pm25Element = document.getElementsByClassName("pm25")[0];
    let pm10Element = document.getElementsByClassName("pm10")[0];
    let polutionStatusElement = document.getElementsByClassName("polution-status")[0];

    let row = fileArray[i].split(',');
    o3Element.innerHTML = row[1];
    coElement.innerHTML = row[2];
    so2Element.innerHTML = row[3];
    no2Element.innerHTML = row[4];
    pm25Element.innerHTML = row[5];
    pm10Element.innerHTML = row[6];
    if(row[7] === '1') {
        polutionStatusElement.innerHTML = "Yes";
        polutionStatusElement.style.color = "red";
        polutionStatusElement.classList.remove("light-green");
        polutionStatusElement.classList.add("border-danger");
    } else {
        polutionStatusElement.innerHTML = "No";
        polutionStatusElement.style.color = "#76ff03";
        polutionStatusElement.classList.remove("border-danger");
        polutionStatusElement.classList.add("light-green");
    }

}

function removeSelections(i) {
    let tempo = "";
    for(let j = 1; j <= 50; j++) {
        if(j != i) {
            tempo = document.getElementsByClassName(`row-${j}`)[0];
            tempo.classList.remove("selected");
        }
    }
}

generateTable();
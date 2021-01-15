const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const path = require("path");
const app = express();

var x = "";
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");

app.get("/", function(req, res) {
  res.render("weather");
})

app.post("/", function(req, res) {

  const query = req.body.cityName;


    const queryCapitalized = capitalizaion(query) ;


  const appKey = "dd1b4be4dce1708e308771a01546d380";
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + appKey + "&units=" + unit;

  https.get(url, function(response) {

    response.on("data", function(data) {
      const weatherData = JSON.parse(data);

      const temp = Math.round(weatherData.main.temp);

      const weatherDescription = weatherData.weather[0].description;

      const weatherDescriptionCapitalized = capitalizaion(weatherDescription);

      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      const feelsLike= Math.round(weatherData.main.feels_like);
      const humidity=  weatherData.main.humidity;
      const visibility= weatherData.visibility/1000;
      const windSpeed= weatherData.wind.speed;
      const windDirection= weatherData.wind.deg;
      const pressure= weatherData.main.pressure;

    res.render("response", {city: queryCapitalized, temperature: temp , weather: weatherDescriptionCapitalized, image: imageURL, feels_like: feelsLike,
       humidityKey: humidity, visibilityKey:visibility, windSpeedKey:windSpeed, windDirectionKey: windDirection, pressureKey: pressure});
    })

  })
})

function capitalizaion(string) {
  const words = string.split(" ");

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  }
  return words.join(" ");
}


app.listen(3000 || process.env.port, function() {
  console.log("Server is running.");
})



let myProfileContentButtons = document.getElementsByClassName("my-profile-content-button");
let getWeatherForecastByCityButton = document.getElementById("get-weather-forecast-by-city-button");

let enteredCityForWeatherForecast = document.getElementById("cityForWeatherForecastInput");

var contentList = ["my-profile-content","dashboard-content","calendar-content"];
var shownContent = "";


window.onload = () => {
    document.getElementById("my-profile-content").style.display = "flex";
}

for (let x = 0; x < myProfileContentButtons.length; x++){
    myProfileContentButtons[x].addEventListener("click", () => {
        shownContent = document.getElementById(myProfileContentButtons[x].value);

        console.log("hello");

        console.log(myProfileContentButtons[x].value);
    
        shownContent.style.display = "flex";
    
        for (let y = 0; y < contentList.length; y++){
            if (contentList[y] != myProfileContentButtons[x].value){
                document.getElementById(contentList[y]).style.display = "none";
                document.getElementById(contentList[y]).style.display = "none";
            }
        }
    })
};




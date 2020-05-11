import { Component, OnInit, Input  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';

subscription: Subscription;



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
},
)
export class AppComponent implements OnInit {

  ngOnInit(){
    if (localStorage.getItem("cityArray") !== null) {
      this.cities = JSON.parse(localStorage.getItem("cityArray"));
    }
  }


  title = 'polybee';
  text = ''
  cityError = false
  selectedCity = 0
 

  cities: { name: string, weather: string, description: string, image: string, temperature: string }[] = 
  [ { name:'', weather:'', description:'' , image:'', temperature: ''},
  { name:'', weather:'', description:'' , image:'', temperature: ''},
  { name:'', weather:'', description:'' , image:'', temperature: ''},
  { name:'', weather:'', description:'' , image:'', temperature: ''},
  { name:'', weather:'', description:'' , image:'', temperature: ''},
  { name:'', weather:'', description:'' , image:'', temperature: ''},
  { name:'', weather:'', description:'' , image:'', temperature: ''},
  { name:'', weather:'', description:'' , image:'', temperature: ''},
  { name:'', weather:'', description:'' , image:'', temperature: ''},];

  private OpenWeatherURL: string = "http://api.openweathermap.org/data/2.5/weather?";
  private APIKey: string = "a2378ab958d2f6b06da06a1ef71d2300";

  //Update data every 25 seconds
  source = interval(25000);
  subscription = this.source.subscribe(val => this.UpdateCities());

  constructor(private http: HttpClient) {
    
  }

  UpdateCities()
  {
    for (let i = 0; i < this.cities.length; i++)
    {
      if (this.cities[i].name != '')
      {
         this.UpdateCity(i, this.cities[i].name);
      }
    }

    this.StoreCitiesInLocalStorage();
  }

  StoreCitiesInLocalStorage()
  {
    localStorage.setItem("cityArray", JSON.stringify(this.cities)); 
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async UpdateCity(cityNumber, cityName)
  {
    let url = this.OpenWeatherURL + "q=" + cityName + "" + "&APPID=" + this.APIKey;
    const savedData = this.cities[cityNumber];
    try{
      
      await this.http.get(url).toPromise().then(data => {
        this.cities[cityNumber].weather = data["weather"][0].main;
        this.cities[cityNumber].description = data["weather"][0].description;
        this.cities[cityNumber].image = "http://openweathermap.org/img/wn/" + data["weather"][0].icon + "@2x.png";
        this.cities[cityNumber].name = cityName;
        let temp = (parseFloat(data["main"].temp) - 273.15).toFixed(1);
        this.cities[cityNumber].temperature = temp.toString();
        this.cityError = false; 
      }) 
    }
    catch (error){
      this.cities[cityNumber] = savedData; //Recover previous item
      this.cityError = true; 
    }
    
  }

  SetCity(id)
  {
    this.selectedCity = id;
  }

  async CheckCityName(cityName)
  {
    let url = this.OpenWeatherURL + "q=" + cityName.value + "" + "&APPID=" + this.APIKey;
    
    await this.UpdateCity(this.selectedCity, cityName.value);
    this.StoreCitiesInLocalStorage();
  }


}

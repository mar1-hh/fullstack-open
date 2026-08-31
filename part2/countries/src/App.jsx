import { useState, useEffect } from 'react'
import axios from 'axios'

const Api_key = import.meta.env.VITE_WEATHER_KEY
const BaseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/'
const WeatherUrl = `https://api.weatherapi.com/v1/current.json?key=${Api_key}&q=`

const getWeather = (city) => {
  const req = axios.get(`${WeatherUrl}${city}`)
  return (req.then(res => res.data))
}

const ShowWeather = ({weather}) => {
  if (!weather || !weather.current)
  {
    return (
      <p>Loading weather...</p>
    )
  }
  return (
    <div>
      Temperature {weather.current.temp_c} Celsius <br />
      <img src={`https:${weather.current.condition.icon}`}/> <br />
      Wind {weather.current.wind_mph} m/s
    </div>
  )
}

const CountrieInfo = ({countrie}) => {
  const [weather, setWheater] = useState({}) 
  useEffect(() => {
    getWeather(countrie.capital[0]).then(returned => setWheater(returned))
  }, [countrie])

  
  return (
    <div>
      <h1>{countrie.name.common}</h1>
      <p>Capital {countrie.capital[0]}</p>
      <p>Area {countrie.area}</p>
      <h2>Languages</h2>
      <ul>
        {Object.entries(countrie.languages).map(([key, value]) => (
          <li key={key}>{value}</li>
        ))}
      </ul>
      <img src={countrie.flags.png} alt={countrie.flags.alt} />
      <h2>Weather in {countrie.capital[0]}</h2>
      <ShowWeather weather={weather} />
    </div>
  )
}



const ShowCountries = ({countries, countrieInput, setCountrie}) => {
  if (countrieInput === '')
    return (null)
  const matched = countries.filter(countrie => countrie.name.common.toLowerCase().includes(countrieInput.toLowerCase()))
  if (matched.length > 10)
  {
    return (
      <p>Too many matches, specify another filter</p>
    )
  }
  if (matched.length !== 1)
  {
    return (
      <div>
        {matched.map(countrie => (
          <div key={countrie.name.common}>
            {countrie.name.common} <button onClick={() => {setCountrie(countrie.name.common)}}>Show</button>
            <br />
          </div>
        ))}
      </div>
    )
  }
  if (matched.length === 1)
  {
    return (
      <CountrieInfo countrie={matched[0]} />
    )
  }
}

const getCountrie = () => {
  const req = axios.get(`${BaseUrl}/all`)
  return (req.then(res => res.data))
}

const App = () => {

  const [countries, setCountries] = useState([])
  const [countrieInput, setCountrie] = useState('')

  useEffect(() => {
    getCountrie().then(returned => {
      setCountries(returned)
    })
  }, [])

  const inputHandler = (event) => {
    setCountrie(event.target.value);
  }

  return (
    <div>
      find countries <input value={countrieInput} onChange={inputHandler}></input>
      <ShowCountries countries={countries} countrieInput={countrieInput} setCountrie={setCountrie}/>
    </div>
  )
}

export default App
import React ,{useState,useEffect }from 'react';
import './App.css';
import {MenuItem, FormControl, Select, Card, CardContent} from "@material-ui/core";
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import {sortData,prettyPrintStat} from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";
import image from './image.png';


function App() {

  const [countries,setCountries] = useState([]);
  const [country,setCountry] = useState('worldwide');
  const [countryInfo,setCountryInfo] = useState({});
  const [tableData,setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType,setCasesType] = useState("cases");

  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response=>response.json())
    .then(data=>{
      setCountryInfo(data);
    })
  },[])

  useEffect(()=>{
    const getCountriesData = async()=>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)=>response.json())
      .then((data)=>{
        const countries = data.map((country)=>(
          {
            name:country.country,
            value:country.countryInfo.iso2,
          }));

            const sortedData = sortData(data);
            setTableData(sortedData);
            setMapCountries(data);
            setCountries(countries);
      });
    }
    getCountriesData();
  },[]);

  const onCountryChange = async(event)=> {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url= countryCode ==='worldwide' ?  "https://disease.sh/v3/covid-19/all"
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(response=>response.json())
    .then(data=>{
      setCountry(countryCode);
      setCountryInfo(data);

      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    })

  }

  return (
    <div className="app">
      <div className="app__left">
      <div className="app__header">
      <img className="app__image" src={image} alt="COVID-19" />
        <FormControl className="app__dropdown">
          <Select
          variant="outlined"
          value={country}
          onChange={onCountryChange}
          >
          <MenuItem value="worldwide">Worldwide</MenuItem>
          {
            countries.map((country=>
              <MenuItem value={country.value}>{country.name}</MenuItem>
            ))
          }
            {/* <MenuItem value="worldwide">worldwide</MenuItem>
            <MenuItem value="worldwide">worldwide</MenuItem>
            <MenuItem value="worldwide">worldwide</MenuItem>
            <MenuItem value="worldwide">worldwide</MenuItem> */}
          </Select>
        </FormControl>

        </div>
        
        <div className="app__stats">
            <InfoBox title="Coronavirus Cases"
            isRed
            active={casesType==="cases"}
            onClick={(e)=>setCasesType('cases')} 
            cases={prettyPrintStat(countryInfo.todayCases)} 
            total={countryInfo.cases} />

            <InfoBox title="Recovered " 
            active={casesType==="recovered"}
            onClick={(e)=>setCasesType('recovered')}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={countryInfo.recovered}/>
            
            <InfoBox title="Death"
            isRed
            active={casesType==="deaths"}
            onClick={(e)=>setCasesType('deaths')}
            cases={prettyPrintStat(countryInfo.todayDeaths)} total={countryInfo.deaths}/>
        </div>
        <Map
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
          countries={mapCountries}
        /> 
      </div>
      

      <Card className="app__right">
          <CardContent>
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} /> 
            <h3 className="app__graphTitle">Worldwide New {casesType}</h3>
            <LineGraph className="app__graph"  casesType={casesType} />
          </CardContent>
      </Card>
    </div>
  );
}

export default App;

import { Router } from "express";
import axios from "axios";
import { Country, State, City } from "country-state-city";
const router = Router();

router.get("/allCountries", (req, res) => {
  let allCountries = Country.getAllCountries().filter(
    (allCountries) => allCountries.isoCode === "US" || allCountries.isoCode === "CA"
  );
  let formattedCountries = allCountries.map((country) => {
    return { name: country.name, code: country.isoCode };
  });
  res.status(200).send(formattedCountries);
  console.log(allCountries)
});

router.get("/getStateFromCountry", (req, res) => {
  let allStates = State.getAllStates();
  const states = allStates.filter(
    (states) => states.countryCode === req.query.realCountryData[0].code
  );

  const formattedStates = states.map((state) => {
    return { name: state.name, code: state.isoCode };
  });

  res.status(200).send(formattedStates);
});

router.get("/getCityFromState", (req, res)=>{
  let allCities = City.getAllCities();
  console.log("UrMom", allCities);
  const cities = allCities.filter(
    (cities) => cities.stateCode === req.query.realStateData[0].code
    );
    
    const formattedCities = cities.map((city) => {
      return { name: city.name };
    });
    
    res.status(200).send(formattedCities);
  })
  
export default router;

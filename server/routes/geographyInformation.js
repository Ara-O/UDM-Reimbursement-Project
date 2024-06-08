import { Router } from "express";
import axios from "axios";
import { Country, State, City } from "country-state-city";
const router = Router();

router.get("/get-state-from-country", (req, res) => {
  let allStates = State.getAllStates();

  const states = allStates.filter(
    (states) => states.countryCode === req.query.countryCode
  );

  const selected_country_states = states.map((state) => {
    return { name: state.name, code: state.isoCode };
  });

  res.status(200).send(selected_country_states);
});

router.get("/get-city-from-state", (req, res) => {
  let allCities = City.getAllCities();
  const cities = allCities.filter(
    (cities) => cities.stateCode === req.query.stateCode
  );

  const formattedCities = cities.map((city) => {
    return { name: city.name };
  });

  res.status(200).send(formattedCities);
});

export default router;

import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import { Form, Card } from "react-bootstrap";
import InfoCard from "./InfoCard";
import LineGraph from "./LineGraph";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import numeral from "numeral";
import Map from "./Map";
import "leaflet/dist/leaflet.css";
class App extends Component {
  state = {
    countries: null,
    mapCenter: { lat: 34.80746, lng: -40.4796 },
    countryInfo: {},
    mapZoom: 3,
    countryCode: "worldwide",
    caseType: "cases",
    mapCountries: [],
    tableData: [],
  };
  getCountriesInfo = async () => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ countryInfo: data });
      });
  };
  getCountries = async () => {
    fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
          name: country.country,
          value: country.countryInfo.iso2,
        }));
        let sortedData = sortData(data);
        this.setState({
          countries: countries,
          mapCountries: data,
          tableData: sortedData,
        });
      });
  };

  onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          countryCode: countryCode,
          countryInfo: data,
          mapCenter: [data.countryInfo.lat, data.countryInfo.long],
          mapZoom: 4,
        });
      });
  };

  async componentDidMount() {
    await this.getCountries();
    await this.getCountriesInfo();
  }

  render() {
    if (this.state.countries === null) return <h1>Loading</h1>;
    return (
      <div className="app">
        <div className="app__left">
          <div className="app__header">
            <h1>Covid Tracker</h1>
            <Form>
              <Form.Group className="app__dropdown" controlId="app_dropdown">
                <Form.Control as="select" onChange={this.onCountryChange}>
                  <option>Worldwide</option>
                  {this.state.countries.map((country) => {
                    return (
                      <option key={country.name} value={country.value}>
                        {country.name}
                      </option>
                    );
                  })}
                </Form.Control>
              </Form.Group>
            </Form>
          </div>

          {/*Title */}
          {/*Total Active */}

          <div className="app__stats">
            {/*cases card */}
            <InfoCard
              onClick={(e) => this.setState({ caseType: "cases" })}
              title="Coronavirus Cases"
              isRed
              active={this.state.caseType === "cases"}
              cases={prettyPrintStat(this.state.countryInfo.todayCases)}
              total={numeral(this.state.countryInfo.cases).format("0.0a")}
            />
            {/*Total recovered cases */}
            <InfoCard
              onClick={(e) => this.setState({ caseType: "recovered" })}
              title="Recovered"
              active={this.state.caseType === "recovered"}
              cases={prettyPrintStat(this.state.countryInfo.todayRecovered)}
              total={numeral(this.state.countryInfo.recovered).format("0.0a")}
            />
            {/*Total death rates */}
            <InfoCard
              onClick={(e) => this.setState({ caseType: "deaths" })}
              title="Deaths"
              isRed
              active={this.state.caseType === "deaths"}
              cases={prettyPrintStat(this.state.countryInfo.todayDeaths)}
              total={numeral(this.state.countryInfo.deaths).format("0.0a")}
            />
          </div>

          {/*Map */}
          <Map
            countries={this.state.mapCountries}
            casesType={this.state.caseType}
            center={this.state.mapCenter}
            zoom={this.state.mapZoom}
          />
        </div>
        <Card className="app__right">
          <Card.Body>
            {/*  <div className="app__information">
              <h3>Live Cases by Country</h3>
             
                <Table countries={this.state.tableData} />
               <h3>Worldwide new {this.state.caseType}</h3>
              
               <LineGraph casesType={this.state.caseType} 
           </div>*/}
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default App;

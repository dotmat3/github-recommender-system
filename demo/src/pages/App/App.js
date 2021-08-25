import React, { useState } from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";

import Form from "react-bootstrap/Form";

import Header from "../../components/Header";

import PredictionFromRepos from "./PredictionFromRepos";
import PredictionFromUser from "./PredictionFromUser";
import Results from "../Results";

import { ServerAddressProvider } from "../../context/server-address";

import "./App.scss";

const App = () => {
  return (
    <div className="App">
      <ServerAddressProvider>
        <Router>
          <Switch>
            <Route path="/recommend" component={Results} />
            <Route path="/" component={Home} />
          </Switch>
        </Router>
      </ServerAddressProvider>
    </div>
  );
};

const Home = () => {
  const [model, setModel] = useState("");
  const [nItems, setNItems] = useState("");

  return (
    <div className="home">
      <Header />
      <div className="content d-flex">
        <div className="w-75">
          <PredictionFromRepos model={model} numberOfRepos={nItems} />
          <PredictionFromUser model={model} numberOfRepos={nItems} />
        </div>
        <div className="w-25">
          <Settings
            selectedModel={model}
            onModelSelect={setModel}
            numberOfRepos={nItems}
            onNumberOfRepos={setNItems}
          />
        </div>
      </div>
    </div>
  );
};

const Settings = ({
  selectedModel,
  onModelSelect,
  numberOfRepos,
  onNumberOfRepos,
}) => {
  return (
    <div className="p-4 settings">
      <div className="header mb-3">
        <h1>Settings</h1>
      </div>
      <Form>
        <Form.Select
          className="my-2"
          value={selectedModel}
          onChange={(e) => onModelSelect(e.currentTarget.value)}
        >
          <option value="">Select model</option>
          <option value="CB">Content-based Filtering</option>
          <option value="UB">User-based Collaborative Filtering</option>
          <option value="IB">Item-based Collaborative Filtering</option>
          <option value="MF">Matrix Factorization (ALS)</option>
        </Form.Select>
        <Form.Control
          className="my-2"
          value={numberOfRepos}
          onChange={(e) => onNumberOfRepos(e.currentTarget.value)}
          type="number"
          placeholder="Number of recommended repos"
        />
      </Form>
      <div className="header mt-4 mb-3">
        <h1>Statistics</h1>
      </div>
      <p>...Bunch of statistics...</p>
    </div>
  );
};

export default App;

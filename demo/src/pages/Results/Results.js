import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Row from "react-bootstrap/Row";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import Card from "../../components/Card";
import Header from "../../components/Header";
import Pagination from "../../components/Pagination";

import { useServer } from "../../context/server-address";

import "./Results.scss";

const ITEM_PER_PAGE = 5;

const Results = () => {
  const location = useLocation();

  const [predicting, setPredicting] = useState(true);

  const [previouslyStarred, setPreviouslyStarred] = useState();
  const [predictions, setPredictions] = useState();
  const [groundTruth, setGroundTruth] = useState();

  const serverAddress = useServer();

  useEffect(() => {
    console.log(location.state);

    const predict = async () => {
      const response = await fetch(`${serverAddress}/recommend`, {
        method: "POST",
        body: JSON.stringify(location.state),
        headers: { "Content-Type": "application/json" },
      });
      return await response.json();
    };

    predict().then((data) => {
      console.log(data);
      setPreviouslyStarred(
        data.starred.map((repo) => ({
          ...repo,
          repoId: repo["repo_id"],
          sponsor: repo.sponsor === 1,
          updated: new Date(repo.updated),
        }))
      );
      setPredictions(
        data.predictions.map((repo) => ({
          ...repo,
          repoId: repo["repo_id"],
          sponsor: repo.sponsor === 1,
          updated: new Date(repo.updated),
        }))
      );
      if (data.gt)
        setGroundTruth(
          data.gt.map((repo) => ({
            ...repo,
            repoId: repo["repo_id"],
            sponsor: repo.sponsor === 1,
            updated: new Date(repo.updated),
          }))
        );
      setPredicting(false);
    });
  }, [location.state, serverAddress]);

  if (predicting)
    return (
      <div className="d-flex flex-column justify-content-center align-items-center w-100 mt-4 results">
        <h1>Predicting...</h1>
        <img
          className="mt-2"
          src="https://c.tenor.com/mPZu033P8GAAAAAC/the-hang-over-zach-galifianakis.gif"
        />
      </div>
    );

  return (
    <div className="results">
      <Header />
      <div className="p-2">
        {previouslyStarred && (
          <ResultsSection title="Previously Starred" data={previouslyStarred}>
            {({ repoId, ...repoInfo }) => <Card key={repoId} {...repoInfo} />}
          </ResultsSection>
        )}
        {predictions && (
          <ResultsSection
            title="Predictions"
            data={predictions.sort((a, b) => b.score - a.score)}
          >
            {({ repoId, score, ...repoInfo }) => (
              <OverlayTrigger
                key={repoId}
                placement="top"
                overlay={<Tooltip>Score: {score.toFixed(3)}</Tooltip>}
              >
                <Card
                  {...repoInfo}
                  active={
                    groundTruth &&
                    Object.values(groundTruth).find(
                      (gt) => gt.repoId === repoId
                    )
                  }
                />
              </OverlayTrigger>
            )}
          </ResultsSection>
        )}
        {groundTruth && (
          <ResultsSection title="Ground Truth" data={groundTruth}>
            {({ repoId, ...repoInfo }) => (
              <Card
                key={repoId}
                {...repoInfo}
                active={Object.values(predictions).find(
                  (pred) => pred.repoId === repoId
                )}
              />
            )}
          </ResultsSection>
        )}
      </div>
    </div>
  );
};

const ResultsSection = ({ title, data, children }) => {
  const [page, setPage] = useState(1);

  return (
    <>
      <h1 className="mt-4">{title}</h1>
      <Row className="mt-2 g-0 items-list">
        {data
          .slice(
            (page - 1) * ITEM_PER_PAGE,
            (page - 1) * ITEM_PER_PAGE + ITEM_PER_PAGE
          )
          .map(children)}
      </Row>
      {Math.ceil(data.length / ITEM_PER_PAGE) !== 1 && (
        <Pagination
          page={page}
          setPage={setPage}
          size={Math.ceil(data.length / ITEM_PER_PAGE)}
        />
      )}
    </>
  );
};

export default Results;

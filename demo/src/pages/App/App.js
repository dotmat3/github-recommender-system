import React, { useEffect, useState, useMemo } from "react";
import {
  Switch,
  Route,
  BrowserRouter as Router,
  useHistory,
} from "react-router-dom";
import classNames from "classnames";

import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import Badge from "react-bootstrap/Badge";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

import Card from "../../components/Card";
import Header from "../../components/Header";
import Pagination from "../../components/Pagination";
import UserCard from "../../components/UserCard";

import Results from "../Results";

import { NGROK_ADDRESS, LANGUAGE_ICONS } from "../../constants";

import "./App.scss";

const App = () => {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/recommend" component={Results} />
          <Route path="/" component={Home} />
        </Switch>
      </Router>
    </div>
  );
};

const Home = () => {
  const [model, setModel] = useState("");
  const [K, setK] = useState("");

  return (
    <>
      <Header />
      <div className="content d-flex">
        <div className="w-75">
          <PredictionFromRepos model={model} K={K} />
          <PredictionFromUser model={model} K={K} />
        </div>
        <div className="w-25">
          <Settings
            selectedModel={model}
            onModelSelect={setModel}
            numberOfRepos={K}
            onNumberOfRepos={setK}
          />
        </div>
      </div>
    </>
  );
};

const REPOS_PER_PAGE = 8;

const PredictionFromRepos = ({ model, K }) => {
  const history = useHistory();

  const [selectedRepos, setSelectedRepos] = useState([]);
  const [repos, setRepos] = useState(null);

  const [page, setPage] = useState(1);

  const [filterRepoId, setFilterRepoId] = useState("");
  const [filterCreator, setFilterCreator] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterLanguage, setFilterLanguage] = useState("");

  const [showAlert, setShowAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");

  useEffect(() => {
    const fetchRepos = async () => {
      const response = await fetch(`${NGROK_ADDRESS}/repos`);
      const data = await response.json();
      return data.map((repo) => ({
        ...repo,
        repoId: repo["repo_id"],
        sponsor: repo.sponsor === 1,
        updated: new Date(repo.updated),
      }));
    };

    fetchRepos().then(setRepos);
  }, []);

  const selectRepo = (repoId) => {
    setSelectedRepos((prev) => [
      ...prev,
      repos.find((repo) => repo.repoId === repoId),
    ]);
    setRepos((prev) => prev.filter((repo) => repo.repoId !== repoId));
  };

  const unselectRepo = (repoId) => {
    setRepos((prev) => [
      ...prev,
      selectedRepos.find((repo) => repo.repoId === repoId),
    ]);
    setSelectedRepos((prev) => prev.filter((repo) => repo.repoId !== repoId));
  };

  const filteredRepos = useMemo(
    () =>
      repos &&
      repos
        .sort((a, b) => b.stars - a.stars)
        .filter(
          ({ repoId }) => !filterRepoId || repoId === parseInt(filterRepoId, 10)
        )
        .filter(
          ({ creator }) =>
            !filterCreator ||
            creator.toLowerCase().includes(filterCreator.toLowerCase())
        )
        .filter(
          ({ name }) =>
            !filterName || name.toLowerCase().includes(filterName.toLowerCase())
        )
        .filter(
          ({ about }) =>
            !filterKeyword ||
            about.toLowerCase().includes(filterKeyword.toLowerCase())
        )
        .filter(
          ({ language }) =>
            !filterLanguage ||
            filterLanguage === "All languages" ||
            language === filterLanguage
        ),
    [
      repos,
      filterRepoId,
      filterCreator,
      filterName,
      filterKeyword,
      filterLanguage,
    ]
  );

  useEffect(() => {
    if (filteredRepos)
      setPage((prev) => {
        const pages = Math.ceil(filteredRepos.length / REPOS_PER_PAGE);
        const size = Math.max(1, pages);
        return Math.min(size, prev);
      });
  }, [filteredRepos, page]);

  const predictFromRepos = () => {
    if (selectedRepos.length === 0) {
      setAlertContent("You need to select at least one repo");
      setShowAlert(true);
      return;
    }

    if (model === "") {
      setAlertContent("You need to select a model");
      setShowAlert(true);
      return;
    }

    if (K === "") {
      setAlertContent("You need to indicate the number of repos to recommend");
      setShowAlert(true);
      return;
    }

    const to = {
      pathname: `/recommend`,
      state: {
        model,
        params: {
          starred_repos_list: selectedRepos.map((r) => r.repoId),
          K: parseInt(K),
        },
      },
    };
    history.push(to);
  };

  return (
    <div className="p-4 prediction from-repos">
      <Modal show={showAlert} onHide={() => setShowAlert(false)}>
        <Modal.Header>
          <Modal.Title className="m-auto fw-bold">Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{alertContent}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowAlert(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="d-flex justify-content-between align-items-center header">
        <div>
          <h1 className="m-0">Predict from starred repos</h1>
          <p>Select the repos you want...</p>
        </div>
        <div>
          <Button variant="green" onClick={predictFromRepos}>
            Predict
          </Button>
        </div>
      </div>
      <Form className="d-flex">
        <Form.Control
          className="me-2"
          type="text"
          placeholder="Repo id"
          value={filterRepoId}
          onChange={(e) => setFilterRepoId(e.currentTarget.value)}
          style={{ flex: 1 }}
        />
        <Form.Control
          className="me-2"
          type="text"
          placeholder="Creator"
          value={filterCreator}
          onChange={(e) => setFilterCreator(e.currentTarget.value)}
          style={{ flex: 2 }}
        />
        <Form.Control
          className="me-2"
          type="text"
          placeholder="Name"
          value={filterName}
          onChange={(e) => setFilterName(e.currentTarget.value)}
          style={{ flex: 2 }}
        />
        <Form.Control
          className="me-2"
          type="text"
          placeholder="Keyword"
          value={filterKeyword}
          onChange={(e) => setFilterKeyword(e.currentTarget.value)}
          style={{ flex: 3 }}
        />
        <Form.Select
          value={filterLanguage}
          onChange={(e) => setFilterLanguage(e.currentTarget.value)}
          style={{ flex: 2 }}
        >
          <option>All languages</option>
          {Object.keys(LANGUAGE_ICONS).map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </Form.Select>
      </Form>
      {selectedRepos &&
        selectedRepos.map(({ repoId, creator, name }) => (
          <Badge
            key={repoId}
            className="mx-1 mb-2 mt-3"
            pill
            onClick={() => unselectRepo(repoId)}
            style={{ cursor: "pointer" }}
          >
            {creator + " / " + name}
          </Badge>
        ))}
      <Row
        className={classNames("mt-2 g-0 items-list", {
          "justify-content-center align-items-center": !repos,
        })}
      >
        {!repos && <Spinner animation="grow" />}
        {repos &&
          filteredRepos
            .slice(
              (page - 1) * REPOS_PER_PAGE,
              (page - 1) * REPOS_PER_PAGE + REPOS_PER_PAGE
            )
            .map(({ repoId, ...repoInfo }) => (
              <Card
                key={repoId}
                {...repoInfo}
                onClick={() => selectRepo(repoId)}
              />
            ))}
        {repos && filteredRepos.length === 0 && (
          <p className="mt-4 text-center">No results</p>
        )}
      </Row>
      {repos && (
        <Pagination
          page={page}
          setPage={setPage}
          size={Math.ceil(filteredRepos.length / REPOS_PER_PAGE)}
        />
      )}
    </div>
  );
};

const USERS_PER_PAGE = 40;

const PredictionFromUser = ({ model, K }) => {
  const history = useHistory();

  const [users, setUsers] = useState(null);

  const [page, setPage] = useState(1);

  const [filterUserId, setFilterUserId] = useState("");
  const [filterName, setFilterName] = useState("");

  const [showAlert, setShowAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch(`${NGROK_ADDRESS}/users`);
      return await response.json();
    };

    fetchUsers().then(setUsers);
  }, []);

  const filteredUsers = useMemo(
    () =>
      users &&
      users
        .sort((a, b) => b.numStarredRepos - a.numStarredRepos)
        .filter(
          ({ userId }) => !filterUserId || userId === parseInt(filterUserId, 10)
        )
        .filter(
          ({ name }) =>
            !filterName || name.toLowerCase().includes(filterName.toLowerCase())
        ),
    [users, filterUserId, filterName]
  );

  const predictFromUser = (userId) => {
    if (model === "") {
      setAlertContent("You need to select a model");
      setShowAlert(true);
      return;
    }

    if (K === "") {
      setAlertContent("You need to indicate the number of repos to recommend");
      setShowAlert(true);
      return;
    }

    const to = {
      pathname: `/recommend`,
      state: { model, params: { user_id: userId, K: parseInt(K) } },
    };
    history.push(to);
  };

  useEffect(() => {
    if (filteredUsers)
      setPage((prev) => {
        const pages = Math.ceil(filteredUsers.length / REPOS_PER_PAGE);
        const size = Math.max(1, pages);
        return Math.min(size, prev);
      });
  }, [filteredUsers, page]);

  return (
    <div className="p-4 prediction from-user">
      <Modal show={showAlert} onHide={() => setShowAlert(false)}>
        <Modal.Header>
          <Modal.Title className="m-auto fw-bold">Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{alertContent}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowAlert(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="header">
        <h1 className="m-0">Predict from user</h1>
        <p>Select the user you want...</p>
      </div>
      <Form className="d-flex">
        <Form.Control
          className="me-2"
          type="text"
          placeholder="User id"
          value={filterUserId}
          onChange={(e) => setFilterUserId(e.currentTarget.value)}
        />
        <Form.Control
          className="me-2"
          type="text"
          placeholder="Name"
          value={filterName}
          onChange={(e) => setFilterName(e.currentTarget.value)}
        />
      </Form>
      <Row
        className={classNames("mt-2 g-0 items-list", {
          "justify-content-center align-items-center": !users,
        })}
      >
        {!users && <Spinner animation="grow" />}
        {filteredUsers &&
          filteredUsers
            .slice(
              (page - 1) * USERS_PER_PAGE,
              (page - 1) * USERS_PER_PAGE + USERS_PER_PAGE
            )
            .map(({ userId, name, numStarredRepos }) => (
              <UserCard
                key={userId}
                userId={userId}
                name={name}
                numStarredRepos={numStarredRepos}
                onClick={() => predictFromUser(userId)}
              />
            ))}
        {users && filteredUsers.length === 0 && (
          <p className="mt-4 text-center">No results</p>
        )}
      </Row>
      {users && (
        <Pagination
          page={page}
          setPage={setPage}
          size={Math.ceil(filteredUsers.length / REPOS_PER_PAGE)}
        />
      )}
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

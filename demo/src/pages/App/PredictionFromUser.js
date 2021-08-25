import React, { useState, useEffect, useMemo } from "react";
import classNames from "classnames";
import { useHistory } from "react-router-dom";

import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";

import UserCard from "../../components/UserCard";
import Pagination from "../../components/Pagination";

import { useServer } from "../../context/server-address";

const USERS_PER_PAGE = 40;

const PredictionFromUser = ({ model, numberOfRepos }) => {
  const history = useHistory();

  const [users, setUsers] = useState(null);

  const [page, setPage] = useState(1);

  const [filterUserId, setFilterUserId] = useState("");
  const [filterName, setFilterName] = useState("");

  const [showAlert, setShowAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");

  const serverAddress = useServer();

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch(`${serverAddress}/users`);
      return await response.json();
    };

    fetchUsers().then(setUsers);
  }, [serverAddress]);

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

    if (numberOfRepos === "") {
      setAlertContent("You need to indicate the number of repos to recommend");
      setShowAlert(true);
      return;
    }

    const to = {
      pathname: `/recommend`,
      state: { model, params: { user_id: userId, K: parseInt(numberOfRepos) } },
    };
    history.push(to);
  };

  useEffect(() => {
    if (filteredUsers)
      setPage((prev) => {
        const pages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
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
          <Button variant="green" onClick={() => setShowAlert(false)}>
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
          size={Math.ceil(filteredUsers.length / USERS_PER_PAGE)}
        />
      )}
    </div>
  );
};

export default PredictionFromUser;

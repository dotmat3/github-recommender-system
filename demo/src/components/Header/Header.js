import React from "react";
import { Link } from "react-router-dom";

import { Icon } from "@iconify/react";
import Button from "react-bootstrap/Button";

import "./Header.scss";

const Header = () => {
  return (
    <header className="d-flex align-items-center justify-content-between">
      <Link to="/" style={{ textDecoration: "none", color: "white" }}>
        <div className="d-flex">
          <Icon icon="akar-icons:github-fill" />
          <div>
            <h1 className="m-0">GitHub Recommender System</h1>
            <h3 className="m-0">Big Data Project 2020/21</h3>
          </div>
        </div>
      </Link>
      <Button variant="green">Project repo</Button>
    </header>
  );
};

export default Header;

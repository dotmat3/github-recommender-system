import React from "react";
import classNames from "classnames";

import Card from "react-bootstrap/Card";
import { Icon } from "@iconify/react";

import { MONTHS, LANGUAGE_ICONS } from "../../constants";

import "./RepoCard.scss";

const RepoCard = (
  {
    name,
    creator,
    about,
    stars,
    forks,
    language,
    sponsor,
    updated,
    active,
    ...props
  },
  ref
) => {
  return (
    <Card className={classNames("m-2", { active })} ref={ref} {...props}>
      <Card.Body className="d-flex flex-column">
        <Card.Title>
          <a
            href={`https://github.com/${creator}/${name}`}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            {creator} / {name}
          </a>
        </Card.Title>
        <Card.Text className="mb-4 flex-grow-1">{about}</Card.Text>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex justify-content-between align-items-center">
            <Icon icon="ant-design:star-outlined" className="me-2" />
            {stars}
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <Icon icon="eos-icons:fork-outlined" className="me-2" />
            {forks}
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <Icon icon={LANGUAGE_ICONS[language]} className="me-2" />
            {language !== "UNK" ? language : "Unknown"}
          </div>
        </div>
      </Card.Body>
      <Card.Footer
        className={classNames("d-flex align-items-center text-center", {
          "justify-content-between": sponsor,
        })}
      >
        <div className="d-flex justify-content-between align-items-center">
          <Icon icon="bi:calendar-date" className="me-2" />
          {`${updated.getDate()} ${
            MONTHS[updated.getMonth()]
          } ${updated.getFullYear()}`}
        </div>
        {sponsor && (
          <div className="d-flex justify-content-between align-items-center">
            <Icon
              icon="simple-icons:githubsponsors"
              color="#db61a2"
              className="me-2"
            />
            Sponsored
          </div>
        )}
      </Card.Footer>
    </Card>
  );
};

export default React.forwardRef(RepoCard);

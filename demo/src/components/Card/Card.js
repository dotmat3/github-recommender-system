import React from "react";
import classNames from "classnames";

import BootstrapCard from "react-bootstrap/Card";
import { Icon } from "@iconify/react";

import { MONTHS, LANGUAGE_ICONS } from "../../constants";

import "./Card.scss";

const Card = (
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
    <BootstrapCard
      className={classNames("m-2", { active })}
      ref={ref}
      {...props}
    >
      <BootstrapCard.Body className="d-flex flex-column">
        <BootstrapCard.Title>
          <a
            href={`https://github.com/${creator}/${name}`}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            {creator} / {name}
          </a>
        </BootstrapCard.Title>
        <BootstrapCard.Text className="mb-4 flex-grow-1">
          {about}
        </BootstrapCard.Text>
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
      </BootstrapCard.Body>
      <BootstrapCard.Footer
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
      </BootstrapCard.Footer>
    </BootstrapCard>
  );
};

export default React.forwardRef(Card);

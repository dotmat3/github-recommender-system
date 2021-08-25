import React from "react";

import { Icon } from "@iconify/react";

import "./UserCard.scss";

const AVATAR_ICONS = [
  "emojione:blond-haired-person",
  "emojione:blond-haired-person-dark-skin-tone",
  "emojione:blond-haired-person-light-skin-tone",
  "emojione:blond-haired-person-medium-dark-skin-tone",
  "emojione:blond-haired-person-medium-light-skin-tone",
  "emojione:blond-haired-person-medium-skin-tone"
];

const UserCard = ({ userId, name, numStarredRepos, ...props }) => {
  return (
    <div {...props} className="d-flex m-2 p-2 user-card">
      <Icon
        icon={AVATAR_ICONS[userId % AVATAR_ICONS.length]}
        width="30px"
        height="30px"
      />
      <div className="px-2">
        <h1 className="m-0 no-wrap">{name}</h1>
        <h2 className="m-0">Starred {numStarredRepos} repos</h2>
      </div>
    </div>
  );
};

export default UserCard;

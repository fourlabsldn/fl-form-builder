import React from "react";

const ButtonDropdownOption = ({ info }) =>
(
  <li>
    <a
      href="#"
      onClick={() => console.log("To be implemented")}
    >
      {info.displayName}
    </a>
  </li>
);

ButtonDropdownOption.propTypes = {
  info: React.PropTypes.shape({
    type: React.PropTypes.string,
    displayName: React.PropTypes.string,
    group: React.PropTypes.string,
  }),
};

export default ButtonDropdownOption;

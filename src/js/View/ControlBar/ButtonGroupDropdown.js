import React from "react";
import ButtonDropdownOption from "./ButtonDropdownOption";

const ButtonGroupDropdown = ({ groupName, groupButtons }) =>
(
  <div className="btn-group">

    <button className="btn btn-default dropdown-toggle" data-toggle="dropdown">
      {groupName}
      <span className="caret"></span>
    </button>

    <ul className="dropdown-menu">
      {groupButtons.map(btnInfo => <ButtonDropdownOption info={btnInfo} />)}
    </ul>

  </div>
);

ButtonGroupDropdown.propTypes = {
  groupName: React.PropTypes.string,
  groupButtons: React.PropTypes.array,
};

export default ButtonGroupDropdown;

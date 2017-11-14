import React from "react";
import store from "../../store";
import { createField } from "../../Actions";

const ButtonDropdownOption = ({ info }) =>
(
  <li>
    <a
      href="#"
      onClick={() => store.dispatch(createField(info.type))}
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

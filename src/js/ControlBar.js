import React from 'react';
import ReactDOM from 'react-dom';
import EventHub from './EventHub';
import { curry } from 'lodash/fp';

const ButtonDropdownOption = ({ description }) => (
  <li>
    <a
      href="#"
      onClick={() => EventHub.trigger('createField', description.type)}
    >
      {description.displayName}
    </a>
  </li>
);

ButtonDropdownOption.propTypes = {
  description: React.PropTypes.shape({
    type: React.PropTypes.string,
    displayName: React.PropTypes.string,
    group: React.PropTypes.string,
  }),
};

const ButtonGroupDropdown = ({ groupName, groupButtons }) => (
  <div className="fb-ControlBar-dropdown">
    <button className="btn btn-default dropdown-toggle" data-toggle="dropdown">
      {groupName}
      <span className="caret"></span>
    </button>
    <ul className="dropdown-menu">
      {groupButtons.map(fieldDescription => (
        <ButtonDropdownOption description={fieldDescription} />
      ))}
    </ul>
  </div>
);

ButtonGroupDropdown.propTypes = {
  groupName: React.PropTypes.string,
  groupButtons: React.PropTypes.array,
};


const getDescrition = curry((fieldTypes, type) => {
  const construct = fieldTypes[type];
  return {
    type,
    displayName: construct.displayName,
    group: construct.group,
  };
});

const toGroups = (groups, description) => {
  // Add to group array if it exists. Create it if it doesn't
  groups[description.group] = groups[description.group] // eslint-disable-line no-param-reassign
    ? groups[description.group].concat([description])
    : [description];

  return groups;
};

const ControlBar = ({ fieldTypes }) => {
  const fieldGroups = Object.keys(fieldTypes)
    .map(getDescrition(fieldTypes))
    .reduce(toGroups, {});

  const buttonGroups = Object.keys(fieldGroups)
    .map(groupName => (
      <ButtonGroupDropdown
        groupName={groupName}
        groupButtons={buttonGroups[groupName]}
      />
    ));

  return (
    <div className="fb-ControlBar">
      {buttonGroups}
      <button> Undo </button>
    </div>
  );
};

ControlBar.propTypes = {
  fieldTypes: React.PropTypes.array,
};

export default ControlBar;

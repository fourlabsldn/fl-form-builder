import React from 'react';
import EventHub from './EventHub';
import FieldCreatorPropType from './default-fields/FieldCreatorPropType';


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

const ButtonGroupDropdown = ({ groupName, groupButtons }) => {
  return (
    <div className="fb-ControlBar-dropdown dropdown">
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
};
ButtonGroupDropdown.propTypes = {
  groupName: React.PropTypes.string,
  groupButtons: React.PropTypes.array,
};


const getDescrition = typeConstructor => {
  return {
    type: typeConstructor.info.type,
    displayName: typeConstructor.info.displayName,
    group: typeConstructor.info.group,
  };
};

const toGroups = (groups, description) => {
  // Add to group array if it exists. Create it if it doesn't
  groups[description.group] = groups[description.group] // eslint-disable-line no-param-reassign
    ? groups[description.group].concat([description])
    : [description];

  return groups;
};

const ControlBar = ({ fieldTypes }) => {
  const fieldGroups = fieldTypes
    .map(getDescrition)
    .reduce(toGroups, {});

  const buttonGroups = Object.keys(fieldGroups)
    .map(groupName => (
      <ButtonGroupDropdown
        groupName={groupName}
        groupButtons={fieldGroups[groupName]}
      />
    ));

  return (
    <div className="fl-fb-ControlBar">
      {buttonGroups}
      <button
        className="btn btn-primary"
        onClick={() => EventHub.trigger('undoBtnPressed')}
      > Undo </button>
    </div>
  );
};

ControlBar.propTypes = {
  fieldTypes: React.PropTypes.arrayOf(FieldCreatorPropType),
};

export default ControlBar;

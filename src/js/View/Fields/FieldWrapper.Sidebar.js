/* eslint-disable react/prop-types */
import React from "react";
const onDragStart = () => null;
const toggleConfig = () => null;
const deleteField = () => null;

const Sidebar = ({ fieldState }) => (
  <div className="fl-fb-Field-sidebar">
    <button
      className="glyphicon glyphicon-menu-hamburger fl-fb-Field-sidebar-btn"
      onDragStart={onDragStart}
      draggable="true"
      type="button"
    />
    <button
      className="glyphicon glyphicon-cog fl-fb-Field-sidebar-btn-config"
      onClick={() => toggleConfig(fieldState)}
      type="button"
    />
    <button
      className="glyphicon glyphicon-trash fl-fb-Field-sidebar-btn-delete"
      onClick={() => deleteField(fieldState)}
      type="button"
    />
  </div>
);


export default Sidebar;

/* eslint-disable react/prop-types */
import React from "react";
import store from "../../store";
import { toggleConfig, deleteField } from "../../Actions";

const onDragStart = () => null;

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
      onClick={() => store.dispatch(toggleConfig(fieldState))}
      type="button"
    />
    <button
      className="glyphicon glyphicon-trash fl-fb-Field-sidebar-btn-delete"
      onClick={() => store.dispatch(deleteField(fieldState))}
      type="button"
    />
  </div>
);


export default Sidebar;

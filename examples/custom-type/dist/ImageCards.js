(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react')) :
  typeof define === 'function' && define.amd ? define(['react'], factory) :
  (global.ImageCards = factory(global.React));
}(this, (function (React) { 'use strict';

React = 'default' in React ? React['default'] : React;

//
//
//    THIS IS THE PRECOMPILED VERSION ON THIS FILE
//
//    LOOK INTO DIST FOLDER FOR COMPILED VERSION TE BE
//
//    INCLUDED IN THE BROWSER
//

const typeInfo = {
  // Compulsory
  primitiveType: 'Dropdown',
  type: 'ImageCards',
  displayName: 'Image Cards',
  group: 'Custom Components',
  required: false,

  // Component specific fields
  title: 'My image component',
  options: ['http://via.placeholder.com/350?text=You+rock!'],

  newImageText: ''
};

// For Text Fields the initialState function will only return an object.
const initialState = () => Object.assign({}, typeInfo);

// When configuration is open, this is what is going to be displayed
/**
 * @method RenderConfigMode
 * @param  {Object} state : State
 * @param  {Function} update : State -> void // Will trigger a re-render
 */
const RenderEditor = ({ state, update }) => {
  const updateNewImageText = event => {
    const text = event.target.value;
    const newState = Object.assign({}, state, { newImageText: text });

    update(newState);
  };

  const addNewImage = event => {
    if (event.key !== 'Enter') {
      return;
    }
    const text = event.target.value;
    const newState = Object.assign({}, state, { newImageText: '',
      images: state.options.concat([text])
    });

    update(newState);
  };

  return React.createElement(
    'div',
    null,
    state.options.map(img => React.createElement('img', { alt: img, className: 'ImageCards-card', src: img })),
    !state.configShowing ? null : React.createElement(
      'div',
      { className: 'fl-fb-Field-config' },
      React.createElement('input', {
        type: 'text',
        value: state.newImageText,
        onChange: updateNewImageText,
        onKeyDown: addNewImage
      })
    )
  );
};

const ImageCards = {
  info: typeInfo,
  initialState,
  RenderEditor
};

return ImageCards;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvZXhhbXBsZXMvY3VzdG9tLXR5cGUvc3JjL0ltYWdlQ2FyZHMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy9cbi8vXG4vLyAgICBUSElTIElTIFRIRSBQUkVDT01QSUxFRCBWRVJTSU9OIE9OIFRISVMgRklMRVxuLy9cbi8vICAgIExPT0sgSU5UTyBESVNUIEZPTERFUiBGT1IgQ09NUElMRUQgVkVSU0lPTiBURSBCRVxuLy9cbi8vICAgIElOQ0xVREVEIElOIFRIRSBCUk9XU0VSXG4vL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5jb25zdCB0eXBlSW5mbyA9IHtcbiAgLy8gQ29tcHVsc29yeVxuICBwcmltaXRpdmVUeXBlOiAnRHJvcGRvd24nLFxuICB0eXBlOiAnSW1hZ2VDYXJkcycsXG4gIGRpc3BsYXlOYW1lOiAnSW1hZ2UgQ2FyZHMnLFxuICBncm91cDogJ0N1c3RvbSBDb21wb25lbnRzJyxcbiAgcmVxdWlyZWQ6IGZhbHNlLFxuXG4gIC8vIENvbXBvbmVudCBzcGVjaWZpYyBmaWVsZHNcbiAgdGl0bGU6ICdNeSBpbWFnZSBjb21wb25lbnQnLFxuICBvcHRpb25zOiBbXG4gICAgJ2h0dHA6Ly9pbmdyaWR3dS5kbW1kbWNmYXR0ZXIuY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy8yMDE1LzAxL3BsYWNlaG9sZGVyLnBuZycsXG4gIF0sXG5cbiAgbmV3SW1hZ2VUZXh0OiAnJyxcbn07XG5cblxuLy8gRm9yIFRleHQgRmllbGRzIHRoZSBpbml0aWFsU3RhdGUgZnVuY3Rpb24gd2lsbCBvbmx5IHJldHVybiBhbiBvYmplY3QuXG5jb25zdCBpbml0aWFsU3RhdGUgPSAoKSA9PiBPYmplY3QuYXNzaWduKHt9LCB0eXBlSW5mbyk7XG5cbi8vIFdoZW4gY29uZmlndXJhdGlvbiBpcyBvcGVuLCB0aGlzIGlzIHdoYXQgaXMgZ29pbmcgdG8gYmUgZGlzcGxheWVkXG4vKipcbiAqIEBtZXRob2QgUmVuZGVyQ29uZmlnTW9kZVxuICogQHBhcmFtICB7T2JqZWN0fSBzdGF0ZSA6IFN0YXRlXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gdXBkYXRlIDogU3RhdGUgLT4gdm9pZCAvLyBXaWxsIHRyaWdnZXIgYSByZS1yZW5kZXJcbiAqL1xuY29uc3QgUmVuZGVyRWRpdG9yID0gKHsgc3RhdGUsIHVwZGF0ZSB9KSA9PiB7XG4gIGNvbnN0IHVwZGF0ZU5ld0ltYWdlVGV4dCA9IGV2ZW50ID0+IHtcbiAgICBjb25zdCB0ZXh0ID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIGNvbnN0IG5ld1N0YXRlID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHt9LFxuICAgICAgc3RhdGUsXG4gICAgICB7IG5ld0ltYWdlVGV4dDogdGV4dCB9XG4gICAgKTtcblxuICAgIHVwZGF0ZShuZXdTdGF0ZSk7XG4gIH07XG5cbiAgY29uc3QgYWRkTmV3SW1hZ2UgPSBldmVudCA9PiB7XG4gICAgaWYgKGV2ZW50LmtleSAhPT0gJ0VudGVyJykgeyByZXR1cm47IH1cbiAgICBjb25zdCB0ZXh0ID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIGNvbnN0IG5ld1N0YXRlID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHt9LFxuICAgICAgc3RhdGUsXG4gICAgICB7IG5ld0ltYWdlVGV4dDogJycsXG4gICAgICAgIGltYWdlczogc3RhdGUub3B0aW9ucy5jb25jYXQoW3RleHRdKSxcbiAgICAgIH1cbiAgICApO1xuXG4gICAgdXBkYXRlKG5ld1N0YXRlKTtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxkaXY+XG4gICAgICB7c3RhdGUub3B0aW9ucy5tYXAoaW1nID0+IDxpbWcgYWx0PXtpbWd9IGNsYXNzTmFtZT1cIkltYWdlQ2FyZHMtY2FyZFwiIHNyYz17aW1nfSAvPil9XG5cbiAgICAgIHshc3RhdGUuY29uZmlnU2hvd2luZ1xuICAgICAgICA/IG51bGxcbiAgICAgICAgOiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmwtZmItRmllbGQtY29uZmlnXCI+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICB2YWx1ZT17c3RhdGUubmV3SW1hZ2VUZXh0fVxuICAgICAgICAgICAgb25DaGFuZ2U9e3VwZGF0ZU5ld0ltYWdlVGV4dH1cbiAgICAgICAgICAgIG9uS2V5RG93bj17YWRkTmV3SW1hZ2V9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuY29uc3QgSW1hZ2VDYXJkcyA9IHtcbiAgaW5mbzogdHlwZUluZm8sXG4gIGluaXRpYWxTdGF0ZSxcbiAgUmVuZGVyRWRpdG9yLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgSW1hZ2VDYXJkcztcbiJdLCJuYW1lcyI6WyJ0eXBlSW5mbyIsImluaXRpYWxTdGF0ZSIsIk9iamVjdCIsImFzc2lnbiIsIlJlbmRlckVkaXRvciIsInN0YXRlIiwidXBkYXRlIiwidXBkYXRlTmV3SW1hZ2VUZXh0IiwiZXZlbnQiLCJ0ZXh0IiwidGFyZ2V0IiwidmFsdWUiLCJuZXdTdGF0ZSIsIm5ld0ltYWdlVGV4dCIsImFkZE5ld0ltYWdlIiwia2V5Iiwib3B0aW9ucyIsImNvbmNhdCIsIm1hcCIsImltZyIsImNvbmZpZ1Nob3dpbmciLCJJbWFnZUNhcmRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7Ozs7Ozs7QUFTQSxBQUVBLE1BQU1BLFdBQVc7O2lCQUVBLFVBRkE7UUFHVCxZQUhTO2VBSUYsYUFKRTtTQUtSLG1CQUxRO1lBTUwsS0FOSzs7O1NBU1Isb0JBVFE7V0FVTixDQUNQLDZFQURPLENBVk07O2dCQWNEO0NBZGhCOzs7QUFtQkEsTUFBTUMsZUFBZSxNQUFNQyxPQUFPQyxNQUFQLENBQWMsRUFBZCxFQUFrQkgsUUFBbEIsQ0FBM0I7Ozs7Ozs7O0FBUUEsTUFBTUksZUFBZSxDQUFDLEVBQUVDLEtBQUYsRUFBU0MsTUFBVCxFQUFELEtBQXVCO1FBQ3BDQyxxQkFBcUJDLFNBQVM7VUFDNUJDLE9BQU9ELE1BQU1FLE1BQU4sQ0FBYUMsS0FBMUI7VUFDTUMsV0FBV1YsT0FBT0MsTUFBUCxDQUNmLEVBRGUsRUFFZkUsS0FGZSxFQUdmLEVBQUVRLGNBQWNKLElBQWhCLEVBSGUsQ0FBakI7O1dBTU9HLFFBQVA7R0FSRjs7UUFXTUUsY0FBY04sU0FBUztRQUN2QkEsTUFBTU8sR0FBTixLQUFjLE9BQWxCLEVBQTJCOzs7VUFDckJOLE9BQU9ELE1BQU1FLE1BQU4sQ0FBYUMsS0FBMUI7VUFDTUMsV0FBV1YsT0FBT0MsTUFBUCxDQUNmLEVBRGUsRUFFZkUsS0FGZSxFQUdmLEVBQUVRLGNBQWMsRUFBaEI7Y0FDVVIsTUFBTVcsT0FBTixDQUFjQyxNQUFkLENBQXFCLENBQUNSLElBQUQsQ0FBckI7S0FKSyxDQUFqQjs7V0FRT0csUUFBUDtHQVhGOztTQWVFOzs7VUFDU0ksT0FBTixDQUFjRSxHQUFkLENBQWtCQyxPQUFPLDZCQUFLLEtBQUtBLEdBQVYsRUFBZSxXQUFVLGlCQUF6QixFQUEyQyxLQUFLQSxHQUFoRCxHQUF6QixDQURIO0tBR0lkLE1BQU1lLGFBQVAsR0FDRyxJQURILEdBR0M7O1FBQUssV0FBVSxvQkFBZjs7Y0FFUyxNQURQO2VBRVNmLE1BQU1RLFlBRmY7a0JBR1lOLGtCQUhaO21CQUlhTzs7O0dBWnJCO0NBMUJGOztBQThDQSxNQUFNTyxhQUFhO1FBQ1hyQixRQURXO2NBQUE7O0NBQW5CLENBTUE7Ozs7In0=

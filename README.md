# fl-form-builder

[![Build Status](https://travis-ci.org/fourlabsldn/fl-form-builder.svg?branch=master)](https://travis-ci.org/fourlabsldn/fl-form-builder)

A JS form builder **inspired by Google Forms**.

- **[Try it online.](https://fourlabsldn.github.io/fl-form-builder/examples/custom-type/)**

![Usage demo](https://fourlabsldn.github.io/fl-form-builder/examples/usage-demo.gif)


## Getting started
### Creating a form-builder
Just load the javascript and the CSS and call `new FormBuilder(container)`, using the
`FormBuilder` global object.

```html
<!-- RequireJS -->
<link rel="stylesheet" href="../dist/fl-form-builder.css">
<script src="../dist/fl-form-builder.js"></script>

<div class="form-builder-container"></div>

<script>
  var container = document.querySelector('.form-builder-container');
  const formBuilder = new FormBuilder(container);
</script>
```

### Saving the form state
To save the created form just store the object – or a serialization of it – returned by `formBuilder.exportState()`.

``` javascript
  // exporting
  const state = formBuilder.exportState();
```

### Restoring a form state
If you want to get the form-builder back to the way it was when the user last used it, you can just import the state you saved with the `importState` method. You could, for example, do that when the form loads.

``` javascript
  // importing
  const formBuilder = new FormBuilder(container);
  formBuilder.importState(state);
```

# Plugins

 You can add custom field types. They must follow this react signature:


``` javascript
  const FieldCreatorPropType = {
    info: React.PropTypes.shape({
      type: React.PropTypes.string,
      group: React.PropTypes.string,
      displayName: React.PropTypes.string,
    }),
    initialState: React.PropTypes.shape({
      type: React.PropTypes.string,
      group: React.PropTypes.string,
      displayName: React.PropTypes.string,

      required: React.PropTypes.bool,
      configShowing: React.PropTypes.bool,
    }),
    RenderEditor: React.PropTypes.func, // React render function
  };
```

To add your plugins just send them in an array at instantiation time.

``` javascript
  const formBuilder = new FormBuilder(container. [CustomPlugin1, CustomPlugin1]);
```

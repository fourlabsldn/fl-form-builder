import buildTextFieldConstructor from './buildTextFieldConstructor';

const TimeField = buildTextFieldConstructor({
    type: 'TimeField',
    displayName: 'Time Field',
    htmlInputType: 'time',
});

export default TimeField;

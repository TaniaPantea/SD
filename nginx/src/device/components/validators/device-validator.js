function ValidateDevice(value, rules) {

    function requiredValidator(value) {
        return value !== null && value !== undefined && value.toString().trim() !== '';
    }

    function positiveNumberValidator(value) {
        return typeof value === 'number' && value > 0;
    }

    function booleanValidator(value) {
        return typeof value === 'boolean';
    }

    let isValid = true;

    for (let rule in rules) {
        switch (rule) {
            case 'isRequired':
                isValid = isValid && requiredValidator(value);
                break;
            case 'positiveNumber':
                isValid = isValid && positiveNumberValidator(value);
                break;
            case 'isBoolean':
                isValid = isValid && booleanValidator(value);
                break;
            default:
                isValid = true;
        }
    }

    return isValid;
}

export default ValidateDevice;

// convert object list to array
const asArray = (source) => {
    return Object.entries(source);
};

// convert array to object list
const asObject = (source) => {
    return Object.fromEntries(source);
};

// delete specific element from object list
const deleteElement = (source, key) => {
    source_as_array = asArray(source);

    let element = source_as_array.filter(value => value[0] === key)[0];
    source_as_array.splice(source_as_array.indexOf(element), 1);

    return asObject(source_as_array);
};

const isArray = (element) => {
    if (element.length !== undefined && typeof element === 'object') {
        return true;
    }
    return false;
};

const isObject = (element) => {
    if (element.length === undefined && typeof element === 'object') {
        return true;
    }
    return false;
};

// generate invalid message
const invalidMessage = (rules) => {
    message = rules.property.message;
    rules = deleteElement(rules, "value");
    rules.property = deleteElement(rules.property, "message");

    list_data = {};

    rules_as_array = asArray(rules);

    rules_as_array.forEach(rule => {
        if (rule[0] == 'property') {
            rule_as_array = asArray(rule[1]);

            rule_as_array.forEach((data) => {
                list_data['property.' + data[0]] = data[1];
            });
        } else {
            list_data[rule[0]] = rule[1];
        }
    });

    asArray(list_data).forEach(data => {
        message = message.replace(`{${data[0]}}`, data[1]);
    });

    return message;
};

module.exports = {
    asArray,
    asObject,
    deleteElement,
    isArray,
    isObject,
    invalidMessage
};
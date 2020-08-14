const {
    toArray,
    deleteElement
} = require("./core")

const setMessage = (rules) => {
    message = rules.property.message;
    rules = deleteElement(rules, "value");
    rules.property = deleteElement(rules.property, "message");

    list = {};

    rules_as_array = toArray(rules);

    rules_as_array.forEach((rule) => {
        if (rule[0] == 'property') {
            rule_as_array = toArray(rule[1]);

            rule_as_array.forEach((data) => {
                list['property.' + data[0]] = data[1];
            });
        } else {
            list[element[0]] = element[1];
        }
    });

    arrayList = toArray(list);

    arrayList.forEach((element) => {
        message = message.replace(`{${element[0]}}`, element[1]);
    });

    return message;
}


const TYPE_VALIDATOR = {
    NUMBER: {
        name: 'NUMBER',
        attribute: '',
        property: {
            message: 'The {attribute} must a number!',
        },
        action: (data) => {
            if (typeof (data.value) == 'number') {
                return;
            } else {
                return setMessage(data);
            }
        }
    },
    STRING: {
        name: 'STRING',
        attribute: '',
        property: {
            message: 'The {attribute} must a string!',
        },
        action: (data) => {
            if (typeof (data.value) == 'string') {
                return;
            } else {
                return setMessage(data);
            }
        }
    },
    BOOLEAN: {
        name: 'BOOLEAN',
        attribute: '',
        property: {
            message: 'The {attribute} must a boolean!',
        },
        action: (data) => {
            if (typeof (data.value) == 'boolean') {
                return;
            } else {
                return setMessage(data);
            }
        }
    },
    OBJECT: {
        name: 'OBJECT',
        attribute: '',
        property: {
            message: 'The {attribute} must a object!',
        },
        action: (data) => {
            if (typeof data.value === 'object') {
                return;
            }
            return setMessage(data);
        }
    },
    ARRAY: {
        name: 'ARRAY',
        attribute: '',
        property: {
            message: 'The {attribute} must a object!',
        },
        action: (data) => {
            if (typeof data.value === 'object') {
                hasLength = data.value.length;
                if (hasLength !== undefined) return;
            }
            return setMessage(data);
        }
    },
    REQUIRED: {
        name: 'REQUIRED',
        attribute: '',
        property: {
            message: 'The {attribute} is required.',
        },
        action: (data) => {
            if (data.value === undefined || data.value === null) {
                return setMessage(data);
            }
            return;
        }
    },
    START_WITH: {
        name: 'START_WITH',
        attribute: '',
        property: {
            message: `The {attribute} must started with "{property.value}"`,
        },
        action: (data) => {
            try {
                value = data.value.split(" ");
                if (value[0] == data.property.value) {
                    return;
                }
                return setMessage(data);
            } catch (e) {
                return setMessage(data);
            }
        }
    },
    EQUAL_WITH: {
        name: 'EQUAL_WITH',
        attribute: '',
        property: {
            targetAttribute: '',
            targetAttributeValue: '',
            message: 'The {attribute} must equal with {property.targetAttribute}',
        },
        action: (data) => {
            if (data.value === data.property.targetAttributeValue) {
                return;
            }
            return setMessage(data);
        }
    },
    GREATER_THAN: {
        name: 'GREATER_THAN',
        attribute: '',
        property: {
            targetAttribute: '',
            targetAttributeValue: '',
            message: 'The {attribute} must greather than {property.targetAttribute}',
        },
        action: (data) => {
            if (typeof data.value === 'number' && typeof data.property.targetAttributeValue === 'number') {
                if (data.value > data.property.targetAttributeValue) {
                    return;
                }
                return setMessage(data);
            }
            data.property.message = 'The {attribute} and {property.targetAttribute} must a number!';
            return setMessage(data);
        }
    },
};

module.exports = TYPE_VALIDATOR;
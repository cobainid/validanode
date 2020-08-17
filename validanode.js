const {
    deleteElement,
    isArray,
    isObject,
    asArray,
} = require("./lib/core");

class validanode {
    CUSTOM_MESSAGE = {};
    TYPE_VALIDATOR = {};

    constructor() {
        this.TYPE_VALIDATOR = require('./TYPE_VALIDATOR');
    }

    getTypeValidator(type_name) {
        try {
            type_name = type_name.toUpperCase().split('.');

            let data = undefined;
            type_name.forEach(index => {
                if (data == undefined) {
                    data = this.TYPE_VALIDATOR[index];
                } else {
                    data = data[index];
                }
            });
            return data;
        } catch (e) {
            throw new e;
        }
    }

    setCustomMessage(custom_messages) {

        asArray(custom_messages).forEach((msg) => {
            let key = msg[0];
            let newCustomMessage = msg[1];

            let rule = this.getTypeValidator(key); // mendapatkan rule

            rule.property.message = newCustomMessage;
            this.TYPE_VALIDATOR = Object.assign({}, this.TYPE_VALIDATOR, rule);
        });
    }


    validateField(attribute, rule, data) {
        let property = rule.property;
        if (rule.rule !== undefined) rule = rule.rule;
        let action = rule.action;

        rule.attribute = attribute;
        rule.value = data[attribute];

        rule = deleteElement(rule, 'action');

        if (property) {
            let property_as_array = asArray(property);
            if (property_as_array.length > 0) {
                let has_target_attribute = false;

                property_as_array.forEach((element) => {
                    if (element[0] === 'targetAttribute') has_target_attribute = true;
                    rule.property[element[0]] = element[1];
                });

                if (has_target_attribute) rule.property['targetAttributeValue'] = data[property.targetAttribute];
            }
        }

        return action(rule);
    }


    actionValidate(resolve, err, attribute, rule, data) {
        let is_error = this.validateField(attribute, rule, data);
        if (is_error) {
            if (err[attribute] == undefined) err[attribute] = [];
            err[attribute].push(is_error);
            resolve(err);
        }
    }


    check(fields, data) {
        return new Promise(async (resolve) => {
            let err = {};

            // check jika object tidak berupa array
            if (isObject(fields)) {
                fields = [fields];
            }

            fields.forEach((field) => {

                let attributes = field.attribute;
                let rules = field.rules;

                if (isArray(attributes)) {
                    // banyak attributes
                    attributes.forEach((attribute) => {
                        if (isArray(rules)) {
                            // banyak rules
                            rules.forEach((rule) => {
                                this.actionValidate(resolve, err, attribute, rule, data);
                            });
                        } else {
                            // satu rule
                            this.actionValidate(resolve, err, attribute, rules, data);
                        }
                    });
                } else {
                    // satu attribute
                    if (isArray(rules)) {
                        // banyak rules
                        rules.forEach((rule) => {
                            this.actionValidate(resolve, err, attributes, rule, data);
                        })
                    } else {
                        // satu rule
                        this.actionValidate(resolve, err, attributes, rules, data);
                    }
                }
            });
        })
    }
}


module.exports = validanode
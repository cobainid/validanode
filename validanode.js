const {
    deleteElement,
    isArray,
    isObject,
    asArray,
    asObject,
} = require("./lib/core");

class validanode {

    TYPE_VALIDATOR = {};

    constructor() {
        this.TYPE_VALIDATOR = require('./TYPE_VALIDATOR');
    }

    add(custom_validation) {
        let keys = Object.keys(custom_validation);
        let rules = {};
        if (keys.length < 2) keys = keys[0];

        if (typeof keys === "string") {
            rules = this.getTypeValidator(keys);
            if (rules === undefined) {
                this.TYPE_VALIDATOR = Object.assign({}, this.TYPE_VALIDATOR, custom_validation);
            } else {
                rules = Object.assign({}, rules, custom_validation[keys]);
                // build as schema
                rules = asObject([
                    [keys, rules]
                ]);
                this.TYPE_VALIDATOR = Object.assign({}, this.TYPE_VALIDATOR, rules);
            }
        }

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
            throw (e);
        }
    }

    localization(custom_messages) {

        asArray(custom_messages).forEach((msg) => {
            let key = msg[0];
            let newCustomMessage = msg[1];

            let rule = this.getTypeValidator(key); // mendapatkan rule

            rule.property.message = newCustomMessage;

            if (rule.name !== undefined) {
                rule = asObject([
                    [rule.name, rule]
                ]);
            }

            this.TYPE_VALIDATOR = Object.assign({}, this.TYPE_VALIDATOR, rule);
        });
    }


    validateField(attribute, rule, data) {
        let property = rule.property;
        asArray(rule).forEach( data => {
            let key = data[0].split(".");
            if(key.length > 1 && key[0] === "property"){
                key.shift();
                
                let value = data[1];
                let object = asObject([
                    [key[0], value]
                ]);

                property = Object.assign({}, property, object);
            }
        })
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

    checkRule(rules) {
        let rule_count = rules.length;

        for (let i = 0; i < rule_count; i++) {
            if (typeof rules[i] === "string") {
                let temp_rule = this.getTypeValidator(rules[i]);
                if (temp_rule) {
                    rules[i] = temp_rule;
                } else {
                    throw (`TYPE VALIDATOR "${rules[i]} NOT FOUND !!!"`);
                }
            }
            if (typeof rules[i].rule === "string") {
                let temp_rule = this.getTypeValidator(rules[i].rule);
                if (temp_rule) {
                    rules[i].rule = temp_rule;
                } else {
                    throw (`TYPE VALIDATOR "${rules[i].rule} NOT FOUND !!!"`);
                }
            }
        }

        return rules;
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

                // mengubah type data menjadi array
                if (!isArray(attributes)) {
                    attributes = [attributes];
                }
                if (!isArray(rules)) {
                    rules = [rules];
                }

                rules = this.checkRule(rules); // exist or not

                if (isArray(attributes)) {
                    attributes.forEach((attribute) => {
                        rules.forEach((rule) => {
                            this.actionValidate(resolve, err, attribute, rule, data);
                        });
                    });
                }
            });
        })
    }
}


module.exports = validanode
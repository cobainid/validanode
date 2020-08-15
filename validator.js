const {
    deleteElement,
    isArray,
    toArray
} = require("./core");

class validanode {
    validateField(attribute, rule, data) {
        let property = rule.property;
        if (rule.rule !== undefined) rule = rule.rule;
        let action = rule.action;

        rule.attribute = attribute;
        rule.value = data[attribute];

        rule = deleteElement(rule, 'action');

        if (property) {
            let property_as_array = toArray(property);
            if (property_as_array.length > 0) {
                let hasTargetAttribute = false;

                property_as_array.forEach((element) => {
                    if (element[0] === 'targetAttribute') hasTargetAttribute = true;
                    rule.property[element[0]] = element[1];
                });

                if (hasTargetAttribute) rule.property['targetAttributeValue'] = data[property.targetAttribute];
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


    validator(fields, data) {
        return new Promise(async (resolve) => {
            let err = {};

            // check jika object tidak berupa array
            if (fields.length === undefined && typeof fields === 'object') {
                fields = [fields];
            }

            fields.forEach((field) => {

                let attributes = field.attribute;
                let rules = field.rules;

                if (isArray(attributes)) {
                    // banyak attribute
                    attributes.forEach((attribute) => {
                        if (isArray(rules)) {
                            // banyak rules
                            rules.forEach((rule) => {
                                this.actionValidate(resolve, err, attribute, rule, data);
                            });
                        } else {
                            // satu rules
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
                        // satu rules
                        this.actionValidate(resolve, err, attributes, rules, data);
                    }
                }
            });
        })
    }
}


module.exports = validanode
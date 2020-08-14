const deleteAction = (rule) => {
    let ruleEntries = Object.entries(rule);

    // get action
    let action = ruleEntries.filter(a => a[0] === 'action')[0];
    ruleEntries.splice(ruleEntries.indexOf(action), 1);
    rule = Object.fromEntries(ruleEntries);

    return rule;
}


const validateField = (attribute, rule, data) => {
    property = rule.property;
    if (rule.rule !== undefined) rule = rule.rule;
    action = rule.action;

    rule.attribute = attribute;
    rule.value = data[attribute];

    rule = deleteAction(rule);

    if (property) {
        if (Object.entries(property).length > 0) {
            let hasTargetAttribute = false;
            Object.entries(property).forEach((element) => {
                if (element[0] === 'targetAttribute') hasTargetAttribute = true;
                rule.property[element[0]] = element[1];
            });

            if (hasTargetAttribute) rule.property['targetAttributeValue'] = data[property.targetAttribute];
        }
    }

    return action(rule);
}

const actionValidate = (resolve, err, attribute, rule, data) => {
    let is_error = validateField(attribute, rule, data);
    if (is_error) {
        if (err[attribute] == undefined) err[attribute] = [];
        err[attribute].push(is_error);
        resolve(err);
    }
}

const isArray = (element) => {
    if (element.length !== undefined && typeof element === 'object') {
        return true;
    }
    return false;
}



const validator = (fields, data, messages = null) => {
    return new Promise(async (resolve) => {
        let err = {};

        // let hasMessage = (messages == null) ? false : true;

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
                            actionValidate(resolve, err, attribute, rule, data);
                        });
                    } else {
                        // satu rules
                        actionValidate(resolve, err, attribute, rules, data);
                    }
                });
            } else {
                // satu attribute
                if (isArray(rules)) {
                    // banyak rules
                    rules.forEach((rule) => {
                        actionValidate(resolve, err, attributes, rule, data);
                    })
                } else {
                    // satu rules
                    actionValidate(resolve, err, attributes, rules, data);
                }
            }
        });
    })
}

const checkTypeValidator = (TYPE) => {
    // console.log(typeof isRuleExist);
    // if (isRuleExist(TYPE)) return TYPE_VALIDATOR[TYPE];
    return "TYPE doesnt exist";
}

module.exports = validator
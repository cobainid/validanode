const popElement = (rule) => {
    let ruleEntries = Object.entries(rule);

    let action = ruleEntries.filter(a => a[0] === 'action')[0];
    ruleEntries.splice(ruleEntries.indexOf(action), 1);
    rule = Object.fromEntries(ruleEntries);

    return rule;
}


const checkRule = (attribute, rule, data) => {
    property = rule.property;
    if (rule.rule !== undefined) rule = rule.rule;
    action = rule.action;

    rule.attribute = attribute;
    rule.value = data[attribute];

    rule = popElement(rule);

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

const validator = (fields, data, messages = null) => {
    return new Promise(async (resolve) => {
        let err = {};

        if( fields.length === undefined && typeof fields === 'object'){
            fields = [fields];
        }

        fields.forEach((field) => {

            let attributes = field.attribute;
            let rules = field.rules;

            if (attributes.length && typeof (attributes) == 'object') {
                // banyak attribute
                attributes.forEach((attribute) => {
                    if (rules.length && typeof (rules) == 'object') {
                        // banyak rules
                        rules.forEach((rule) => {
                            let is_error = checkRule(attribute, rule, data);
                            if (is_error) {
                                if (err[attribute] == undefined) err[attribute] = [];
                                err[attribute].push(is_error);
                                resolve(err);
                            }
                        });
                    } else {
                        // satu rules
                        let is_error = checkRule(attribute, rules, data);
                        if (is_error) {
                            if (err[attribute] == undefined) err[attribute] = [];
                            err[attribute].push(is_error);
                            resolve(err);
                        }
                    }
                });
            } else {
                // satu attribute
                if (rules.length && typeof (rules) == 'object') {
                    // banyak rules
                    rules.forEach((rule) => {
                        let is_error = checkRule(attributes, rule, data);
                        if (is_error) {
                            if (err[attributes] == undefined) err[attributes] = [];
                            err[attributes].push(is_error);
                            resolve(err);
                        }
                    })
                } else {
                    // satu rules
                    let is_error = checkRule(attributes, rules, data);

                    if (is_error) {
                        if (err[attributes] == undefined) err[attributes] = [];
                        err[attributes].push(is_error);
                        resolve(err);
                    }
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
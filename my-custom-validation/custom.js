const {
    invalidMessage
} = require("./../lib/core");

const CUSTOM_VALIDATION = {
    EMAIL: {
        YAHOO: {
            name: 'EMAIL.YAHOO',
            property: {
                message: 'The {attribute} should be a valid yahoo mail.'
            },
            action: function (data) {
                value = data.value
                regex = /[a-zA-Z0-9\.].+\@yahoo\.com/i
                if (value.match(regex)) {
                    return;
                }
                return invalidMessage(data);
            }
        }
    }
}

module.exports = CUSTOM_VALIDATION;
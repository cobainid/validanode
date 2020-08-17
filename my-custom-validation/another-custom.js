const {
    invalidMessage
} = require("./../lib/core");

const ANOTHER_CUSTOM_VALIDATION = {
    EMAIL: {
        GOOGLE: {
            name: 'EMAIL.GOOGLE',
            property: {
                message: 'The {attribute} should be a valid google mail.'
            },
            action: function (data) {
                value = data.value
                regex = /[a-zA-Z0-9\.].+\@gmail\.com/i
                if (value.match(regex)) {
                    return;
                }
                return invalidMessage(data);
            }
        }
    }
}

module.exports = ANOTHER_CUSTOM_VALIDATION;
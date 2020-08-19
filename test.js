const validanode = require('./validanode.js');
const messages = require('./localization/id_ID');
const customValidation = require('./my-custom-validation/custom');
const anotherCustomValidation = require('./my-custom-validation/another-custom');

const validator = new validanode();


validator.add(customValidation);
validator.add(anotherCustomValidation);

validator.localization(messages);

const {
    START_WITH,
    GREATER_THAN,
    EMAIL
} = validator.TYPE_VALIDATOR;

const main = async () => {
    data = {
        username: 12,
        password: 12,
        re_password: 17,
        numb_1: 12,
        numb_2: 22,
        email_google: "example@gamil.com",
        email_yahoo: "example@yaho.com",
    };

    fields = [{
            attribute: ['username', 'password', 're_password'],
            rules: ["REQUIRED", "STRING"],
        },
        {
            attribute: 'username',
            rules: {
                rule: START_WITH,
                'property.value': 'defrindr_',
            },
        }, {
            attribute: 're_password',
            rules: {
                rule: 'EQUAL_WITH',
                'property.targetAttribute': 'password',
                'property.message': 'Kolom {attribute} itu kudune podo karo {property.targetAttribute}',
            },
        }, {
            attribute: 'numb_1',
            rules: {
                rule: GREATER_THAN.ATTRIBUTE,
                'property.targetAttribute': 'numb_2',
            },
        }, {
            attribute: 'email_yahoo',
            rules: EMAIL.YAHOO,
        }, {
            attribute: 'email_google',
            rules: EMAIL.GOOGLE,
        }
    ];

    err = await validator.check(fields, data);
    if (err) return err;
}

(function () {
    main().then(result => console.log(result));
})();
const {
    REQUIRED,
    STRING,
    START_WITH,
    EQUAL_WITH,
    GREATER_THAN,
    NUMBER
} = require('./TYPE_VALIDATOR.js');

const validanode = require('./validator.js');

const validator = new validanode();

const messages = {
    REQUIRED: 'Kolom {attribute} tidak boleh kosong!',
    STRING: 'Kolom {attribute} harus berupa string!',
    NUMBER: 'Kolom {attribute} harus berupa angka!',
    EQUAL_WITH: 'Kolom {attribute} harus sama dengan {targetAttribute}!',
};

// validator.set('message', messages);

const main = async () => {
    data = {
        username: 12,
        password: 12,
        re_password: 17,
        numb_1: 12,
        numb_2: 22,
    };

    fields = [{
            // attribute: 'username',
            attribute: ['username', 'password', 're_password'],
            rules: [ REQUIRED, STRING ],
            // rules: REQUIRED
        },
        {
            attribute: 'username',
            rules: {
                rule: START_WITH,
                property: {
                    value: 'defrindr_',
                    message: 'Kolom {attribute} harus berawalan "{property.value}"'
                }
            },
        }, {
            attribute: 're_password',
            rules: {
                rule: EQUAL_WITH,
                property: {
                    targetAttribute: 'password',
                    message: 'Kolom {attribute} harus sama dengan "{property.targetAttribute}"'
                }
            },
        }, {
            attribute: 'numb_1',
            rules: {
                rule: GREATER_THAN,
                property: {
                    targetAttribute: 'numb_2',
                    message: 'Kolom {attribute} harus lebih besar dari {property.targetAttribute}'
                }
            },
        }
    ];

    err = await validator.validator(fields, data);
    if(err) return err;
}

(function () {
    main().then(result => console.log(result));
})();
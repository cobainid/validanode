# VALIDANODE

## Description
VALIDANODE adalah sebuah validator yang dibuat dengan Javascript.

## Installation

```bash
npm install validanode
```

## How To Use

### Simple Usage

```javascript
const validanode = require('validanode');

const validator = new validanode;

const {
    REQUIRED,
    STRING
} = validator.TYPE_VALIDATOR;

(async function () {
    let data = {
        name: "Defri Indra Mahardika",
        age: 17,
    };

    let field = {
        attribute: ['name', 'age'],
        rules: [REQUIRED, STRING],
        // rules: ["REQUIRED", "STRING"],
    };

    err = await validator.check(field, data);

    if (err) {
        console.log(err);
    }

})();

// OUTPUT :
// {
//     age: ['The age must a string!']
// }
```

### Change Error Message

```javascript
const validanode = require('validanode');

const validator = new validanode;

const { REQUIRED } = validator.TYPE_VALIDATOR;

(async function () {
    let data = {
        // name: "Defri Indra Mahardika",
        age: 17,
    };

    let field = {
        attribute: ['name', 'age'],
        rules: [{
            rule: REQUIRED,
            'property.message': "Kolom '{attribute}' tidak boleh kosong."
        }, {
            rule: "STRING",
            'property.message': "Kolom '{attribute}' harus berupa string."
        }],
    };

    err = await validator.check(field, data);

    if (err) {
        console.log(err);
    }

})();

// OUTPUT :
// {
//     name: [
//         "Kolom 'name' tidak boleh kosong.",
//         "Kolom 'name' harus berupa string."
//     ],
//     age: ["Kolom 'age' harus berupa string."]
// }
```

### Get Type Validator Schema

```javascript
const validanode = require('validanode');

const validator = new validanode;

const {
    START_WITH
} = validator.TYPE_VALIDATOR;

(async function () {

    equal_with_schema = validator.getTypeValidator('EQUAL_WITH');
    console.log('EQUAL_WITH :')
    console.log(equal_with_schema)

    // Atau bisa juga dengan
    
    console.log('START_WITH :')
    console.log(START_WITH)

})();

// OUTPUT :
// 
// EQUAL_WITH: {
//     name: 'EQUAL_WITH',
//     attribute: '',
//     property: {
//         targetAttribute: '',
//         message: 'The {attribute} must equal with {property.targetAttribute}'
//     },
//     action: [Function: action]
// }
// START_WITH: {
//     name: 'START_WITH',
//     attribute: '',
//     property: {
//         value: '',
//         message: 'The {attribute} must started with "{property.value}"'
//     },
//     action: [Function: action]
// }
```

### Add Custom Validator

```javascript
const validanode = require('validanode');
const {
    invalidMessage
} = require("./lib/core");

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

const validator = new validanode;

validator.add(CUSTOM_VALIDATION);

(async function () {
    let data = {
        email: 'example@gmail.com'
    }
    let fields = {
        attribute: 'email',
        rules: 'EMAIL.YAHOO'
    }

    let err = await validator.check(fields, data);

    if(err){
        console.log(err);
    }

})();

// OUTPUT :
// {
//     email: ['The email should be a valid yahoo mail.']
// }
```


### Localization

```javascript
const validanode = require('validanode');

const MESSAGES = {
    'number': 'Kolom {attribute} harus berupa number!',
    'required': 'Kolom {attribute} tidak boleh kosong.',
    'greater_than.attribute': 'Kolom {attribute} harus lebih besar dari kolom {property.targetAttribute}',
};

const validator = new validanode;


validator.localization(MESSAGES);

(async function () {
    let data = {
        field_1: 12,
        // field_2: 1,
    };

    let fields = [{
        attribute: ['field_1', 'field_2'],
        rules: ['required', 'number']
    }, {
        attribute: 'field_1',
        rules: {
            rule: 'greater_than.attribute',
            'property.targetAttribute': 'field_2'
        }
    }]

    let err = await validator.check(fields, data);

    if (err) {
        console.log(err);
    }

})();

// OUTPUT :
// {
//     field_2: [
//         'Kolom field_2 tidak boleh kosong.',
//         'Kolom field_2 harus berupa number!'
//     ],
//     field_1: ['Kolom field_1 harus lebih besar dari kolom field_2']
// }
```




# VALIDANODE


## Table of Content

- [VALIDANODE](#validanode)
    - [Table of Content](#table-of-content)
    - [Description](#description)
    - [Installation](#installation)
    - [How To Use](#how-to-use)
        - [Simple Usage](#simple-usage)
        - [Get All Validator](#get-all-validator)
        - [Change Error Message](#change-error-message)
        - [Get Validator Schema](#get-validator-schema)
        - [Add Custom Validator](#add-custom-validator)
        - [Localization](#localization)


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

(async function () {
    let data = {
        name: "Defri Indra Mahardika",
        age: 17,
    };
    let field = {
        attribute: ['name', 'age'],
        rules: ['required', 'string'],
    };
    err = await validator.check(field, data);

    if (err) console.log(err);
})();
```

OUTPUT :

```javascript
{ age: [ 'The age must a string!' ] }
```


### Get All Validator

```javascript
const validanode = require('validanode');
const customValidation = require('validanode/my-custom-validation/custom');
const anotherCustomValidation = require('validanode/my-custom-validation/another-custom');
const validator = new validanode();

validator.add(customValidation);
validator.add(anotherCustomValidation);

(async function () {
    validator
        .getValidators()
        .then(result => console.log(result));
})();
```

OUTPUT :

```javascript
[
  'NUMBER',
  'STRING',
  'BOOLEAN',
  'OBJECT',
  'ARRAY',
  'REQUIRED',
  'START_WITH',
  'EQUAL_WITH',
  'GREATER_THAN.ATTRIBUTE',
  'EMAIL.YAHOO',
  'EMAIL.GOOGLE'
]
```


### Change Error Message

```javascript
const validanode = require('validanode');
const validator = new validanode;

(async function () {
    let data = {
        // name: "Defri Indra Mahardika",
        age: 17,
    };
    let field = {
        'attribute': ['name', 'age'],
        'rules': [{
            'rule': 'required',
            'property.message': "Kolom '{attribute}' tidak boleh kosong."
        }, {
            'rule': "string",
            'property.message': "Kolom '{attribute}' harus berupa string."
        }],
    };
    let err = await validator.check(field, data);

    if (err) console.log(err);
})();
```

OUTPUT : 

```javascript
{
  name: [
    "Kolom 'name' tidak boleh kosong.",
    "Kolom 'name' harus berupa string."
  ],
  age: [ "Kolom 'age' harus berupa string." ]
}
```

### Get Validator Schema

```javascript
const validanode = require('validanode');
const validator = new validanode;

(async function () {
    let schema = validator.getValidator('EQUAL_WITH');
    console.log(schema);
})();
```

OUTPUT : 

```javascript
{
  name: 'EQUAL_WITH',
  attribute: '',
  property: {
    targetAttribute: '',
    message: 'The {attribute} must equal with {property.targetAttribute}'
  },
  action: [Function: action]
}
```

### Add Custom Validator

```javascript
const Validanode = require("validanode");
const { invalidMessage } = require("validanode/lib/core");
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
};
const validator = new Validanode;
validator.add(CUSTOM_VALIDATION);

(async function () {
    let data = {
        email: 'example@gmail.com'
    };
    let fields = {
        attribute: 'email',
        rules: 'EMAIL.YAHOO'
    };
    let err = await validator.check(fields, data);
    if (err) console.log(err);
})();
```

OUTPUT : 

```javascript
{ email: [ 'The email should be a valid yahoo mail.' ] }
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
    };
    let fields = [{
        'attribute': ['field_1', 'field_2'],
        'rules': ['required', 'number']
    }, {
        'attribute': 'field_1',
        'rules': {
            'rule': 'greater_than.attribute',
            'property.targetAttribute': 'field_2'
        }
    }];
    let err = await validator.check(fields, data);
    if (err) console.log(err);
})();
```

OUTPUT : 

```javascript
{
  field_2: [
    'Kolom field_2 tidak boleh kosong.',
    'Kolom field_2 harus berupa number!'
  ],
  field_1: [ 'Kolom field_1 harus lebih besar dari kolom field_2' ]
}
```




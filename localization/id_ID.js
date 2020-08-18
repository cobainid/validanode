const MESSAGES = {
  'number': 'Kolom {attribute} harus berupa number!',
  'string': 'Kolom {attribute} harus berupa string!',
  'boolean': 'Kolom {attribute} harus berupa boolean!',
  'object': 'Kolom {attribute} harus berupa object!',
  'array': 'Kolom {attribute} harus berupa object!',
  'required': 'Kolom {attribute} tidak boleh kosong.',
  'start_with': `Kolom {attribute} harus diawali dengan "{property.value}"`,
  'equal_with': 'Kolom {attribute} harus sama dengan kolom {property.targetAttribute}',
  'greater_than.attribute': 'Kolom {attribute} harus lebih besar dari kolom {property.targetAttribute}',
};

module.exports = MESSAGES;
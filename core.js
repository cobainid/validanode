// convert object list to array
const toArray = (source) => {
    return Object.entries(source);
}

// convert array to object list
const toObjectList = (source) => {
    return Object.fromEntries(source);
}

// delete specific element from object list
const deleteElement = (source, key) => {
    source_as_array = toArray(source);

    let element = source_as_array.filter(value => value[0] === key)[0];
    source_as_array.splice(source_as_array.indexOf(element), 1);

    return toObjectList(source_as_array);
}

const isArray = (element) => {
    if (element.length !== undefined && typeof element === 'object') {
        return true;
    }
    return false;
}


module.exports = {
    toArray,
    toObjectList,
    deleteElement,
    isArray
};
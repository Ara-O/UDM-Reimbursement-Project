export function objectsAreEqual(obj1, obj2) {
    // Get the property names of the objects
    const props1 = Object.getOwnPropertyNames(obj1);
    const props2 = Object.getOwnPropertyNames(obj2);

    // Check if the number of properties is the same
    if (props1.length !== props2.length) {
        return false;
    }

    // Check if each property and its value are the same
    for (let i = 0; i < props1.length; i++) {
        const propName = props1[i];

        if (obj1[propName] !== obj2[propName]) {
            return false;
        }
    }

    // If all checks pass, the objects are equal
    return true;
}


export function isValidString(value) {
  const isAString = /^[a-zA-Z0-9\s-]+$/.test(value);
  switch (true) {
    case value.trim() === "":
      return "Field can not be empty";
    case !isAString:
      return "Invalid Characters";
    default:
      return true;
  }
}

export function isNotEmpty(value) {
  if (value.trim() === "") {
    return "Field can not be empty";
  }
  return true;
}

export function isValidEmploymentNumber(value) {
  const isValidNumber = /^[0-9]+$/.test(value);
  const hasValidLength = /^[0-9]{8}$/.test(value);

  switch (true) {
    case value === null:
      return "Field cannot be empty";
    case !isValidNumber:
      return "Field only accepts numbers";
    case !hasValidLength:
      return "Employment number must be 8 numbers";
    default:
      return true;
  }
}

export function isValidPhoneNumber(value) {
  const isValidNumber = /^[0-9]+$/.test(value);
  const hasValidLength = /^[0-9]{10}$/.test(value);

  switch (true) {
    case value.trim() === "":
      return "Field cannot be empty";
    case !isValidNumber:
      return "Field only accepts numbers";
    case !hasValidLength:
      return "Please use the format xxxxxxxxxx";
    default:
      return true;
  }
}

export function isValidFundNumber(value) {
  const isValidNumber = /^[0-9]+$/.test(value);
  const hasValidLength = /^[0-9]{6}$/.test(value);

  switch (true) {
    case value.trim() === "":
      return "Required";
    case !isValidNumber:
      return "Numbers only";
    case !hasValidLength:
      return " 6-digits";
    default:
      return true;
  }
}

export function isValidNumber(value) {
  let isValidNumber = /^\d+$/.test(value);

  if (!isValidNumber) {
    return "Numbers only";
  }

  return true;
}

export function isValidAccountNumber(value) {
  const isValidNumber = /^[0-9]+$/.test(value);
  const hasValidLength = /^[0-9]{4}$/.test(value);

  switch (true) {
    case value.trim() === "":
      return "Required";
    case !isValidNumber:
      return "Numbers only";
    case !hasValidLength:
      return "4-digits";
    default:
      return true;
  }
}

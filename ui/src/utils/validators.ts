export function isValidString(value) {
  if (value === undefined || value === null) value = "";
  value = String(value);

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
  if (value === undefined || value === null) value = "";
  value = String(value);
  if (value.trim() === "") {
    return "Field can not be empty";
  }
  return true;
}

export function isValidEmploymentNumber(value) {
  if (value === undefined || value === null) value = "";
  value = String(value);
  const isValidNumber = /^[0-9]+$/.test(value);
  const hasValidLength = /^[0-9]{8}$/.test(value);

  switch (true) {
    case value === null || value === "":
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
  if (value === undefined || value === null) value = "";
  value = String(value);

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
  if (value === undefined || value === null) value = "";
  value = String(value);

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
  if (value === undefined || value === null) value = "";
  value = String(value);

  let isValidNumber = /^[0-9]+$/.test(value);

  if (!isValidNumber && String(value).trim() !== "") {
    return "Numbers only";
  }

  if (String(value).trim() === "") {
    return "Field can not be empty";
  }
  return true;
}

export function isValidFloat(value) {
  if (value === undefined || value === null) value = "";
  value = String(value);

  let isValidNumber = /^[0-9.]+$/.test(value);

  if (!isValidNumber && String(value).trim() !== "") {
    return "Numbers only";
  }

  if (String(value).trim() === "") {
    return "Field can not be empty";
  }
  return true;
}
export function isValidFoapaAmount(value) {
  if (value === undefined || value === null) value = "";
  value = String(value);

  let isValidNumber = /^\d+(\.\d{1,2})?$/.test(value);

  if (!isValidNumber && value.trim() !== "") {
    return "Invalid currency format";
  }
  return true;
}

export function isValidAccountNumber(value) {
  if (value === undefined || value === null) value = "";
  value = String(value);

  const isValidNumber = /^[0-9]+$/.test(value);
  const hasValidLength = /^[0-9]{4}$/.test(value);

  switch (true) {
    case value.trim() === "":
      return "Required";
    case !isValidNumber:
      if (value === "XXXX") {
        return true;
      } else {
        return "Numbers only";
      }
    case !hasValidLength:
      return "4-digits";
    default:
      return true;
  }
}

//Non required foapa numebrs
export function isValidFoapaNumber(value) {
  if (value === undefined || value === null) value = "";
  value = String(value);

  const isValidNumber = /^[0-9]+$/.test(value);
  const hasValidLength = /^[0-9]{4}$/.test(value);

  switch (true) {
    case value.trim() === "":
      return true;
    case !isValidNumber:
      return "Numbers only";
    case !hasValidLength:
      return "4-digits";
    default:
      return true;
  }
}

export function isValidFoapaName(value, maxLength) {
  if (value === undefined || value === null) value = "";
  value = String(value);

  switch (true) {
    case value.trim() === "":
      return "Required";
    case value.length > maxLength:
      return "Too many characters";
    default:
      return true;
  }
}

export function isValidRecipientEmail(value) {
  if (value === undefined || value === null) value = "";
  value = String(value);

  switch (true) {
    case value.trim() === "":
      return "Required";
    case !value.includes("@udmercy.edu"):
      return "Recipient must have a udmercy email";
    default:
      return true;
  }
}

export function isLessThan(value, maxLength: number) {
  if (value === undefined || value === null) value = "";
  value = String(value);

  if (value.length > maxLength) {
    return "Too many characters";
  } else {
    return true;
  }
}
export function isValidActvNumber(value) {
  if (value === undefined || value === null) value = "";
  value = String(value);

  const hasValidFormat = /^[a-zA-Z0-9]*$/.test(value);
  switch (true) {
    case value.trim() === "":
      return true;
    case !hasValidFormat:
      return "Invalid Character";
    case value.trim().length !== 4:
      return "4 characters";
    default:
      return true;
  }
}

export function isValidFoapaDescription(value) {
  if (value === undefined || value === null) value = "";
  value = String(value);

  const hasValidLength = /^[a-zA-Z0-9" "]{0,250}$/.test(value);

  switch (true) {
    case !hasValidLength:
      return "Up to 250 Characters Only";
    default:
      return true;
  }
}

export function isValidProgramNumber(value) {
  if (value === undefined || value === null) value = "";
  value = String(value);

  const isValidNumber = /^[0-9]+$/.test(value);
  const hasValidLength = /^[0-9]{4}$/.test(value);

  switch (true) {
    case value.trim() === "":
      return "Required";
    case !isValidNumber:
      if (value === "XXXX") return true;
      else return "Numbers only";
    case !hasValidLength:
      return "4-digits";
    default:
      return true;
  }
}

export const validateName = (name) => {
  // 1. Check if name is not empty
  if (!name || name.trim().length === 0) {
    return "Name field cannot be empty.";
  }

  // 2. Check length (1 to 100 characters)
  if (name.length < 1 || name.length > 100) {
    return "Name must be between 1 and 100 characters.";
  }

  // 3. Ensure the name contains valid characters
  // The name can include letters, numbers, special characters, and underscores,
  // but special characters must be combined with alphabets or numbers.
  const validCharactersRegex = /^[a-zA-Z0-9 _\-@#$%^&*(),!?]+$/;
  if (!validCharactersRegex.test(name)) {
    return "Name may include letters, numbers, underscores, and symbols but must combine them with alphabets or numbers.";
  }

  // 4. Ensure the name does not contain only special characters or underscores
  if (/^[ _\-@#$%^&*(),!?]+$/.test(name)) {
    return "Name cannot contain only special characters or underscores.";
  }

  // 5. Check for consecutive spaces
  if (/ {2,}/.test(name)) {
    return "Name cannot contain consecutive spaces.";
  }

  // If all conditions are met
  return null;
};




export const validateCode = (code) => {
  // 1. Check if code is not empty
  if (!code || code.trim().length === 0) {
    return "Code field cannot be empty.";
  }

  // 2. Check length (1 to 100 characters)
  if (code.length < 1 || code.length > 100) {
    return "Code must be between 1 and 100 characters.";
  }

  // 3. Ensure the code does not contain consecutive spaces
  if (/ {2,}/.test(code)) {
    return "Code cannot contain consecutive spaces.";
  }

  // 4. Ensure the code contains valid characters
  // Allow letters, numbers, underscores, and special characters
  const validCharactersRegex = /^[a-zA-Z0-9 _\-@#$%^&*(),!?]+$/;
  if (!validCharactersRegex.test(code)) {
    return "Code may only include letters, numbers, underscores, and special characters.";
  }

  // 5. Ensure the code does not contain only special characters or underscores
  if (/^[ _\-@#$%^&*(),!?]+$/.test(code)) {
    return "Code cannot contain only special characters or underscores.";
  }

  // If all conditions are met
  return null;
};

export const hasDuplicateSerialNo = (data) => {
  const productSerialMap = new Map();

  for (const item of data) {
    const { productId, SerialNo } = item;

    if (!productSerialMap.has(productId)) {
      productSerialMap.set(productId, new Set());
    }

    const serialSet = productSerialMap.get(productId);

    if (serialSet.has(SerialNo)) {
      return true; // Duplicate SerialNo found for the same productId
    }

    serialSet.add(SerialNo);
  }

  return false;
};

 export const convertToLocaleDateString = (dateString) => {
  if (!dateString) return ""; // Handle null or undefined values

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // Return original string if the date is invalid

  // Extract components in local time
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};


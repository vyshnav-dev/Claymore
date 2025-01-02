export const roundOffCalculator = (number, roundOffValue, roundingType, decimalPart) => {


    // Function to round the result to the specified decimal part
    const roundToDecimals = (value, decimals) => {
  
      const factor = Math.pow(10, decimals);
      return Math.round(value * factor) / factor;
    };
  
    // Function to calculate the rounded value based on rounding type
    const calculateRoundedValue = (num, roundOff, type) => {
      const lowerMultiple = Math.floor(num / roundOff) * roundOff;
      const higherMultiple = Math.ceil(num / roundOff) * roundOff;
  
      let roundedValue;
  
      switch (type.toLowerCase()) {
        case "nearest": // Round to the nearest multiple
          const diffToLower = num - lowerMultiple;
          const diffToHigher = higherMultiple - num;
          roundedValue = diffToLower < diffToHigher ? lowerMultiple : higherMultiple;
          break;
  
        case "up": // Always round up
          roundedValue = higherMultiple;
          break;
  
        case "down": // Always round down
          roundedValue = lowerMultiple;
          break;
  
        default:
          roundedValue = num; // If no valid rounding type, return the original number
      }
  
      // Apply decimal part rounding
      return roundToDecimals(roundedValue, decimalPart);
    };
  
    // Return the calculated rounded value
    return calculateRoundedValue(number, roundOffValue, roundingType);
  };
  
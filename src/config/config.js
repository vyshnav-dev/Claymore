export let baseUrl = null
export let config = null;
export let config1 = null;
export let logoImage = null
export let primaryColor = null
export let secondaryColor = null
export let thirdColor = null
export let selectedColor = null
export let backgroundColor = null
export let profileDateFields = null
export let baseUrlMob = null
export let rowsPerSheet = null;
export let IMAGE_URL = null;
export let allowedExtensionsReceipt = null
export let allowedExtensionsTagAttachments = null
export let MastersTagId = null
export let TransactionData = null
export let FixedValues = null

export const getConfig = () => {
    if (!config) {
      throw new Error('Config has not been loaded!');
    }
    return config;
  };

  export const loadConfig = async () => {
    const response = await fetch('/config.json');
    config = await response.json();
    const response1 = await fetch('/masterDocType.json');
    config1 = await response1.json();
    baseUrl = config.baseUrl;
    logoImage=config.logo
    primaryColor=config.primaryColor
    secondaryColor=config.secondaryColor
    thirdColor=config.thirdColor
    selectedColor=config.selectedColor
    backgroundColor=config.backgroundColor
    profileDateFields=config.profileDateFields
    baseUrlMob=config.baseUrlMob
    rowsPerSheet = config.rowsPerSheet
    IMAGE_URL = config.IMAGE_URL
    allowedExtensionsReceipt = config.allowedExtensionsReceipt
    allowedExtensionsTagAttachments = config.allowedExtensionsTagAttachments
    MastersTagId = config1.MastersTagId
    TransactionData = config1.TransactionData
    FixedValues = config1.FixedValues
}
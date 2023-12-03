/**
 * Checks if a given input string contains only characters from the whitelist.
 * @param inputString - The input string to be checked.
 * @param whitelist - The whitelist of allowed characters.
 * @returns True if the input string contains only characters from the whitelist, false otherwise.
 */
function containsOnlyWhitelistChars(inputString: string): boolean {
    const whitelist = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    for (const char of inputString) {
      if (!whitelist.includes(char)) {
        return false;
      }
    }
    return true;
  }

export default containsOnlyWhitelistChars;
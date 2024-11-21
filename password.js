const crypto = require("crypto");

/**
 * Generate a salted and hashed password entry.
 * @param {string} clearTextPassword - The user's password in plain text.
 * @return {object} - An object containing the salt and the hashed password.
 */
function makePasswordEntry(clearTextPassword) {
  const salt = crypto.randomBytes(8).toString("hex");
  const hash = crypto.createHash("sha1").update(salt + clearTextPassword).digest("hex");
  return { salt, hash };
}

/**
 * Check if a clear text password matches a stored hash and salt.
 * @param {string} hash - The stored hashed password.
 * @param {string} salt - The salt used during password creation.
 * @param {string} clearTextPassword - The user's input password.
 * @return {boolean} - True if the password matches, false otherwise.
 */
function doesPasswordMatch(hash, salt, clearTextPassword) {
  const newHash = crypto.createHash("sha1").update(salt + clearTextPassword).digest("hex");
  return hash === newHash;
}

module.exports = { makePasswordEntry, doesPasswordMatch };

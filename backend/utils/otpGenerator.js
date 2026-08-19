// Re-exports for backward compatibility
const { generateOtp, getOtpExpiry } = require('../services/otpService');
module.exports = { generateOtp, getOtpExpiry };

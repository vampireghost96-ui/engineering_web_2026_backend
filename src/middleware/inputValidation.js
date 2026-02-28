// Input validation middleware
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone) => {
  // Allow various phone formats
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.length > 0 && phoneRegex.test(phone);
};

export const validateString = (str, minLength = 1, maxLength = 1000) => {
  return typeof str === 'string' && str.length >= minLength && str.length <= maxLength;
};

export const validateInteger = (num) => {
  return Number.isInteger(parseInt(num)) && parseInt(num) > 0;
};

// Middleware to validate and sanitize inputs
export const validateInput = (req, res, next) => {
  if (req.body) {
    // Remove any script tags or potentially harmful content
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key]
          .trim()
          .replace(/<script[^>]*>.*?<\/script>/gi, '')
          .replace(/<[^>]+>/g, '');
      }
    });
  }
  next();
};

// Middleware to check for malicious patterns
export const checkMaliciousPatterns = (req, res, next) => {
  const body = JSON.stringify(req.body);
  const maliciousPatterns = [
    /(\$where|\$ne|\$gt|\$regex)/gi,  // NoSQL injection
    /(union|select|insert|update|delete|drop)/gi,  // SQL injection
  ];

  for (const pattern of maliciousPatterns) {
    if (pattern.test(body)) {
      console.warn(`Malicious pattern detected from IP: ${req.ip}`);
      return res.status(400).json({
        success: false,
        message: 'Invalid input detected'
      });
    }
  }
  next();
};

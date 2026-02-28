// Validation middleware examples for future use

export const validateService = (req, res, next) => {
  const { title, description } = req.body;
  
  if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: 'Title and description are required'
    });
  }
  
  if (title.length < 3) {
    return res.status(400).json({
      success: false,
      message: 'Title must be at least 3 characters'
    });
  }
  
  next();
};

export const validateProject = (req, res, next) => {
  const { name, title, category_id, description } = req.body;
  
  if (!name || !title || !category_id || !description) {
    return res.status(400).json({
      success: false,
      message: 'Name, title, category_id, and description are required'
    });
  }
  
  if (!Number.isInteger(parseInt(category_id))) {
    return res.status(400).json({
      success: false,
      message: 'Category ID must be a valid number'
    });
  }
  
  next();
};

export const validateContactForm = (req, res, next) => {
  const { name, email, message } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and message are required'
    });
  }
  
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format'
    });
  }
  
  next();
};

export const requestLogger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
};

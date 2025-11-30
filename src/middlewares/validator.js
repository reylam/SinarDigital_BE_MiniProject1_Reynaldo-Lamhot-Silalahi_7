export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Validation Error',
      message: 'Email and password are required' 
    });
  }
  
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ 
      error: 'Validation Error',
      message: 'Email and password must be strings' 
    });
  }
  
  next();
};

export const validateTask = (req, res, next) => {
  const { title, description, assigned_to, due_date } = req.body;
  
  if (!title || !description || !assigned_to || !due_date) {
    return res.status(400).json({ 
      error: 'Validation Error',
      message: 'Title, description, assigned_to, and due_date are required' 
    });
  }
  
  next();
};

export const validateJob = (req, res, next) => {
  const { title, description } = req.body;
  
  if (!title || !description) {
    return res.status(400).json({ 
      error: 'Validation Error',
      message: 'Title and description are required' 
    });
  }
  
  next();
};
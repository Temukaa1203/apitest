const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;
require('dotenv').config();  // This loads the .env file

// Secret key to sign JWTs (in a real app, store this securely)
const SECRET_KEY = process.env.SECRET_KEY || 'mysecretKey_2025'; // Use .env value if available

// Middleware to parse JSON request body
app.use(express.json());

// Home route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Sample /api/data route
app.get('/api/data', (req, res) => {
  const data = {
    message: 'This is your data!',
    date: new Date(),
  };
  res.json(data); // Return JSON data
});

// Login route that generates an access token
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Simulate user authentication (In a real app, use database/user validation)
  if (username === 'testuser' && password === 'password123') {
    // Create JWT token with username as payload
    const payload = { username };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

    // Send the token as a response
    return res.json({ token });
  } else {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
});

// Protected route (needs a valid token)
app.get('/protected', (req, res) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).json({ message: 'Token is required' });
  }

  const token = authHeader.split(' ')[1];  // Extract token from Bearer <token>

  if (!token) {
    return res.status(403).json({ message: 'Token is required' });
  }

  // Verify the token
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    // Return protected data if token is valid
    res.json({ message: 'Protected data accessed', user: decoded });
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

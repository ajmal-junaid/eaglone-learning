const jwt = require('jsonwebtoken');

// verify the JWT token
jwt.verify(token, jwtKey, (err, decoded) => {
  if (err) {
    if (err.name === 'JsonWebTokenError') {
      // invalid token
      console.log('Invalid token');
    } else if (err.name === 'TokenExpiredError') {
      // token has expired
      console.log('Token has expired');
    } else {
      // some other error occurred
      console.log('Error while verifying token:', err);
    }
  } else {
    // decoded contains the decoded payload of the JWT token
    console.log(decoded);
  }
});

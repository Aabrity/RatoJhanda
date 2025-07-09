// // import express from 'express';
// // import mongoose from 'mongoose';
// // import dotenv from 'dotenv';
// // import helmet from 'helmet';
// // import mongoSanitize from 'express-mongo-sanitize';
// // import xssClean from 'xss-clean';
// // import rateLimit from 'express-rate-limit';
// // import cors from 'cors';
// // import userRoutes from './routes/user.route.js';
// // import authRoutes from './routes/auth.route.js';
// // import postRoutes from './routes/post.route.js';
// // import reportRoutes from './routes/report.route.js';
// // import commentRoutes from './routes/comment.route.js';
// // import cookieParser from 'cookie-parser';
// // import path from 'path';

// // dotenv.config();

// // mongoose
// //   .connect(process.env.MONGO, {
// //     useNewUrlParser: true,
// //     useUnifiedTopology: true,
// //     autoIndex: false, // Prevents index creation DoS
// //   })
// //   .then(() => {
// //     console.log('MongoDB is connected');
// //   })
// //   .catch((err) => {
// //     console.error('MongoDB connection error:', err);
// //     process.exit(1);
// //   });

// // const __dirname = path.resolve();
// // const app = express();

// // // Security Middlewares
// // app.use(helmet()); // Sets secure HTTP headers
// // app.use(mongoSanitize()); // Prevents NoSQL injection
// // app.use(xssClean()); // Prevents XSS attacks
// // app.use(cors({ origin: 'http://localhost:5173/', credentials: true })); // Restrict CORS origin
// // app.use(express.json({ limit: '10mb' }));
// // app.use(cookieParser());

// // // Rate Limiting
// // const apiLimiter = rateLimit({
// //   windowMs: 15 * 60 * 1000, // 15 minutes
// //   max: 100, // limit each IP
// //   message: 'Too many requests from this IP, please try again later.',
// // });
// // app.use('/api', apiLimiter);

// // // Routes
// // app.use('/api/user', userRoutes);
// // app.use('/api/auth', authRoutes);
// // app.use('/api/post', postRoutes);
// // app.use('/api/comment', commentRoutes);
// // app.use('/api/report', reportRoutes);

// // // Static files
// // app.use(express.static(path.join(__dirname, '/client/dist')));
// // app.get('*', (req, res) => {
// //   res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
// // });

// // // Global error handler
// // app.use((err, req, res, next) => {
// //   console.error(err.stack); // Log error stack
// //   const statusCode = err.statusCode || 500;
// //   const message = err.message || 'Internal Server Error';
// //   res.status(statusCode).json({
// //     success: false,
// //     statusCode,
// //     message,
// //   });
// // });

// // // Start server
// // const PORT = process.env.PORT || 3000;
// // app.listen(PORT, () => {
// //   console.log(`Server is running on port ${PORT}`);
// // });
// import cookieParser from 'cookie-parser';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import express from 'express';
// import mongoSanitize from 'express-mongo-sanitize';
// import rateLimit from 'express-rate-limit';
// import helmet from 'helmet';
// import mongoose from 'mongoose';
// import path from 'path';
// import xssClean from 'xss-clean';

// import authRoutes from './routes/auth.route.js';
// import commentRoutes from './routes/comment.route.js';
// import postRoutes from './routes/post.route.js';
// import reportRoutes from './routes/report.route.js';
// import userRoutes from './routes/user.route.js';

// dotenv.config();

// const __dirname = path.resolve();
// const app = express();

// // ====== Database Connection ======
// mongoose
//   .connect(process.env.MONGO, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     autoIndex: false, // Prevents index creation DoS
//   })
//   .then(() => {
//     console.log('✅ MongoDB connected');
//   })
//   .catch((err) => {
//     console.error('❌ MongoDB connection error:', err);
//     process.exit(1);
//   });

// // ====== Security Headers & Middleware ======

// // Helmet: secure HTTP headers
// app.use(helmet());

// // Content Security Policy (CSP)
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       scriptSrc: ["'self'", "'unsafe-inline'", 'https://apis.google.com'],
//       styleSrc: ["'self'", "'unsafe-inline'"],
//       imgSrc: ["'self'", "data:", "https://*"],
//       objectSrc: ["'none'"],
//       upgradeInsecureRequests: [],
//     },
//   })
// );

// // Additional secure headers
// app.use((req, res, next) => {
//   res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
//   res.setHeader('Referrer-Policy', 'no-referrer');
//   next();
// });

// // Prevent injection attacks
// app.use(mongoSanitize());
// app.use(xssClean());

// // Enable secure cookies
// app.use(cookieParser());

// // Limit JSON body size
// app.use(express.json({ limit: '10mb' }));

// // CORS configuration
// app.use(
//   cors({
//     origin: 'http://localhost:5173', // ⬅️ Change this in production
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   })
// );

// // Rate limiting (brute-force prevention)
// const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP
//   message: 'Too many requests from this IP, please try again later.',
// });
// app.use('/api', apiLimiter);

// // ====== API Routes ======
// app.use('/api/user', userRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/post', postRoutes);
// app.use('/api/comment', commentRoutes);
// app.use('/api/report', reportRoutes);

// // ====== Static Frontend Build ======
// app.use(express.static(path.join(__dirname, '/client/dist')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
// });

// // ====== Global Error Handler ======
// app.use((err, req, res, next) => {
//   console.error('❗', err.stack);
//   const statusCode = err.statusCode || 500;
//   res.status(statusCode).json({
//     success: false,
//     statusCode,
//     message: err.message || 'Internal Server Error',
//   });
// });

// // ====== Start Server ======
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });
// import cookieParser from 'cookie-parser';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import express from 'express';
// import mongoSanitize from 'express-mongo-sanitize';
// import rateLimit from 'express-rate-limit';
// import helmet from 'helmet';
// import mongoose from 'mongoose';
// import path from 'path';
// import xssClean from 'xss-clean';

// import authRoutes from './routes/auth.route.js';
// import commentRoutes from './routes/comment.route.js';
// import postRoutes from './routes/post.route.js';
// import reportRoutes from './routes/report.route.js';
// import userRoutes from './routes/user.route.js';

// dotenv.config();

// const __dirname = path.resolve();
// const app = express();

// // ====== Database Connection ======
// mongoose
//   .connect(process.env.MONGO, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     autoIndex: false, // Prevents index creation DoS
//   })
//   .then(() => {
//     console.log('✅ MongoDB connected');
//   })
//   .catch((err) => {
//     console.error('❌ MongoDB connection error:', err);
//     process.exit(1);
//   });

// // ====== Security Headers & Middleware ======
// app.use(helmet());

// // CSP Policy
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       scriptSrc: ["'self'", "'unsafe-inline'", 'https://apis.google.com'],
//       styleSrc: ["'self'", "'unsafe-inline'"],
//       imgSrc: ["'self'", 'data:', 'https://*'],
//       objectSrc: ["'none'"],
//       upgradeInsecureRequests: [],
//     },
//   })
// );

// // Optional: Trust proxy for secure cookies behind a reverse proxy
// // app.set('trust proxy', 1);

// // Optional: Force HTTPS redirect in production
// // app.use((req, res, next) => {
// //   if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
// //     return res.redirect('https://' + req.headers.host + req.url);
// //   }
// //   next();
// // });

// // Custom headers
// app.use((req, res, next) => {
//   res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
//   res.setHeader('Referrer-Policy', 'no-referrer');
//   next();
// });

// // Input sanitization
// app.use(mongoSanitize());
// app.use(xssClean());

// // Parse cookies and JSON
// app.use(cookieParser());
// app.use(express.json({ limit: '10mb' }));

// // CORS (adjust origin for deployment)
// app.use(
//   cors({
//     origin: 'http://localhost:5173', // 🔁 CHANGE THIS IN PRODUCTION
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   })
// );

// // API rate limiting (generic)
// const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 min
//   max: 100,
//   message: 'Too many requests from this IP, please try again later.',
// });
// app.use('/api', apiLimiter);

// // ====== Routes ======
// app.use('/api/user', userRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/post', postRoutes);
// app.use('/api/comment', commentRoutes);
// app.use('/api/report', reportRoutes);

// // ====== Static Files (SPA front-end build) ======
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use(express.static(path.join(__dirname, '/client/dist')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
// });


// // ====== Health Check (Optional) ======
// app.get('/healthz', (req, res) => {
//   res.status(200).json({ status: 'OK' });
// });

// // ====== Global Error Handler ======
// app.use((err, req, res, next) => {
//   console.error('❗', err.stack);
//   const statusCode = err.statusCode || 500;
//   res.status(statusCode).json({
//     success: false,
//     statusCode,
//     message: err.message || 'Internal Server Error',
//   });
// });

// // ====== Start Server ======
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoose from 'mongoose';
import xssClean from 'xss-clean';
import adminLogsRoute from './routes/admin.routes.js';
import authRoutes from './routes/auth.route.js';
import commentRoutes from './routes/comment.route.js';
import postRoutes from './routes/post.route.js';
import reportRoutes from './routes/report.route.js';
import userRoutes from './routes/user.route.js';

dotenv.config();

const __dirname = path.resolve();
const app = express();

// ====== Enable trust proxy if behind a reverse proxy (nginx, Heroku, etc) ======
app.set('trust proxy', 1);

// ====== Force HTTPS middleware ======
app.use((req, res, next) => {
  if (!req.secure) {
    // Redirect to HTTPS
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

// ====== Database Connection ======
mongoose
  .connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false, // Prevents index creation DoS
  })
  .then(() => {
    console.log('✅ MongoDB connected');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// ====== Security Headers & Middleware ======
app.use(helmet());

// CSP Policy
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://apis.google.com'],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https://*'],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);

// Custom headers
app.use((req, res, next) => {
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );
  res.setHeader('Referrer-Policy', 'no-referrer');
  next();
});

// Input sanitization
app.use(mongoSanitize());
app.use(xssClean());

// Parse cookies and JSON
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));

// CORS (adjust origin for deployment)
app.use(
  cors({
    origin: 'https://localhost', // 🔁 CHANGE THIS in production to your frontend domain
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// API rate limiting (generic)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', apiLimiter);

// ====== Routes ======
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/admin', adminLogsRoute);

// ====== Static Files (SPA front-end build) ======
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '/client/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// ====== Health Check (Optional) ======
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// ====== Global Error Handler ======
app.use((err, req, res, next) => {
  console.error('❗', err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    statusCode,
    message: err.message || 'Internal Server Error',
  });
});

// ====== HTTPS Setup ======
const sslOptions = {
  key: fs.readFileSync('server.key'), // replace with your cert key path
  cert: fs.readFileSync('server.cert'), // replace with your cert path
};

// Start HTTPS server
https.createServer(sslOptions, app).listen(443, () => {
  console.log('🚀 HTTPS Server running on port 443');
});

// Redirect all HTTP to HTTPS
http
  .createServer((req, res) => {
    res.writeHead(301, {
      Location: `https://${req.headers.host}${req.url}`,
    });
    res.end();
  })
  .listen(80, () => {
    console.log('🔄 HTTP Server redirecting all traffic to HTTPS');
  });

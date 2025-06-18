const express = require('express');
const axios = require('axios');
const getRawBody = require('raw-body');
const app = express();

//middleware
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'DELETE') {
    getRawBody(req, {
      length: req.headers['content-length'],
      limit: '1mb',
      encoding: 'utf-8',
    })
      .then((buf) => {
        req.rawBody = buf;
        next();
      })
      .catch((err) => {
        console.error('❌ Failed to read raw body:', err.message);
        res.status(400).send('Invalid body');
      });
  } else {
    next();
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const proxyRequest = (targetUrl) => async (req, res) => {
  try {
    const url = `${targetUrl}${req.originalUrl}`;
    const method = req.method.toLowerCase();

    console.log(`🔁 Proxying ${method.toUpperCase()} to ${url}`);
    console.log('📦 Raw body:', req.rawBody?.toString());

    const response = await axios({
      method,
      url,
      //timeout: 10000,
      headers: {
        ...req.headers,
        'cache-control': 'no-cache',
        'content-length': req.rawBody?.length ?? 0,
      },
      data: req.method !== 'GET' && req.method !== 'DELETE' ? req.rawBody : undefined,
      validateStatus: (status) => status >= 200 && status < 400,
    });

    console.log('✅ Response from service:', response.status);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('❌ Proxy error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
  }
};

// Routes
app.use('/users', proxyRequest('http://localhost:3001'));
app.use('/admin', proxyRequest('http://localhost:3100'));

app.listen(3000, () => {
  console.log('🚀 API Gateway running on port 3000');
});

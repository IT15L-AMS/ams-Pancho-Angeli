const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.json({ message: 'Server is working!' });
});

const port = 3000;
app.listen(port, () => {
    console.log(`✅ Test server running on http://localhost:${port}`);
}).on('error', (err) => {
    console.error('❌ Server error:', err.message);
});

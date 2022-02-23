const express = require('express')
const app = express()
const port = 8888


app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.write('Hello World!<br />')
  res.write('id: ' + req.query.id);
  res.end();
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/api/dogs', function(req, res, next) {
  res.json({ "name": "Fido", "age": 3 });
});

module.exports = router;

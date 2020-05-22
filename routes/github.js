var rs = require('randomstring');
var config = require('../config/env');

var express = require('express');
var qs = require('querystring');
var router = express.Router();
var Axios = require('axios');

router.get('/', function (req, res) {
  const state = rs.generate();
  const url = 'https://github.com/login/oauth/authorize?';
  const query = qs.stringify({
    client_id: config.CLIENT_ID,
    redirect_uri: config.HOST + 'authentication',
    state,
    scope: 'user:email',
  });
  const githubAuthUrl = url + query;
  res.send({ githubAuthUrl, state });
});

router.post('/login', function (req, res) {
  const code = req.body.code;
  const queryState = req.body.state;
  const host = 'https://github.com/login/oauth/access_token';
  const params = {
    client_id: config.CLIENT_ID,
    client_secret: config.CLIENT_SECRET,
    code,
    redirect_uri: config.HOST + 'authentication',
    state: queryState,
  };
  Axios.post(host, {}, {
    params,
  })
    .then(function (response) {
      console.log(response.data);
      const token = qs.parse(response.data).access_token;
      res.send({ success: true, token });
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).send( {
        success: false,
        message: err,
      });
    });
});

module.exports = router;

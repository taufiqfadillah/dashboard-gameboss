const express = require('express');
const passport = require('passport');
const { blockAccessToRoot } = require('../config/checkAuth');

const router = express.Router();

//------------ Login Route ------------//
router.get('/login', blockAccessToRoot, (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/beranda');
  }
  res.render('auth/contents/login', {
    title: 'Login || Gameboss',
    layout: 'auth/partials/layout',
    messages: req.flash('error'),
  });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/beranda',
  failureRedirect: '/auth/login',
  failureFlash: true,
  successFlash: 'Successfully logged in!',
}));

//------------ Logout Route ------------//
router.get('/logout', (req, res) => {
  req.logout(() => {
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
  });
});


module.exports = router;

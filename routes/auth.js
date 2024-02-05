const express = require('express');
const passport = require('passport');
const { google } = require('googleapis');
require('dotenv').config()

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

//------------ Oauth2 Configuration ------------//
const oauth2Client = new google.auth.OAuth2(
  process.env.Google_Client_ID,
  process.env.Google_Secret_ID,
  `${process.env.Base_URL}:${process.env.PORT}/auth/google/callback`
)

const scope = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
]

const authorizationUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scope,
  include_granted_scopes: true
})

//------------ Oauth2 Route ------------//
router.get('/google', (req, res) => {
  res.redirect(authorizationUrl)
}) 

router.get('/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2'
    });

    const { data } = await oauth2.userinfo.get();

    if (!data.email || !data.name) {
      return res.json({
        data: data,
      });
    }

    if (data.email.toLowerCase() !== 'infogameboss@gmail.com') {
      return res.status(403).send('Forbidden: Unauthorized email');
    }

    const user = {
      nama: data.name || 'Ryan Paturahman',
      username: data.email,
      password: '',
      alamat: data.address || 'BTN Grandhill Blok E/84',
      hp: data.hp || '085255323308',
      images: data.images || 'user.jpg',
      role: 1,
    };

    req.login(user, function(err) {
      if (err) {
        console.error('Error during Google OAuth2 login:', err.message);
        return res.status(500).send('Internal Server Error');
      }
      return res.redirect('/beranda');
    });
  } catch (error) {
    console.error('Error during Google OAuth2 callback:', error.message);
    res.status(500).send('Internal Server Error');
  }
});


//------------ Logout Route ------------//
router.get('/logout', (req, res) => {
  req.logout(() => {
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
  });
});


module.exports = router;

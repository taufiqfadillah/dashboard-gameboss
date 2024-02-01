var express = require('express');
var router = express.Router();

const { ensureAuthenticated, blockAccessToRoot } = require('../config/checkAuth');
const { db } = require('../config/firebase');

//------------ Welcome Route ------------//
router.get('/', blockAccessToRoot, (req, res) => {
  res.redirect('/auth/login');
});

//------------ Middleware Side Nav Active ------------//
router.use((req, res, next) => {
  res.locals.activeRoute = req.path;
  next();
});

//------------ Beranda Route ------------//
router.get('/beranda', ensureAuthenticated, async (req, res) => {
  try {
    const dataSnapshot = await db.collection('gameboss').doc('beranda').collection('data').get();
    const data = [];
    
    dataSnapshot.forEach(doc => {
      const item = doc.data();
      item.id = doc.id;
    
      if (Array.isArray(item.durasi)) {
        item.totalDurasi = item.durasi.reduce((a, b) => (a + Number(b)), 0);
      } else {
        item.totalDurasi = Number(item.durasi);
      }
    
      data.push(item);
    });
    

    res.render('contents/beranda', {
      title: 'Beranda || Gameboss',
      layout: 'partials/layout',
      class: res.locals.activeRoute === '/beranda' ? 'side-menu--active' : '',
      messages: req.flash('message'),
      data: data,
      name: req.user.name,
      editItem: null
    });
  } catch (error) {
    console.error('Error fetching data from Firestore:', error.message);
    req.flash('message', 'Error fetching data. Please try again.');
    res.redirect('/beranda');
  }
});

router.post('/beranda', ensureAuthenticated, async (req, res) => {
  const { nama, durasi, unit, biaya } = req.body;

  try {
    await db.collection('gameboss').doc('beranda').collection('data').add({
          nama,
          durasi,
          unit,
          status: 1,
          biaya,
          operator: req.user.name,
          timestamp: new Date(),
      });

      req.flash('message', 'Data saved successfully!');
      res.redirect('/beranda');
  } catch (error) {
      console.error('Error saving data to Firestore:', error.message);
      req.flash('message', 'Error saving data. Please try again.');
      res.redirect('/beranda');
  }
});


//------------ Beranda Edit Route ------------//
router.get('/beranda-edit/:id', ensureAuthenticated, async (req, res) => {
  const itemId = req.params.id;

  try {
    const docSnapshot = await db.collection('gameboss').doc('beranda').collection('data').doc(itemId).get();

    if (docSnapshot.exists) {
      const editItem = docSnapshot.data();
      editItem.id = docSnapshot.id;

      res.json({ editItem });
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    console.error('Error fetching data from Firestore:', error.message);
    res.status(500).json({ error: 'Error fetching data. Please try again.' });
  }
});

// ------------ Beranda Update Route ------------ //
router.post('/beranda-update', ensureAuthenticated, async (req, res) => {
  const itemId = req.body.id;
  const { nama, durasi, unit, status } = req.body;

  try {
    await db.collection('gameboss').doc('beranda').collection('data').doc(itemId).update({
      nama,
      durasi,
      unit,
      status: parseInt(status),
    });

    req.flash('message', 'Data updated successfully!');
    res.redirect('/beranda');
  } catch (error) {
    console.error('Error updating data in Firestore:', error.message);
    req.flash('message', 'Error updating data. Please try again.');
    res.redirect('/beranda');
  }
});


router.post('/beranda-delete/:id', ensureAuthenticated, async (req, res) => {
  const itemId = req.params.id;

  try {
    await db.collection('gameboss').doc('beranda').collection('data').doc(itemId).delete();

    req.flash('message', 'Data deleted successfully!');
    res.redirect('/beranda');
  } catch (error) {
    console.error('Error deleting data from Firestore:', error.message);
    req.flash('message', 'Error deleting data. Please try again.');
    res.redirect('/beranda');
  }
});


//------------ Profil Route ------------//
router.get('/profil', ensureAuthenticated, (req, res) =>
  res.render('contents/profil', {
    title: 'Profil || Gameboss',
    layout: 'partials/layout',
    class: res.locals.activeRoute === '/profil' ? 'side-menu--active' : '',
  })
);

//------------ Transaksi Route ------------//
router.get('/transaksi', ensureAuthenticated, (req, res) =>
  res.render('contents/transaksi', {
    title: 'Transaksi || Gameboss',
    layout: 'partials/layout',
    class: res.locals.activeRoute === '/transaksi' ? 'side-menu--active' : '',
  })
);

//------------ Data Master Route ------------//
router.get('/data-master', ensureAuthenticated, (req, res) =>
  res.render('contents/data-master', {
    title: 'Data Master || Gameboss',
    layout: 'partials/layout',
    class: res.locals.activeRoute === '/data-master' ? 'side-menu--active' : '',
  })
);

//------------ Laporan Route ------------//
router.get('/laporan', ensureAuthenticated, (req, res) =>
  res.render('contents/laporan', {
    title: 'Laporan || Gameboss',
    layout: 'partials/layout',
    class: res.locals.activeRoute === '/laporan' ? 'side-menu--active' : '',
  })
);

module.exports = router;

var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true});
const { body, validationResult } = require('express-validator/check');
require('dotenv').config();

// require & init Firebase
const admin = require("firebase-admin");
const serviceAccount = require("../fir-express-mailer-firebase-adminsdk-kuojd-3495a30bbd.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-express-mailer.firebaseio.com"
});
const FBD = admin.database().ref('/');

// routes
router.get('/', csrfProtection, (req, res) => {
    res.render('contact',
    { 
      csrfToken: req.csrfToken(),
      nameError: req.flash('nameError'),
      emailError: req.flash('emailError'),
      titleError: req.flash('titleError')
    });
});

router.get('/review', (req, res) => {
  res.render('contactReview');
});

router.post('/post', csrfProtection, body('email').isEmail().withMessage('請輸入正確格式'), (req, res) => {
  let error;
  if (req.body.username == '') {
    req.flash('nameError', '<span class="errorMsg">請輸入名稱</span>');
    error = true;
  };
  if (req.body.email == '') {
    req.flash('emailError', '<span class="errorMsg">沒有聯絡信箱</span>');
    error = true;
  } 
  else {
    // 玩玩看 express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('emailError', `<span class="errorMsg">${errors.mapped().email.msg}</span>`);
      error = true;
    } // express-validator  
  }

  if (req.body.title == '') {
    req.flash('titleError', '<span class="errorMsg">缺少信件標題</span>');
    error = true;
  }
  if (error) {return res.redirect('/contact')}

  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.gmailUser,
      pass: process.env.gmailPass
    }
  }); 
  let mailOptions = {
    form: 'Greene <t0937383@gmail.com>',
    to: req.body.email,
    subject: `${req.body.username} 寄了一封信給你`,
    text: req.body.description
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    // 將郵件資料放入FireBase
    FBD.push().set(
      {
        username: req.body.username,
        email: req.body.email,
        title: req.body.title,
        des: req.body.description
      });
    res.redirect('review');
  });
});

router.get('/admin', csrfProtection, (req, res) => {
  // 建立字串
  let data = '';
  // 建立編號
  let num = 0;
  FBD.once('value', (snapshot) => {
    for (item in snapshot.val()) {
      // 編號補 0 湊三個數字
      let fixNum = (num, length) => {
        if (num.length >= length) {return num}
        else {return fixNum("0"+num, length)};
      };
      num += 1;
      data += `
        <div class="row">
          <p class="t-num">${fixNum(num, 3)}</p>
          <p class="t-title">${snapshot.val()[item].title}</p>
          <p class="t-name">${snapshot.val()[item].username}</p>
          <p class="t-email">${snapshot.val()[item].email}</p>
          <p class="t-btn">
            <button
              data-title="${snapshot.val()[item].title}"
              data-des="${snapshot.val()[item].des}"
              data-name="${snapshot.val()[item].username}"
              class="btn btn-check">查看
            </button>
          </p>
          <p class="t-btn">
            <button data-id="${item}" class="btn btn-del">刪除</button>
          </p>
        </div>
        <hr class="sub" />`;
    }
    res.render('admin', 
      {
        csrfToken: req.csrfToken(),
        mails: data
      });
  });
});

router.post('/admin/del', csrfProtection, (req, res) => {
  let id = req.body.id;
  FBD.child(id).remove().then(() => {
    res.end();
  });
});

module.exports = router;
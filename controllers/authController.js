const User = require('../models/User');

exports.getLogin = (req, res) => {
  res.render('auth/login', { title: 'Login' });
};

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      req.session.flash = { type: 'danger', message: 'Please fill in all fields.' };
      return res.redirect('/auth/login');
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      req.session.flash = { type: 'danger', message: 'Invalid email or password.' };
      return res.redirect('/auth/login');
    }
    req.session.userId = user._id;
    req.session.userName = user.name;
    req.session.role = user.role;
    req.session.flash = { type: 'success', message: `Welcome back, ${user.name}!` };
    res.redirect('/dashboard');
  } catch (err) {
    req.session.flash = { type: 'danger', message: 'Server error. Please try again.' };
    res.redirect('/auth/login');
  }
};

exports.getSignup = (req, res) => {
  res.render('auth/signup', { title: 'Sign Up' });
};

exports.postSignup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body;
    if (!name || !email || !password || !confirmPassword) {
      req.session.flash = { type: 'danger', message: 'Please fill in all required fields.' };
      return res.redirect('/auth/signup');
    }
    if (password !== confirmPassword) {
      req.session.flash = { type: 'danger', message: 'Passwords do not match.' };
      return res.redirect('/auth/signup');
    }
    if (password.length < 6) {
      req.session.flash = { type: 'danger', message: 'Password must be at least 6 characters.' };
      return res.redirect('/auth/signup');
    }
    const existing = await User.findOne({ email });
    if (existing) {
      req.session.flash = { type: 'danger', message: 'Email already registered.' };
      return res.redirect('/auth/signup');
    }
    const user = await User.create({ name, email, password, phone });
    req.session.userId = user._id;
    req.session.userName = user.name;
    req.session.role = user.role;
    req.session.flash = { type: 'success', message: `Welcome, ${user.name}! Account created successfully.` };
    res.redirect('/dashboard');
  } catch (err) {
    req.session.flash = { type: 'danger', message: 'Server error. Please try again.' };
    res.redirect('/auth/signup');
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
};

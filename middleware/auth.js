const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) return next();
  req.session.flash = { type: 'danger', message: 'Please log in to access this page.' };
  res.redirect('/auth/login');
};

const isAdmin = (req, res, next) => {
  if (req.session && req.session.role === 'admin') return next();
  req.session.flash = { type: 'danger', message: 'Access denied. Admins only.' };
  res.redirect('/dashboard');
};

const isResident = (req, res, next) => {
  if (req.session && req.session.role === 'resident') return next();
  req.session.flash = { type: 'danger', message: 'Access denied. Residents only.' };
  res.redirect('/dashboard');
};

const isGuest = (req, res, next) => {
  if (!req.session || !req.session.userId) return next();
  res.redirect('/dashboard');
};

module.exports = { isAuthenticated, isAdmin, isResident, isGuest };

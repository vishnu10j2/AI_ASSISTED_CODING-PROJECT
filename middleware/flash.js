const flashMiddleware = (req, res, next) => {
  res.locals.flash = req.session.flash || null;
  res.locals.user = req.session.userId ? { id: req.session.userId, name: req.session.userName, role: req.session.role } : null;
  delete req.session.flash;
  next();
};

module.exports = flashMiddleware;

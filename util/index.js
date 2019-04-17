// middleware to see if we're authenticated or not
middleware =  {
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
  },
  ensureAuthenticatedManagement: (req, res, next) => {
    if (req.isAuthenticated()) {
      if(req.user.dataValues.userType==0){
        return next();
      }
      res.redirect('/');
    }
    res.redirect('/');
  },
  ensureAuthenticatedEncoder: (req, res, next) => {
    if (req.isAuthenticated()) {
      if(req.user.dataValues.userType==1){
        return next();
      }
      res.redirect('/');
    }
    res.redirect('/');
  },
  ensureAuthenticatedWarehouse: (req, res, next) => {
    if (req.isAuthenticated()) {
      if(req.user.dataValues.userType==2){
        return next();
      }
      res.redirect('/');
    }
    res.redirect('/');
  },
  ensureAuthenticatedEngineer: (req, res, next) => {
    if (req.isAuthenticated()) {
      if(req.user.dataValues.userType==3){
        return next();
      }
      res.redirect('/');
    }
    res.redirect('/');
  }
}

module.exports = middleware
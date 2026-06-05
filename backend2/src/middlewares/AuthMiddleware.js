import passport from "passport";

const isLoggedIn = (req, res, next) => {
  passport.authenticate('bearer', { session: false })(req, res, next);
};

export { isLoggedIn };
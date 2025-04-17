module.exports = (fun) => (req, res, next) => {
  fun(req, res, next).catch(next);
};

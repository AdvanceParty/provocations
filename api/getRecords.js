const select = require('./db/select');

module.exports = async (req, res) => {
  let result, status;
  try {
    let query = JSON.parse(req.body);
    result = await select(query);
    status = 200;
  } catch (e) {
    result = e;
    status = 501;
  }
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');
  res.status(status).send(result);
};
/**
 * JS function data file
 *
 * @url /js/js-func-file/user?uid=233
 *
 * @describe 你可以在这里写详细的描述信息参数的
 *
 * @method GET
 *
 * @params 参数说明及其他说明
 * uid: user ID
 * name: username
 * email: the email
 */
module.exports = function (req) {
  const uid = req.query.uid

  if (!uid) {
    return {
      code: -1,
      msg: 'no uid'
    }
  }

  return {
    code: 0,
    data: {
      uid: Number(uid),
      name: '@name',
      'age|20-30': 1,
      email: '@email',
      date: '@date'
    }
  }
}

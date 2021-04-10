/**
 * JS data file
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

module.exports = {
  code: function() {
    // 模拟误码，误码1的概率为1/10。
    return Math.random() < 0.1 ? 1 : 0;
  },
  data: {
    Data: true
  }
};

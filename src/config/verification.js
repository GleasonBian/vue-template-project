/**
 * 正则   verification Regular.Email
 */

export const Regular = {
  /**
   * 手机号
   */
  Phone: /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/,

  /**
   * 用户名称 2到16位（汉字, 字母，数字，下划线，连字符）
   */
  Username: /^[a-zA-Z0-9\u4e00-\u9fa5\_-]{2,16}$/,

  /**
   * 邮箱 xxxxx@xxx.xx
   */
  Email: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,

  /**
   * 企业名称  必须为汉字2-50个字符
   */
  Companyname: /^([\u4e00-\u9fff]{2,50})$/,

  /**
   * 中文,2-5个字符
   */
  Character: /^[\u4E00-\u9FA5\uf900-\ufa2d]{2,5}$/,

  /**
   * 中文,英文,字母,数字,2-50个字符
   */
  Characters: /[\u4e00-\u9fa5_a-zA-Z0-9_]{2,50}/,

  /**
   * 税号
   */
  Tax: /^[A-Z0-9]{15,17}$|^[A-Z0-9]{18,20}$|^[A-Z0-9]{20,21}$/,

  /**
   * 银行名称
   */
  Bank: /^(([\u4e00-\u9fff]{2,50})|([a-z\.\s\,]{2,50}))$/i,

  /**
   * 银行账号
   */
  Bankaccount: /^[0-9]\d*/,

  /**
   * 2到8位汉字, 字母，数字，下划线，连字符
   */
  Hyphen: /^[a-zA-Z0-9\u4e00-\u9fa5\_-]{2,8}$/,

  /**
   * 2-20个字符
   */
  Taker: /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/
};

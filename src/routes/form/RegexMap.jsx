const regexTemplates = [
  {
    key: 'mobile',
    text: '手机号码（例如：13000000000）',
    value: 'mobile',
  },
  {
    key: 'email',
    text: '电子邮箱（例如：user@domain.com）',
    value: 'email',
  },
  {
    key: 'id',
    text: '身份证号码（15 位或 18 位）',
    value: 'id'
  },
  {
    key: 'telephone',
    text: '固定电话号码（例如：010-88888888 或 0511-8888888）',
    value: 'telephone'
  },
  {
    key: 'n',
    text: '无限制',
    value: 'n'
  }
];

const regexMap = {
  id: String.raw`^(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)$`,
  telephone: String.raw`^((\d{3}-\d{8})|(\d{4}-\d{7}))$`,
  email: String.raw`^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$`,
  mobile: String.raw`^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$`,
  n: ''
};

export { regexMap, regexTemplates };

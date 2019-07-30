/**
 * @author: giscafer ,https://github.com/giscafer
 * @date: 2018-12-12 19:51:54
 * @description: 工具函数
 */

export const uuid = () => {
  return `${Math.random()
    .toString(36)
    .substr(2)}${Math.random()
    .toString(36)
    .substr(2)}`;
};

/**
 * toFixed 解决js精度问题，使用方式：toFixed(value)
 * @param {Number | String} value
 * @param {Number} precision 精度，默认2位小数，需要取整则传0
 * 该方法会处理好以下这些问题
 * 1.12*100=112.00000000000001
 * 1.13*100=112.9999999999999
 * '0.015'.toFixed(2)结果位0.01
 * 1121.1/100 = 11.210999999999999
 */
export const toFixed = (value, precision = 2) => {
  const num = Number(value);
  if (Number.isNaN(num)) return 0;
  if (num < Math.pow(-2, 31) || num > Math.pow(2, 31) - 1) {
    return 0;
  }
  // console.log(num, precision)
  if (precision < 0 || typeof precision !== 'number') {
    return value;
  } else if (precision > 0) {
    return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
  }
  return Math.round(num);
};

/**
 * 单位为元数值转为分
 * @param {Number} value
 */
export const toCentNumber = value => {
  const num = Number(value);
  if (Number.isNaN(num)) return 0;
  return toFixed(num * 100, 0);
};

/**
 * 分数值数值转为元
 * @param {Number} centval 分为单位
 */
export const toYuanNumber = centval => {
  const num = Number(centval);
  if (Number.isNaN(num)) return 0;
  return toFixed(num / 100);
};

/* 移除数组中的某个元素 */
export const removeItem = (list = [], item) => {
  for (let i = 0, l = list.length; i < l; i++) {
    if (item === list[i]) {
      list.splice(i, 1);
      i--;
      l--;
    }
  }
  return [...list];
};

/**
 * 移除对象的一些属性
 * @param {Object} obj 对象
 * @param {Array<string>} keys 需要移除的属性数组字符串
 */
export const blacklist = (obj = {}, keys = []) => {
  const _keys = Object.keys(obj);
  let newObj = {};
  for (const key of _keys) {
    if (!keys.includes(key)) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
};

/**
 * val值不为空字符，null，undefined
 */
export const isNotEmpty = val => {
  const arr = [undefined, null, ''];
  return !arr.includes(val);
};

/**
 * form表单值校验是否为空，有值为空则返回true，值都正确则返回false
 */
export const isFormValid = obj => {
  if (typeof obj !== 'object') return true;
  const keys = Object.keys(obj);
  return keys.some(key => {
    return !isNotEmpty(obj[key]);
  });
};

/**
 * 判断value是否为undefined或者null
 * @param value
 */
export function isNotNil(value) {
  return typeof value !== 'undefined' && value !== null;
}

/**
 * 简单模拟_.map取出数据对象中的某个key值
 * @param {*} arr
 * @param {*} key
 */
export function map(arr = [], key) {
  if (!key) return arr;
  return arr.map(item => {
    return item[key];
  });
}
/**
 * 简单模拟lodash _.zipObject
 * @param {*} props
 * @param {*} value
 */
export function zipObject(props, value) {
  let obj = {};
  props.forEach((p, index) => {
    obj[p] = value[index];
  });
  return obj;
}
/**
 * 处理服务费用格式，array 2 object
 * eg:
 * fees=[{feeType: "tranSportFee", feeTypeName: "运输费", amount: 13.1},{feeType: "tFee", feeTypeName: "运输费2", amount: 12.1}]
 * return {"tranSportFee":13.1,"tFee":12.1}
 */
export function zipFee(fees = []) {
  let feeTypes = map(fees, 'feeType');
  let amounts = map(fees, 'amount');
  let fData = [];
  amounts.forEach(d => {
    let item = Number.isNaN(Number(d)) ? '计算出错' : Number(d);
    fData.push(item);
  });
  return zipObject(feeTypes, fData);
}

export function zipOrderCount(counts = []) {
  let feeTypes = map(counts, 'orderStatus');
  let amounts = map(counts, 'count');
  let fData = [];
  amounts.forEach(d => {
    let item = Number.isNaN(Number(d)) ? 0 : Number(d);
    fData.push(item);
  });
  return zipObject(feeTypes, fData);
}

/**
 * 处理服务费用格式，object 2 array
 * eg:
 * fees={"tranSportFee":13.1,"tFee":12.1}
 * return [{feeType: "tranSportFee",  amount: 13.1},{feeType: "tFee", amount: 12.1}]
 */
export function unZipFee(feeObj = {}) {
  let result = [];
  for (const key in feeObj) {
    result.push({
      feeType: key,
      amount: feeObj[key]
    });
  }
  return result;
}

/**
 * obj转为querystring字符串
 * @param {Object} params
 */
export function toQueryString(params) {
  let str = '';
  for (let key in params) {
    if (params[key] && params[key] !== 0) {
      str += `${key}=${params[key]}&`;
    }
  }
  return str;
}

/**
 * 简单模拟lodash _.get
 * @param {*} object
 * @param {*} path
 * @param {*} defaultValue
 */
export function deepGet(object, path, defaultValue) {
  return (
    (!Array.isArray(path)
      ? path
          .replace(/\[/g, '.')
          .replace(/\]/g, '')
          .split('.')
      : path
    ).reduce((o, k) => (o || {})[k], object) || defaultValue
  );
}

/**
 * 简单模拟lodash _.omit
 * @param {*} obj
 * @param {*} arr
 */
export const omit = (obj, arr) =>
  Object.keys(obj)
    .filter(k => !arr.includes(k))
    .reduce((acc, key) => ((acc[key] = obj[key]), acc), {});

/**
 * 简单模拟lodash _.compact
 * @param {*} obj
 * @param {*} arr
 */
export const compact = arr => arr.filter(Boolean);

/**
 * 模拟lodash _.pick
 * @param {Object} o
 * @param  {Array<string>} props
 */
export const pick = (o, props) => {
  return Object.assign({}, ...props.map(prop => ({ [prop]: o[prop] })));
};

/**
 * 扁平化多级数组对象
 * @param {*} arr
 * @param {*} name 需要扁平化的属性
 */
export const flattenObj = (arr = [], name = 'childrens') => {
  let flat = (r, a) => {
    var b = {};
    Object.keys(a).forEach(function(k) {
      if (k !== name) {
        b[k] = a[k];
      }
    });
    r.push(b);
    if (Array.isArray(a[name])) {
      b[name] = a[name].map(e => {
        return e.id;
      });
      return a[name].reduce(flat, r);
    }
    return r;
  };

  return arr.reduce(flat, []);
};

/**
 * throttle
 * advanced: Creates a throttled function that only invokes the provided function at most once per every wait milliseconds
 * @param {*} fn
 * @param {*} wait
 */
export const throttle = (fn, wait) => {
  let inThrottle, lastFn, lastTime;
  return function() {
    const context = this,
      args = arguments;
    if (!inThrottle) {
      fn.apply(context, args);
      lastTime = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFn);
      lastFn = setTimeout(function() {
        if (Date.now() - lastTime >= wait) {
          fn.apply(context, args);
          lastTime = Date.now();
        }
      }, Math.max(wait - (Date.now() - lastTime), 0));
    }
  };
};

export const debounce = (fn, time) => {
  let timeout;
  return function() {
    const functionCall = () => fn.apply(this, arguments);

    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  };
};

export function splitText(text) {
  if (!text.trim()) return [''];
  const regex = /[^,，\s]+/g;
  return text.match(regex);
}

export function separateInfo(text) {
  const obj = {
    name: '',
    phone: '',
    other: []
  };
  const phoneRegex = /^[-0-9]{7,}/,
    nameRegex = /^[\u4E00-\u9FA5]{2,4}$/;
  let arr = splitText(text);
  for (let i = 0; i < arr.length; ++i) {
    const b = arr[i];
    if (!obj.name && nameRegex.test(b)) {
      obj.name = b;
      continue;
    }
    if (!obj.phone && phoneRegex.test(b)) {
      obj.phone = b;
      continue;
    }
    obj.other.push(b);
  }
  return obj;
}

/**
 * 去除详细地址的政区
 * @param {*} address 详细地址
 * @param {*} division 标准政区名称 eg:广东省佛山市三水区
 */
export function matchDivision(address, division) {
  const RegexArr = [/(省|自治区)/, /(市)/, /(区|县)/, /(街道|镇)/];
  let result = address,
    divisionArr = [];

  RegexArr.forEach(r => {
    if (!division) return;
    let splitArr = [];
    splitArr = division.split(r);
    division = splitArr[2];
    divisionArr.push(
      new RegExp(`(${splitArr[0]}${splitArr[1]}|${splitArr[0]})`)
    );
  });

  divisionArr.forEach(d => {
    result = result.replace(d, '');
  });
  return result;
}

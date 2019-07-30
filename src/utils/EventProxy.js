/**
 * @author: giscafer ,https://github.com/giscafer
 * @date: 2018-12-12 19:12:31
 * @description: 模仿eventproxy.js 对Taro.Evnts进行二次封装，使得支持after等功能
 * https://nervjs.github.io/taro/docs/events.html
 */

import Taro, { Events } from '@tarojs/taro';
import { removeItem } from './utils';

// Taro 还提供了一个全局消息中心
export const eventCenter = Taro.eventCenter;

export const EventProxy = (() => {
  /* 闭包实现单例event的模式 */
  const ALL_EVENT = '__all__';
  const SLICE = Array.prototype.slice;
  // 每个EventProxy实例对应一个 Taro.Events 的实例
  const event = new Events();
  let ins;
  class EventEmmiter {
    //Taro 还提供了一个全局消息中心 Taro.eventCenter 以供使用，它是 Taro.Events 的实例
    static eventCenter = Taro.eventCenter;

    constructor(debug) {
      this._callbacks = {};
      this._fired = {};
      this._debug = debug;
    }

    debug(msg, ev, data) {
      if (this._debug) {
        console.warn(msg, ev, data);
      }
    }

    /**
     * Bind an event, specified by a string name, `ev`, to a `callback` function.
     * Passing __ALL_EVENT__ will bind the callback to all events fired.
     * Examples:
     * ```js
     * let proxy = new EventProxy();
     * proxy.on("template", function (event) {
     *   // TODO
     * });
     * ```
     * @param {String} ev Event name.
     * @param {Function} callback Callback.
     */
    on(ev, callback) {
      event.on(ev, callback);
    }

    /**
     * Remove one or many callbacks.
     *
     * - If `callback` is null, removes all callbacks for the event.
     * - If `eventname` is null, removes all bound callbacks for all events.
     * @param {String} ev Event name.
     * @param {Function} callback Callback.
     */
    off(ev, callback) {
      event.off(ev, callback);
    }

    /**
     * Trigger an event, firing all bound callbacks. Callbacks are passed the
     * same arguments as `trigger` is, apart from the event name.
     * Listening for `"all"` passes the true event name as the first argument.
     * @param {String} eventname Event name
     * @param {Mix} ...args Pass in data
     */
    trigger(eventname, ...data) {
      let list, ev, callback, i, l;
      let both = 2;
      let calls = this._callbacks;
      this.debug('Emit event %s with data %j', eventname, data);
      while (both--) {
        ev = both ? eventname : ALL_EVENT;
        list = calls[ev];
        if (list) {
          for (i = 0, l = list.length; i < l; i++) {
            if (!(callback = list[i])) {
              list.splice(i, 1);
              i--;
              l--;
            } else {
              let args = [];
              let start = both ? 1 : 0;
              for (let j = start; j < arguments.length; j++) {
                args.push(arguments[j]);
              }
              if (both) {
                event.trigger(eventname, ...data);
              } else {
                callback.apply(this, args);
              }
            }
          }
        } else {
          if (both) {
            event.trigger(eventname, ...data);
          }
        }
      }
      return this;
    }

    /**
     * The callback will be executed after the event be fired N times.
     * @param {String} ev Event name.
     * @param {Number} times N times.
     * @param {Function} callback Callback, that will be called after event was fired N times.
     */
    after(ev, times, callback) {
      if (times === 0) {
        callback.call(null, []);
        return this;
      }
      let firedData = [];
      this._after = this._after || {};
      let group = ev + '_group';
      this._after[group] = { index: 0, results: [] };

      const all = (name, data) => {
        if (name === ev) {
          times--;
          firedData.push(data);
          if (times < 1) {
            this.debug(
              'Event %s was emit %s, and execute the listenner',
              ev,
              times
            );
            this.unbindForAll(all);
            callback.apply(null, [firedData]);
            let list = this._callbacks[ev];
            console.log(list);
          }
        }
        // order data
        if (name === group) {
          times--;
          this._after[group].results[data.index] = data.result;
          if (times < 1) {
            this.debug(
              'Event %s was emit %s, and execute the listenner',
              ev,
              times
            );
            this.unbindForAll(all);
            callback.call(null, this._after[group].results);
            let list = this._callbacks[ev];
            console.log(list);
          }
        }
      };
      /*  this._callbacks[ev] = this._callbacks[ev] || [];
      this._callbacks[ev].push(all); */
      this.bindForAll(all);
      return this;
    }

    /**
     * The `after` method's helper. Use it will return ordered results.
     * If you need manipulate result, you need callback
     * Examples:
     * ```js
     * let ep = new EventProxy();
     * ep.after('file', files.length, function (list) {
     *   // Ordered results
     * });
     * for (let i = 0; i < files.length; i++) {
     *   fs.readFile(files[i], 'utf-8', ep.group('file'));
     * }
     * ```
     * @param {String} eventname Event name, shoule keep consistent with `after`.
     * @param {Function} callback Callback function, should return the final result.
     */
    group(eventname, callback) {
      let group = eventname + '_group';
      let index = this._after[group].index;
      this._after[group].index++;
      return (err, data) => {
        if (err) {
          // put all arguments to the error handler
          return this.trigger.apply(
            this,
            ['error'].concat(SLICE.call(arguments))
          );
        }
        this.trigger(group, {
          index: index, // callback(err, args1, args2, ...)
          result: callback
            ? callback.apply(null, SLICE.call(arguments, 1))
            : data
        });
      };
    }

    /**
     * Bind the ALL_EVENT event
     */
    bindForAll(callback) {
      this._callbacks[ALL_EVENT] = this._callbacks[ALL_EVENT] || [];
      this._callbacks[ALL_EVENT].push(callback);
      this.on(ALL_EVENT, callback);
    }

    /**
     * Unbind the ALL_EVENT event
     */
    unbindForAll(callback) {
      removeItem(this._callbacks[ALL_EVENT], callback);
      this.off(ALL_EVENT, callback);
    }
  }

  return () => {
    if (ins) {
      return ins;
    }
    ins = new EventEmmiter();
    return ins;
  };
})();

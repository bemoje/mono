'use strict'
var $n = Object.create
var Qt = Object.defineProperty
var Bn = Object.getOwnPropertyDescriptor
var zn = Object.getOwnPropertyNames
var Un = Object.getPrototypeOf,
  Gn = Object.prototype.hasOwnProperty
var o = (i, t) => Qt(i, 'name', { value: t, configurable: !0 })
var x = (i, t) => () => (t || i((t = { exports: {} }).exports, t), t.exports),
  Jn = (i, t) => {
    for (var e in t) Qt(i, e, { get: t[e], enumerable: !0 })
  },
  Ji = (i, t, e, s) => {
    if ((t && typeof t == 'object') || typeof t == 'function')
      for (let r of zn(t))
        !Gn.call(i, r) && r !== e && Qt(i, r, { get: () => t[r], enumerable: !(s = Bn(t, r)) || s.enumerable })
    return i
  }
var At = (i, t, e) => (
    (e = i != null ? $n(Un(i)) : {}),
    Ji(t || !i || !i.__esModule ? Qt(e, 'default', { value: i, enumerable: !0 }) : e, i)
  ),
  Hn = (i) => Ji(Qt({}, '__esModule', { value: !0 }), i)
var _ = x((si) => {
  'use strict'
  si.fromCallback = function (i) {
    return Object.defineProperty(
      function (...t) {
        if (typeof t[t.length - 1] == 'function') i.apply(this, t)
        else
          return new Promise((e, s) => {
            ;(t.push((r, n) => (r != null ? s(r) : e(n))), i.apply(this, t))
          })
      },
      'name',
      { value: i.name },
    )
  }
  si.fromPromise = function (i) {
    return Object.defineProperty(
      function (...t) {
        let e = t[t.length - 1]
        if (typeof e != 'function') return i.apply(this, t)
        ;(t.pop(), i.apply(this, t).then((s) => e(null, s), e))
      },
      'name',
      { value: i.name },
    )
  }
})
var Vi = x((_c, Hi) => {
  'use strict'
  var Et = require('constants'),
    Vn = process.cwd,
    ke = null,
    Kn = process.env.GRACEFUL_FS_PLATFORM || process.platform
  process.cwd = function () {
    return (ke || (ke = Vn.call(process)), ke)
  }
  try {
    process.cwd()
  } catch {}
  typeof process.chdir == 'function' &&
    ((ri = process.chdir),
    (process.chdir = function (i) {
      ;((ke = null), ri.call(process, i))
    }),
    Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, ri))
  var ri
  Hi.exports = Yn
  function Yn(i) {
    ;(Et.hasOwnProperty('O_SYMLINK') && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(i),
      i.lutimes || e(i),
      (i.chown = n(i.chown)),
      (i.fchown = n(i.fchown)),
      (i.lchown = n(i.lchown)),
      (i.chmod = s(i.chmod)),
      (i.fchmod = s(i.fchmod)),
      (i.lchmod = s(i.lchmod)),
      (i.chownSync = a(i.chownSync)),
      (i.fchownSync = a(i.fchownSync)),
      (i.lchownSync = a(i.lchownSync)),
      (i.chmodSync = r(i.chmodSync)),
      (i.fchmodSync = r(i.fchmodSync)),
      (i.lchmodSync = r(i.lchmodSync)),
      (i.stat = h(i.stat)),
      (i.fstat = h(i.fstat)),
      (i.lstat = h(i.lstat)),
      (i.statSync = c(i.statSync)),
      (i.fstatSync = c(i.fstatSync)),
      (i.lstatSync = c(i.lstatSync)),
      i.chmod &&
        !i.lchmod &&
        ((i.lchmod = function (l, u, p) {
          p && process.nextTick(p)
        }),
        (i.lchmodSync = function () {})),
      i.chown &&
        !i.lchown &&
        ((i.lchown = function (l, u, p, d) {
          d && process.nextTick(d)
        }),
        (i.lchownSync = function () {})),
      Kn === 'win32' &&
        (i.rename =
          typeof i.rename != 'function'
            ? i.rename
            : (function (l) {
                function u(p, d, w) {
                  var m = Date.now(),
                    g = 0
                  l(
                    p,
                    d,
                    o(function y(v) {
                      if (
                        v &&
                        (v.code === 'EACCES' || v.code === 'EPERM' || v.code === 'EBUSY') &&
                        Date.now() - m < 6e4
                      ) {
                        ;(setTimeout(function () {
                          i.stat(d, function (S, b) {
                            S && S.code === 'ENOENT' ? l(p, d, y) : w(v)
                          })
                        }, g),
                          g < 100 && (g += 10))
                        return
                      }
                      w && w(v)
                    }, 'CB'),
                  )
                }
                return (o(u, 'rename'), Object.setPrototypeOf && Object.setPrototypeOf(u, l), u)
              })(i.rename)),
      (i.read =
        typeof i.read != 'function'
          ? i.read
          : (function (l) {
              function u(p, d, w, m, g, y) {
                var v
                if (y && typeof y == 'function') {
                  var S = 0
                  v = o(function (b, C, tt) {
                    if (b && b.code === 'EAGAIN' && S < 10) return (S++, l.call(i, p, d, w, m, g, v))
                    y.apply(this, arguments)
                  }, 'callback')
                }
                return l.call(i, p, d, w, m, g, v)
              }
              return (o(u, 'read'), Object.setPrototypeOf && Object.setPrototypeOf(u, l), u)
            })(i.read)),
      (i.readSync =
        typeof i.readSync != 'function'
          ? i.readSync
          : (function (l) {
              return function (u, p, d, w, m) {
                for (var g = 0; ; )
                  try {
                    return l.call(i, u, p, d, w, m)
                  } catch (y) {
                    if (y.code === 'EAGAIN' && g < 10) {
                      g++
                      continue
                    }
                    throw y
                  }
              }
            })(i.readSync)))
    function t(l) {
      ;((l.lchmod = function (u, p, d) {
        l.open(u, Et.O_WRONLY | Et.O_SYMLINK, p, function (w, m) {
          if (w) {
            d && d(w)
            return
          }
          l.fchmod(m, p, function (g) {
            l.close(m, function (y) {
              d && d(g || y)
            })
          })
        })
      }),
        (l.lchmodSync = function (u, p) {
          var d = l.openSync(u, Et.O_WRONLY | Et.O_SYMLINK, p),
            w = !0,
            m
          try {
            ;((m = l.fchmodSync(d, p)), (w = !1))
          } finally {
            if (w)
              try {
                l.closeSync(d)
              } catch {}
            else l.closeSync(d)
          }
          return m
        }))
    }
    o(t, 'patchLchmod')
    function e(l) {
      Et.hasOwnProperty('O_SYMLINK') && l.futimes
        ? ((l.lutimes = function (u, p, d, w) {
            l.open(u, Et.O_SYMLINK, function (m, g) {
              if (m) {
                w && w(m)
                return
              }
              l.futimes(g, p, d, function (y) {
                l.close(g, function (v) {
                  w && w(y || v)
                })
              })
            })
          }),
          (l.lutimesSync = function (u, p, d) {
            var w = l.openSync(u, Et.O_SYMLINK),
              m,
              g = !0
            try {
              ;((m = l.futimesSync(w, p, d)), (g = !1))
            } finally {
              if (g)
                try {
                  l.closeSync(w)
                } catch {}
              else l.closeSync(w)
            }
            return m
          }))
        : l.futimes &&
          ((l.lutimes = function (u, p, d, w) {
            w && process.nextTick(w)
          }),
          (l.lutimesSync = function () {}))
    }
    o(e, 'patchLutimes')
    function s(l) {
      return (
        l &&
        function (u, p, d) {
          return l.call(i, u, p, function (w) {
            ;(f(w) && (w = null), d && d.apply(this, arguments))
          })
        }
      )
    }
    o(s, 'chmodFix')
    function r(l) {
      return (
        l &&
        function (u, p) {
          try {
            return l.call(i, u, p)
          } catch (d) {
            if (!f(d)) throw d
          }
        }
      )
    }
    o(r, 'chmodFixSync')
    function n(l) {
      return (
        l &&
        function (u, p, d, w) {
          return l.call(i, u, p, d, function (m) {
            ;(f(m) && (m = null), w && w.apply(this, arguments))
          })
        }
      )
    }
    o(n, 'chownFix')
    function a(l) {
      return (
        l &&
        function (u, p, d) {
          try {
            return l.call(i, u, p, d)
          } catch (w) {
            if (!f(w)) throw w
          }
        }
      )
    }
    o(a, 'chownFixSync')
    function h(l) {
      return (
        l &&
        function (u, p, d) {
          typeof p == 'function' && ((d = p), (p = null))
          function w(m, g) {
            ;(g && (g.uid < 0 && (g.uid += 4294967296), g.gid < 0 && (g.gid += 4294967296)),
              d && d.apply(this, arguments))
          }
          return (o(w, 'callback'), p ? l.call(i, u, p, w) : l.call(i, u, w))
        }
      )
    }
    o(h, 'statFix')
    function c(l) {
      return (
        l &&
        function (u, p) {
          var d = p ? l.call(i, u, p) : l.call(i, u)
          return (d && (d.uid < 0 && (d.uid += 4294967296), d.gid < 0 && (d.gid += 4294967296)), d)
        }
      )
    }
    o(c, 'statFixSync')
    function f(l) {
      if (!l || l.code === 'ENOSYS') return !0
      var u = !process.getuid || process.getuid() !== 0
      return !!(u && (l.code === 'EINVAL' || l.code === 'EPERM'))
    }
    o(f, 'chownErOk')
  }
  o(Yn, 'patch')
})
var Xi = x((Lc, Yi) => {
  'use strict'
  var Ki = require('stream').Stream
  Yi.exports = Xn
  function Xn(i) {
    return { ReadStream: t, WriteStream: e }
    function t(s, r) {
      if (!(this instanceof t)) return new t(s, r)
      Ki.call(this)
      var n = this
      ;((this.path = s),
        (this.fd = null),
        (this.readable = !0),
        (this.paused = !1),
        (this.flags = 'r'),
        (this.mode = 438),
        (this.bufferSize = 64 * 1024),
        (r = r || {}))
      for (var a = Object.keys(r), h = 0, c = a.length; h < c; h++) {
        var f = a[h]
        this[f] = r[f]
      }
      if ((this.encoding && this.setEncoding(this.encoding), this.start !== void 0)) {
        if (typeof this.start != 'number') throw TypeError('start must be a Number')
        if (this.end === void 0) this.end = 1 / 0
        else if (typeof this.end != 'number') throw TypeError('end must be a Number')
        if (this.start > this.end) throw new Error('start must be <= end')
        this.pos = this.start
      }
      if (this.fd !== null) {
        process.nextTick(function () {
          n._read()
        })
        return
      }
      i.open(this.path, this.flags, this.mode, function (l, u) {
        if (l) {
          ;(n.emit('error', l), (n.readable = !1))
          return
        }
        ;((n.fd = u), n.emit('open', u), n._read())
      })
    }
    function e(s, r) {
      if (!(this instanceof e)) return new e(s, r)
      ;(Ki.call(this),
        (this.path = s),
        (this.fd = null),
        (this.writable = !0),
        (this.flags = 'w'),
        (this.encoding = 'binary'),
        (this.mode = 438),
        (this.bytesWritten = 0),
        (r = r || {}))
      for (var n = Object.keys(r), a = 0, h = n.length; a < h; a++) {
        var c = n[a]
        this[c] = r[c]
      }
      if (this.start !== void 0) {
        if (typeof this.start != 'number') throw TypeError('start must be a Number')
        if (this.start < 0) throw new Error('start must be >= zero')
        this.pos = this.start
      }
      ;((this.busy = !1),
        (this._queue = []),
        this.fd === null &&
          ((this._open = i.open),
          this._queue.push([this._open, this.path, this.flags, this.mode, void 0]),
          this.flush()))
    }
  }
  o(Xn, 'legacy')
})
var Zi = x((jc, Qi) => {
  'use strict'
  Qi.exports = Zn
  var Qn =
    Object.getPrototypeOf ||
    function (i) {
      return i.__proto__
    }
  function Zn(i) {
    if (i === null || typeof i != 'object') return i
    if (i instanceof Object) var t = { __proto__: Qn(i) }
    else var t = Object.create(null)
    return (
      Object.getOwnPropertyNames(i).forEach(function (e) {
        Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(i, e))
      }),
      t
    )
  }
  o(Zn, 'clone')
})
var Mt = x((qc, ai) => {
  'use strict'
  var P = require('fs'),
    to = Vi(),
    eo = Xi(),
    io = Zi(),
    Fe = require('util'),
    B,
    Ce
  typeof Symbol == 'function' && typeof Symbol.for == 'function'
    ? ((B = Symbol.for('graceful-fs.queue')), (Ce = Symbol.for('graceful-fs.previous')))
    : ((B = '___graceful-fs.queue'), (Ce = '___graceful-fs.previous'))
  function so() {}
  o(so, 'noop')
  function is(i, t) {
    Object.defineProperty(i, B, {
      get: o(function () {
        return t
      }, 'get'),
    })
  }
  o(is, 'publishQueue')
  var Dt = so
  Fe.debuglog
    ? (Dt = Fe.debuglog('gfs4'))
    : /\bgfs4\b/i.test(process.env.NODE_DEBUG || '') &&
      (Dt = o(function () {
        var i = Fe.format.apply(Fe, arguments)
        ;((i =
          'GFS4: ' +
          i.split(/\n/).join(`
GFS4: `)),
          console.error(i))
      }, 'debug'))
  P[B] ||
    ((ts = global[B] || []),
    is(P, ts),
    (P.close = (function (i) {
      function t(e, s) {
        return i.call(P, e, function (r) {
          ;(r || es(), typeof s == 'function' && s.apply(this, arguments))
        })
      }
      return (o(t, 'close'), Object.defineProperty(t, Ce, { value: i }), t)
    })(P.close)),
    (P.closeSync = (function (i) {
      function t(e) {
        ;(i.apply(P, arguments), es())
      }
      return (o(t, 'closeSync'), Object.defineProperty(t, Ce, { value: i }), t)
    })(P.closeSync)),
    /\bgfs4\b/i.test(process.env.NODE_DEBUG || '') &&
      process.on('exit', function () {
        ;(Dt(P[B]), require('assert').equal(P[B].length, 0))
      }))
  var ts
  global[B] || is(global, P[B])
  ai.exports = ni(io(P))
  process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !P.__patched && ((ai.exports = ni(P)), (P.__patched = !0))
  function ni(i) {
    ;(to(i), (i.gracefulify = ni), (i.createReadStream = C), (i.createWriteStream = tt))
    var t = i.readFile
    i.readFile = e
    function e(E, k, F) {
      return (typeof k == 'function' && ((F = k), (k = null)), I(E, k, F))
      function I(q, A, D, R) {
        return t(q, A, function (O) {
          O && (O.code === 'EMFILE' || O.code === 'ENFILE')
            ? _t([I, [q, A, D], O, R || Date.now(), Date.now()])
            : typeof D == 'function' && D.apply(this, arguments)
        })
      }
      o(I, 'go$readFile')
    }
    o(e, 'readFile')
    var s = i.writeFile
    i.writeFile = r
    function r(E, k, F, I) {
      return (typeof F == 'function' && ((I = F), (F = null)), q(E, k, F, I))
      function q(A, D, R, O, $) {
        return s(A, D, R, function (T) {
          T && (T.code === 'EMFILE' || T.code === 'ENFILE')
            ? _t([q, [A, D, R, O], T, $ || Date.now(), Date.now()])
            : typeof O == 'function' && O.apply(this, arguments)
        })
      }
      o(q, 'go$writeFile')
    }
    o(r, 'writeFile')
    var n = i.appendFile
    n && (i.appendFile = a)
    function a(E, k, F, I) {
      return (typeof F == 'function' && ((I = F), (F = null)), q(E, k, F, I))
      function q(A, D, R, O, $) {
        return n(A, D, R, function (T) {
          T && (T.code === 'EMFILE' || T.code === 'ENFILE')
            ? _t([q, [A, D, R, O], T, $ || Date.now(), Date.now()])
            : typeof O == 'function' && O.apply(this, arguments)
        })
      }
      o(q, 'go$appendFile')
    }
    o(a, 'appendFile')
    var h = i.copyFile
    h && (i.copyFile = c)
    function c(E, k, F, I) {
      return (typeof F == 'function' && ((I = F), (F = 0)), q(E, k, F, I))
      function q(A, D, R, O, $) {
        return h(A, D, R, function (T) {
          T && (T.code === 'EMFILE' || T.code === 'ENFILE')
            ? _t([q, [A, D, R, O], T, $ || Date.now(), Date.now()])
            : typeof O == 'function' && O.apply(this, arguments)
        })
      }
      o(q, 'go$copyFile')
    }
    o(c, 'copyFile')
    var f = i.readdir
    i.readdir = u
    var l = /^v[0-5]\./
    function u(E, k, F) {
      typeof k == 'function' && ((F = k), (k = null))
      var I = l.test(process.version)
        ? o(function (D, R, O, $) {
            return f(D, q(D, R, O, $))
          }, 'go$readdir')
        : o(function (D, R, O, $) {
            return f(D, R, q(D, R, O, $))
          }, 'go$readdir')
      return I(E, k, F)
      function q(A, D, R, O) {
        return function ($, T) {
          $ && ($.code === 'EMFILE' || $.code === 'ENFILE')
            ? _t([I, [A, D, R], $, O || Date.now(), Date.now()])
            : (T && T.sort && T.sort(), typeof R == 'function' && R.call(this, $, T))
        }
      }
    }
    if ((o(u, 'readdir'), process.version.substr(0, 4) === 'v0.8')) {
      var p = eo(i)
      ;((y = p.ReadStream), (S = p.WriteStream))
    }
    var d = i.ReadStream
    d && ((y.prototype = Object.create(d.prototype)), (y.prototype.open = v))
    var w = i.WriteStream
    ;(w && ((S.prototype = Object.create(w.prototype)), (S.prototype.open = b)),
      Object.defineProperty(i, 'ReadStream', {
        get: o(function () {
          return y
        }, 'get'),
        set: o(function (E) {
          y = E
        }, 'set'),
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(i, 'WriteStream', {
        get: o(function () {
          return S
        }, 'get'),
        set: o(function (E) {
          S = E
        }, 'set'),
        enumerable: !0,
        configurable: !0,
      }))
    var m = y
    Object.defineProperty(i, 'FileReadStream', {
      get: o(function () {
        return m
      }, 'get'),
      set: o(function (E) {
        m = E
      }, 'set'),
      enumerable: !0,
      configurable: !0,
    })
    var g = S
    Object.defineProperty(i, 'FileWriteStream', {
      get: o(function () {
        return g
      }, 'get'),
      set: o(function (E) {
        g = E
      }, 'set'),
      enumerable: !0,
      configurable: !0,
    })
    function y(E, k) {
      return this instanceof y ? (d.apply(this, arguments), this) : y.apply(Object.create(y.prototype), arguments)
    }
    o(y, 'ReadStream')
    function v() {
      var E = this
      bt(E.path, E.flags, E.mode, function (k, F) {
        k ? (E.autoClose && E.destroy(), E.emit('error', k)) : ((E.fd = F), E.emit('open', F), E.read())
      })
    }
    o(v, 'ReadStream$open')
    function S(E, k) {
      return this instanceof S ? (w.apply(this, arguments), this) : S.apply(Object.create(S.prototype), arguments)
    }
    o(S, 'WriteStream')
    function b() {
      var E = this
      bt(E.path, E.flags, E.mode, function (k, F) {
        k ? (E.destroy(), E.emit('error', k)) : ((E.fd = F), E.emit('open', F))
      })
    }
    o(b, 'WriteStream$open')
    function C(E, k) {
      return new i.ReadStream(E, k)
    }
    o(C, 'createReadStream')
    function tt(E, k) {
      return new i.WriteStream(E, k)
    }
    o(tt, 'createWriteStream')
    var St = i.open
    i.open = bt
    function bt(E, k, F, I) {
      return (typeof F == 'function' && ((I = F), (F = null)), q(E, k, F, I))
      function q(A, D, R, O, $) {
        return St(A, D, R, function (T, Rc) {
          T && (T.code === 'EMFILE' || T.code === 'ENFILE')
            ? _t([q, [A, D, R, O], T, $ || Date.now(), Date.now()])
            : typeof O == 'function' && O.apply(this, arguments)
        })
      }
      o(q, 'go$open')
    }
    return (o(bt, 'open'), i)
  }
  o(ni, 'patch')
  function _t(i) {
    ;(Dt('ENQUEUE', i[0].name, i[1]), P[B].push(i), oi())
  }
  o(_t, 'enqueue')
  var Oe
  function es() {
    for (var i = Date.now(), t = 0; t < P[B].length; ++t)
      P[B][t].length > 2 && ((P[B][t][3] = i), (P[B][t][4] = i))
    oi()
  }
  o(es, 'resetQueue')
  function oi() {
    if ((clearTimeout(Oe), (Oe = void 0), P[B].length !== 0)) {
      var i = P[B].shift(),
        t = i[0],
        e = i[1],
        s = i[2],
        r = i[3],
        n = i[4]
      if (r === void 0) (Dt('RETRY', t.name, e), t.apply(null, e))
      else if (Date.now() - r >= 6e4) {
        Dt('TIMEOUT', t.name, e)
        var a = e.pop()
        typeof a == 'function' && a.call(null, s)
      } else {
        var h = Date.now() - n,
          c = Math.max(n - r, 1),
          f = Math.min(c * 1.2, 100)
        h >= f ? (Dt('RETRY', t.name, e), t.apply(null, e.concat([r]))) : P[B].push(i)
      }
      Oe === void 0 && (Oe = setTimeout(oi, 0))
    }
  }
  o(oi, 'retry')
})
var K = x((mt) => {
  'use strict'
  var ss = _().fromCallback,
    V = Mt(),
    ro = [
      'access',
      'appendFile',
      'chmod',
      'chown',
      'close',
      'copyFile',
      'cp',
      'fchmod',
      'fchown',
      'fdatasync',
      'fstat',
      'fsync',
      'ftruncate',
      'futimes',
      'glob',
      'lchmod',
      'lchown',
      'lutimes',
      'link',
      'lstat',
      'mkdir',
      'mkdtemp',
      'open',
      'opendir',
      'readdir',
      'readFile',
      'readlink',
      'realpath',
      'rename',
      'rm',
      'rmdir',
      'stat',
      'statfs',
      'symlink',
      'truncate',
      'unlink',
      'utimes',
      'writeFile',
    ].filter((i) => typeof V[i] == 'function')
  Object.assign(mt, V)
  ro.forEach((i) => {
    mt[i] = ss(V[i])
  })
  mt.exists = function (i, t) {
    return typeof t == 'function' ? V.exists(i, t) : new Promise((e) => V.exists(i, e))
  }
  mt.read = function (i, t, e, s, r, n) {
    return typeof n == 'function'
      ? V.read(i, t, e, s, r, n)
      : new Promise((a, h) => {
          V.read(i, t, e, s, r, (c, f, l) => {
            if (c) return h(c)
            a({ bytesRead: f, buffer: l })
          })
        })
  }
  mt.write = function (i, t, ...e) {
    return typeof e[e.length - 1] == 'function'
      ? V.write(i, t, ...e)
      : new Promise((s, r) => {
          V.write(i, t, ...e, (n, a, h) => {
            if (n) return r(n)
            s({ bytesWritten: a, buffer: h })
          })
        })
  }
  mt.readv = function (i, t, ...e) {
    return typeof e[e.length - 1] == 'function'
      ? V.readv(i, t, ...e)
      : new Promise((s, r) => {
          V.readv(i, t, ...e, (n, a, h) => {
            if (n) return r(n)
            s({ bytesRead: a, buffers: h })
          })
        })
  }
  mt.writev = function (i, t, ...e) {
    return typeof e[e.length - 1] == 'function'
      ? V.writev(i, t, ...e)
      : new Promise((s, r) => {
          V.writev(i, t, ...e, (n, a, h) => {
            if (n) return r(n)
            s({ bytesWritten: a, buffers: h })
          })
        })
  }
  typeof V.realpath.native == 'function'
    ? (mt.realpath.native = ss(V.realpath.native))
    : process.emitWarning(
        'fs.realpath.native is not a function. Is fs being monkey-patched?',
        'Warning',
        'fs-extra-WARN0003',
      )
})
var ns = x((zc, rs) => {
  'use strict'
  var no = require('path')
  rs.exports.checkPath = o(function (t) {
    if (process.platform === 'win32' && /[<>:"|?*]/.test(t.replace(no.parse(t).root, ''))) {
      let s = new Error(`Path contains invalid characters: ${t}`)
      throw ((s.code = 'EINVAL'), s)
    }
  }, 'checkPath')
})
var cs = x((Gc, hi) => {
  'use strict'
  var os = K(),
    { checkPath: as } = ns(),
    hs = o((i) => {
      let t = { mode: 511 }
      return typeof i == 'number' ? i : { ...t, ...i }.mode
    }, 'getMode')
  hi.exports.makeDir = async (i, t) => (as(i), os.mkdir(i, { mode: hs(t), recursive: !0 }))
  hi.exports.makeDirSync = (i, t) => (as(i), os.mkdirSync(i, { mode: hs(t), recursive: !0 }))
})
var ot = x((Hc, ls) => {
  'use strict'
  var oo = _().fromPromise,
    { makeDir: ao, makeDirSync: ci } = cs(),
    li = oo(ao)
  ls.exports = { mkdirs: li, mkdirsSync: ci, mkdirp: li, mkdirpSync: ci, ensureDir: li, ensureDirSync: ci }
})
var vt = x((Vc, fs) => {
  'use strict'
  var ho = _().fromPromise,
    us = K()
  function co(i) {
    return us
      .access(i)
      .then(() => !0)
      .catch(() => !1)
  }
  o(co, 'pathExists')
  fs.exports = { pathExists: ho(co), pathExistsSync: us.existsSync }
})
var ui = x((Yc, ds) => {
  'use strict'
  var Lt = K(),
    lo = _().fromPromise
  async function uo(i, t, e) {
    let s = await Lt.open(i, 'r+'),
      r = null
    try {
      await Lt.futimes(s, t, e)
    } finally {
      try {
        await Lt.close(s)
      } catch (n) {
        r = n
      }
    }
    if (r) throw r
  }
  o(uo, 'utimesMillis')
  function fo(i, t, e) {
    let s = Lt.openSync(i, 'r+')
    return (Lt.futimesSync(s, t, e), Lt.closeSync(s))
  }
  o(fo, 'utimesMillisSync')
  ds.exports = { utimesMillis: lo(uo), utimesMillisSync: fo }
})
var Pt = x((Qc, ys) => {
  'use strict'
  var Wt = K(),
    M = require('path'),
    ps = _().fromPromise
  function po(i, t, e) {
    let s = e.dereference ? (r) => Wt.stat(r, { bigint: !0 }) : (r) => Wt.lstat(r, { bigint: !0 })
    return Promise.all([
      s(i),
      s(t).catch((r) => {
        if (r.code === 'ENOENT') return null
        throw r
      }),
    ]).then(([r, n]) => ({ srcStat: r, destStat: n }))
  }
  o(po, 'getStats')
  function mo(i, t, e) {
    let s,
      r = e.dereference ? (a) => Wt.statSync(a, { bigint: !0 }) : (a) => Wt.lstatSync(a, { bigint: !0 }),
      n = r(i)
    try {
      s = r(t)
    } catch (a) {
      if (a.code === 'ENOENT') return { srcStat: n, destStat: null }
      throw a
    }
    return { srcStat: n, destStat: s }
  }
  o(mo, 'getStatsSync')
  async function wo(i, t, e, s) {
    let { srcStat: r, destStat: n } = await po(i, t, s)
    if (n) {
      if (Zt(r, n)) {
        let a = M.basename(i),
          h = M.basename(t)
        if (e === 'move' && a !== h && a.toLowerCase() === h.toLowerCase())
          return { srcStat: r, destStat: n, isChangingCase: !0 }
        throw new Error('Source and destination must not be the same.')
      }
      if (r.isDirectory() && !n.isDirectory())
        throw new Error(`Cannot overwrite non-directory '${t}' with directory '${i}'.`)
      if (!r.isDirectory() && n.isDirectory())
        throw new Error(`Cannot overwrite directory '${t}' with non-directory '${i}'.`)
    }
    if (r.isDirectory() && fi(i, t)) throw new Error(Te(i, t, e))
    return { srcStat: r, destStat: n }
  }
  o(wo, 'checkPaths')
  function yo(i, t, e, s) {
    let { srcStat: r, destStat: n } = mo(i, t, s)
    if (n) {
      if (Zt(r, n)) {
        let a = M.basename(i),
          h = M.basename(t)
        if (e === 'move' && a !== h && a.toLowerCase() === h.toLowerCase())
          return { srcStat: r, destStat: n, isChangingCase: !0 }
        throw new Error('Source and destination must not be the same.')
      }
      if (r.isDirectory() && !n.isDirectory())
        throw new Error(`Cannot overwrite non-directory '${t}' with directory '${i}'.`)
      if (!r.isDirectory() && n.isDirectory())
        throw new Error(`Cannot overwrite directory '${t}' with non-directory '${i}'.`)
    }
    if (r.isDirectory() && fi(i, t)) throw new Error(Te(i, t, e))
    return { srcStat: r, destStat: n }
  }
  o(yo, 'checkPathsSync')
  async function ms(i, t, e, s) {
    let r = M.resolve(M.dirname(i)),
      n = M.resolve(M.dirname(e))
    if (n === r || n === M.parse(n).root) return
    let a
    try {
      a = await Wt.stat(n, { bigint: !0 })
    } catch (h) {
      if (h.code === 'ENOENT') return
      throw h
    }
    if (Zt(t, a)) throw new Error(Te(i, e, s))
    return ms(i, t, n, s)
  }
  o(ms, 'checkParentPaths')
  function ws(i, t, e, s) {
    let r = M.resolve(M.dirname(i)),
      n = M.resolve(M.dirname(e))
    if (n === r || n === M.parse(n).root) return
    let a
    try {
      a = Wt.statSync(n, { bigint: !0 })
    } catch (h) {
      if (h.code === 'ENOENT') return
      throw h
    }
    if (Zt(t, a)) throw new Error(Te(i, e, s))
    return ws(i, t, n, s)
  }
  o(ws, 'checkParentPathsSync')
  function Zt(i, t) {
    return t.ino && t.dev && t.ino === i.ino && t.dev === i.dev
  }
  o(Zt, 'areIdentical')
  function fi(i, t) {
    let e = M.resolve(i)
        .split(M.sep)
        .filter((r) => r),
      s = M.resolve(t)
        .split(M.sep)
        .filter((r) => r)
    return e.every((r, n) => s[n] === r)
  }
  o(fi, 'isSrcSubdir')
  function Te(i, t, e) {
    return `Cannot ${e} '${i}' to a subdirectory of itself, '${t}'.`
  }
  o(Te, 'errMsg')
  ys.exports = {
    checkPaths: ps(wo),
    checkPathsSync: yo,
    checkParentPaths: ps(ms),
    checkParentPathsSync: ws,
    isSrcSubdir: fi,
    areIdentical: Zt,
  }
})
var vs = x((tl, Es) => {
  'use strict'
  var U = K(),
    te = require('path'),
    { mkdirs: go } = ot(),
    { pathExists: So } = vt(),
    { utimesMillis: bo } = ui(),
    ee = Pt()
  async function Eo(i, t, e = {}) {
    ;(typeof e == 'function' && (e = { filter: e }),
      (e.clobber = 'clobber' in e ? !!e.clobber : !0),
      (e.overwrite = 'overwrite' in e ? !!e.overwrite : e.clobber),
      e.preserveTimestamps &&
        process.arch === 'ia32' &&
        process.emitWarning(
          `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
          'Warning',
          'fs-extra-WARN0001',
        ))
    let { srcStat: s, destStat: r } = await ee.checkPaths(i, t, 'copy', e)
    if ((await ee.checkParentPaths(i, s, t, 'copy'), !(await Ss(i, t, e)))) return
    let a = te.dirname(t)
    ;((await So(a)) || (await go(a)), await bs(r, i, t, e))
  }
  o(Eo, 'copy')
  async function Ss(i, t, e) {
    return e.filter ? e.filter(i, t) : !0
  }
  o(Ss, 'runFilter')
  async function bs(i, t, e, s) {
    let n = await (s.dereference ? U.stat : U.lstat)(t)
    if (n.isDirectory()) return Fo(n, i, t, e, s)
    if (n.isFile() || n.isCharacterDevice() || n.isBlockDevice()) return vo(n, i, t, e, s)
    if (n.isSymbolicLink()) return Oo(i, t, e, s)
    throw n.isSocket()
      ? new Error(`Cannot copy a socket file: ${t}`)
      : n.isFIFO()
        ? new Error(`Cannot copy a FIFO pipe: ${t}`)
        : new Error(`Unknown file: ${t}`)
  }
  o(bs, 'getStatsAndPerformCopy')
  async function vo(i, t, e, s, r) {
    if (!t) return gs(i, e, s, r)
    if (r.overwrite) return (await U.unlink(s), gs(i, e, s, r))
    if (r.errorOnExist) throw new Error(`'${s}' already exists`)
  }
  o(vo, 'onFile')
  async function gs(i, t, e, s) {
    if ((await U.copyFile(t, e), s.preserveTimestamps)) {
      xo(i.mode) && (await ko(e, i.mode))
      let r = await U.stat(t)
      await bo(e, r.atime, r.mtime)
    }
    return U.chmod(e, i.mode)
  }
  o(gs, 'copyFile')
  function xo(i) {
    return (i & 128) === 0
  }
  o(xo, 'fileIsNotWritable')
  function ko(i, t) {
    return U.chmod(i, t | 128)
  }
  o(ko, 'makeFileWritable')
  async function Fo(i, t, e, s, r) {
    t || (await U.mkdir(s))
    let n = []
    for await (let a of await U.opendir(e)) {
      let h = te.join(e, a.name),
        c = te.join(s, a.name)
      n.push(
        Ss(h, c, r).then((f) => {
          if (f) return ee.checkPaths(h, c, 'copy', r).then(({ destStat: l }) => bs(l, h, c, r))
        }),
      )
    }
    ;(await Promise.all(n), t || (await U.chmod(s, i.mode)))
  }
  o(Fo, 'onDir')
  async function Oo(i, t, e, s) {
    let r = await U.readlink(t)
    if ((s.dereference && (r = te.resolve(process.cwd(), r)), !i)) return U.symlink(r, e)
    let n = null
    try {
      n = await U.readlink(e)
    } catch (a) {
      if (a.code === 'EINVAL' || a.code === 'UNKNOWN') return U.symlink(r, e)
      throw a
    }
    if ((s.dereference && (n = te.resolve(process.cwd(), n)), ee.isSrcSubdir(r, n)))
      throw new Error(`Cannot copy '${r}' to a subdirectory of itself, '${n}'.`)
    if (ee.isSrcSubdir(n, r)) throw new Error(`Cannot overwrite '${n}' with '${r}'.`)
    return (await U.unlink(e), U.symlink(r, e))
  }
  o(Oo, 'onLink')
  Es.exports = Eo
})
var Cs = x((il, Os) => {
  'use strict'
  var Y = Mt(),
    ie = require('path'),
    Co = ot().mkdirsSync,
    To = ui().utimesMillisSync,
    se = Pt()
  function Do(i, t, e) {
    ;(typeof e == 'function' && (e = { filter: e }),
      (e = e || {}),
      (e.clobber = 'clobber' in e ? !!e.clobber : !0),
      (e.overwrite = 'overwrite' in e ? !!e.overwrite : e.clobber),
      e.preserveTimestamps &&
        process.arch === 'ia32' &&
        process.emitWarning(
          `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
          'Warning',
          'fs-extra-WARN0002',
        ))
    let { srcStat: s, destStat: r } = se.checkPathsSync(i, t, 'copy', e)
    if ((se.checkParentPathsSync(i, s, t, 'copy'), e.filter && !e.filter(i, t))) return
    let n = ie.dirname(t)
    return (Y.existsSync(n) || Co(n), xs(r, i, t, e))
  }
  o(Do, 'copySync')
  function xs(i, t, e, s) {
    let n = (s.dereference ? Y.statSync : Y.lstatSync)(t)
    if (n.isDirectory()) return Lo(n, i, t, e, s)
    if (n.isFile() || n.isCharacterDevice() || n.isBlockDevice()) return Po(n, i, t, e, s)
    if (n.isSymbolicLink()) return Io(i, t, e, s)
    throw n.isSocket()
      ? new Error(`Cannot copy a socket file: ${t}`)
      : n.isFIFO()
        ? new Error(`Cannot copy a FIFO pipe: ${t}`)
        : new Error(`Unknown file: ${t}`)
  }
  o(xs, 'getStats')
  function Po(i, t, e, s, r) {
    return t ? Ro(i, e, s, r) : ks(i, e, s, r)
  }
  o(Po, 'onFile')
  function Ro(i, t, e, s) {
    if (s.overwrite) return (Y.unlinkSync(e), ks(i, t, e, s))
    if (s.errorOnExist) throw new Error(`'${e}' already exists`)
  }
  o(Ro, 'mayCopyFile')
  function ks(i, t, e, s) {
    return (Y.copyFileSync(t, e), s.preserveTimestamps && No(i.mode, t, e), di(e, i.mode))
  }
  o(ks, 'copyFile')
  function No(i, t, e) {
    return (Ao(i) && _o(e, i), Mo(t, e))
  }
  o(No, 'handleTimestamps')
  function Ao(i) {
    return (i & 128) === 0
  }
  o(Ao, 'fileIsNotWritable')
  function _o(i, t) {
    return di(i, t | 128)
  }
  o(_o, 'makeFileWritable')
  function di(i, t) {
    return Y.chmodSync(i, t)
  }
  o(di, 'setDestMode')
  function Mo(i, t) {
    let e = Y.statSync(i)
    return To(t, e.atime, e.mtime)
  }
  o(Mo, 'setDestTimestamps')
  function Lo(i, t, e, s, r) {
    return t ? Fs(e, s, r) : Wo(i.mode, e, s, r)
  }
  o(Lo, 'onDir')
  function Wo(i, t, e, s) {
    return (Y.mkdirSync(e), Fs(t, e, s), di(e, i))
  }
  o(Wo, 'mkDirAndCopy')
  function Fs(i, t, e) {
    let s = Y.opendirSync(i)
    try {
      let r
      for (; (r = s.readSync()) !== null; ) jo(r.name, i, t, e)
    } finally {
      s.closeSync()
    }
  }
  o(Fs, 'copyDir')
  function jo(i, t, e, s) {
    let r = ie.join(t, i),
      n = ie.join(e, i)
    if (s.filter && !s.filter(r, n)) return
    let { destStat: a } = se.checkPathsSync(r, n, 'copy', s)
    return xs(a, r, n, s)
  }
  o(jo, 'copyDirItem')
  function Io(i, t, e, s) {
    let r = Y.readlinkSync(t)
    if ((s.dereference && (r = ie.resolve(process.cwd(), r)), i)) {
      let n
      try {
        n = Y.readlinkSync(e)
      } catch (a) {
        if (a.code === 'EINVAL' || a.code === 'UNKNOWN') return Y.symlinkSync(r, e)
        throw a
      }
      if ((s.dereference && (n = ie.resolve(process.cwd(), n)), se.isSrcSubdir(r, n)))
        throw new Error(`Cannot copy '${r}' to a subdirectory of itself, '${n}'.`)
      if (se.isSrcSubdir(n, r)) throw new Error(`Cannot overwrite '${n}' with '${r}'.`)
      return qo(r, e)
    } else return Y.symlinkSync(r, e)
  }
  o(Io, 'onLink')
  function qo(i, t) {
    return (Y.unlinkSync(t), Y.symlinkSync(i, t))
  }
  o(qo, 'copyLink')
  Os.exports = Do
})
var De = x((rl, Ts) => {
  'use strict'
  var $o = _().fromPromise
  Ts.exports = { copy: $o(vs()), copySync: Cs() }
})
var re = x((nl, Ps) => {
  'use strict'
  var Ds = Mt(),
    Bo = _().fromCallback
  function zo(i, t) {
    Ds.rm(i, { recursive: !0, force: !0 }, t)
  }
  o(zo, 'remove')
  function Uo(i) {
    Ds.rmSync(i, { recursive: !0, force: !0 })
  }
  o(Uo, 'removeSync')
  Ps.exports = { remove: Bo(zo), removeSync: Uo }
})
var js = x((al, Ws) => {
  'use strict'
  var Go = _().fromPromise,
    As = K(),
    _s = require('path'),
    Ms = ot(),
    Ls = re(),
    Rs = Go(
      o(async function (t) {
        let e
        try {
          e = await As.readdir(t)
        } catch {
          return Ms.mkdirs(t)
        }
        return Promise.all(e.map((s) => Ls.remove(_s.join(t, s))))
      }, 'emptyDir'),
    )
  function Ns(i) {
    let t
    try {
      t = As.readdirSync(i)
    } catch {
      return Ms.mkdirsSync(i)
    }
    t.forEach((e) => {
      ;((e = _s.join(i, e)), Ls.removeSync(e))
    })
  }
  o(Ns, 'emptyDirSync')
  Ws.exports = { emptyDirSync: Ns, emptydirSync: Ns, emptyDir: Rs, emptydir: Rs }
})
var Bs = x((cl, $s) => {
  'use strict'
  var Jo = _().fromPromise,
    Is = require('path'),
    wt = K(),
    qs = ot()
  async function Ho(i) {
    let t
    try {
      t = await wt.stat(i)
    } catch {}
    if (t && t.isFile()) return
    let e = Is.dirname(i),
      s = null
    try {
      s = await wt.stat(e)
    } catch (r) {
      if (r.code === 'ENOENT') {
        ;(await qs.mkdirs(e), await wt.writeFile(i, ''))
        return
      } else throw r
    }
    s.isDirectory() ? await wt.writeFile(i, '') : await wt.readdir(e)
  }
  o(Ho, 'createFile')
  function Vo(i) {
    let t
    try {
      t = wt.statSync(i)
    } catch {}
    if (t && t.isFile()) return
    let e = Is.dirname(i)
    try {
      wt.statSync(e).isDirectory() || wt.readdirSync(e)
    } catch (s) {
      if (s && s.code === 'ENOENT') qs.mkdirsSync(e)
      else throw s
    }
    wt.writeFileSync(i, '')
  }
  o(Vo, 'createFileSync')
  $s.exports = { createFile: Jo(Ho), createFileSync: Vo }
})
var Hs = x((ul, Js) => {
  'use strict'
  var Ko = _().fromPromise,
    zs = require('path'),
    xt = K(),
    Us = ot(),
    { pathExists: Yo } = vt(),
    { areIdentical: Gs } = Pt()
  async function Xo(i, t) {
    let e
    try {
      e = await xt.lstat(t)
    } catch {}
    let s
    try {
      s = await xt.lstat(i)
    } catch (a) {
      throw ((a.message = a.message.replace('lstat', 'ensureLink')), a)
    }
    if (e && Gs(s, e)) return
    let r = zs.dirname(t)
    ;((await Yo(r)) || (await Us.mkdirs(r)), await xt.link(i, t))
  }
  o(Xo, 'createLink')
  function Qo(i, t) {
    let e
    try {
      e = xt.lstatSync(t)
    } catch {}
    try {
      let n = xt.lstatSync(i)
      if (e && Gs(n, e)) return
    } catch (n) {
      throw ((n.message = n.message.replace('lstat', 'ensureLink')), n)
    }
    let s = zs.dirname(t)
    return (xt.existsSync(s) || Us.mkdirsSync(s), xt.linkSync(i, t))
  }
  o(Qo, 'createLinkSync')
  Js.exports = { createLink: Ko(Xo), createLinkSync: Qo }
})
var Ks = x((dl, Vs) => {
  'use strict'
  var kt = require('path'),
    ne = K(),
    { pathExists: Zo } = vt(),
    ta = _().fromPromise
  async function ea(i, t) {
    if (kt.isAbsolute(i)) {
      try {
        await ne.lstat(i)
      } catch (n) {
        throw ((n.message = n.message.replace('lstat', 'ensureSymlink')), n)
      }
      return { toCwd: i, toDst: i }
    }
    let e = kt.dirname(t),
      s = kt.join(e, i)
    if (await Zo(s)) return { toCwd: s, toDst: i }
    try {
      await ne.lstat(i)
    } catch (n) {
      throw ((n.message = n.message.replace('lstat', 'ensureSymlink')), n)
    }
    return { toCwd: i, toDst: kt.relative(e, i) }
  }
  o(ea, 'symlinkPaths')
  function ia(i, t) {
    if (kt.isAbsolute(i)) {
      if (!ne.existsSync(i)) throw new Error('absolute srcpath does not exist')
      return { toCwd: i, toDst: i }
    }
    let e = kt.dirname(t),
      s = kt.join(e, i)
    if (ne.existsSync(s)) return { toCwd: s, toDst: i }
    if (!ne.existsSync(i)) throw new Error('relative srcpath does not exist')
    return { toCwd: i, toDst: kt.relative(e, i) }
  }
  o(ia, 'symlinkPathsSync')
  Vs.exports = { symlinkPaths: ta(ea), symlinkPathsSync: ia }
})
var Qs = x((ml, Xs) => {
  'use strict'
  var Ys = K(),
    sa = _().fromPromise
  async function ra(i, t) {
    if (t) return t
    let e
    try {
      e = await Ys.lstat(i)
    } catch {
      return 'file'
    }
    return e && e.isDirectory() ? 'dir' : 'file'
  }
  o(ra, 'symlinkType')
  function na(i, t) {
    if (t) return t
    let e
    try {
      e = Ys.lstatSync(i)
    } catch {
      return 'file'
    }
    return e && e.isDirectory() ? 'dir' : 'file'
  }
  o(na, 'symlinkTypeSync')
  Xs.exports = { symlinkType: sa(ra), symlinkTypeSync: na }
})
var ir = x((yl, er) => {
  'use strict'
  var oa = _().fromPromise,
    Zs = require('path'),
    ut = K(),
    { mkdirs: aa, mkdirsSync: ha } = ot(),
    { symlinkPaths: ca, symlinkPathsSync: la } = Ks(),
    { symlinkType: ua, symlinkTypeSync: fa } = Qs(),
    { pathExists: da } = vt(),
    { areIdentical: tr } = Pt()
  async function pa(i, t, e) {
    let s
    try {
      s = await ut.lstat(t)
    } catch {}
    if (s && s.isSymbolicLink()) {
      let [h, c] = await Promise.all([ut.stat(i), ut.stat(t)])
      if (tr(h, c)) return
    }
    let r = await ca(i, t)
    i = r.toDst
    let n = await ua(r.toCwd, e),
      a = Zs.dirname(t)
    return ((await da(a)) || (await aa(a)), ut.symlink(i, t, n))
  }
  o(pa, 'createSymlink')
  function ma(i, t, e) {
    let s
    try {
      s = ut.lstatSync(t)
    } catch {}
    if (s && s.isSymbolicLink()) {
      let h = ut.statSync(i),
        c = ut.statSync(t)
      if (tr(h, c)) return
    }
    let r = la(i, t)
    ;((i = r.toDst), (e = fa(r.toCwd, e)))
    let n = Zs.dirname(t)
    return (ut.existsSync(n) || ha(n), ut.symlinkSync(i, t, e))
  }
  o(ma, 'createSymlinkSync')
  er.exports = { createSymlink: oa(pa), createSymlinkSync: ma }
})
var lr = x((Sl, cr) => {
  'use strict'
  var { createFile: sr, createFileSync: rr } = Bs(),
    { createLink: nr, createLinkSync: or } = Hs(),
    { createSymlink: ar, createSymlinkSync: hr } = ir()
  cr.exports = {
    createFile: sr,
    createFileSync: rr,
    ensureFile: sr,
    ensureFileSync: rr,
    createLink: nr,
    createLinkSync: or,
    ensureLink: nr,
    ensureLinkSync: or,
    createSymlink: ar,
    createSymlinkSync: hr,
    ensureSymlink: ar,
    ensureSymlinkSync: hr,
  }
})
var Pe = x((bl, ur) => {
  'use strict'
  function wa(
    i,
    {
      EOL: t = `
`,
      finalEOL: e = !0,
      replacer: s = null,
      spaces: r,
    } = {},
  ) {
    let n = e ? t : ''
    return JSON.stringify(i, s, r).replace(/\n/g, t) + n
  }
  o(wa, 'stringify')
  function ya(i) {
    return (Buffer.isBuffer(i) && (i = i.toString('utf8')), i.replace(/^\uFEFF/, ''))
  }
  o(ya, 'stripBom')
  ur.exports = { stringify: wa, stripBom: ya }
})
var mr = x((vl, pr) => {
  'use strict'
  var jt
  try {
    jt = Mt()
  } catch {
    jt = require('fs')
  }
  var Re = _(),
    { stringify: fr, stripBom: dr } = Pe()
  async function ga(i, t = {}) {
    typeof t == 'string' && (t = { encoding: t })
    let e = t.fs || jt,
      s = 'throws' in t ? t.throws : !0,
      r = await Re.fromCallback(e.readFile)(i, t)
    r = dr(r)
    let n
    try {
      n = JSON.parse(r, t ? t.reviver : null)
    } catch (a) {
      if (s) throw ((a.message = `${i}: ${a.message}`), a)
      return null
    }
    return n
  }
  o(ga, '_readFile')
  var Sa = Re.fromPromise(ga)
  function ba(i, t = {}) {
    typeof t == 'string' && (t = { encoding: t })
    let e = t.fs || jt,
      s = 'throws' in t ? t.throws : !0
    try {
      let r = e.readFileSync(i, t)
      return ((r = dr(r)), JSON.parse(r, t.reviver))
    } catch (r) {
      if (s) throw ((r.message = `${i}: ${r.message}`), r)
      return null
    }
  }
  o(ba, 'readFileSync')
  async function Ea(i, t, e = {}) {
    let s = e.fs || jt,
      r = fr(t, e)
    await Re.fromCallback(s.writeFile)(i, r, e)
  }
  o(Ea, '_writeFile')
  var va = Re.fromPromise(Ea)
  function xa(i, t, e = {}) {
    let s = e.fs || jt,
      r = fr(t, e)
    return s.writeFileSync(i, r, e)
  }
  o(xa, 'writeFileSync')
  var ka = { readFile: Sa, readFileSync: ba, writeFile: va, writeFileSync: xa }
  pr.exports = ka
})
var yr = x((kl, wr) => {
  'use strict'
  var Ne = mr()
  wr.exports = {
    readJson: Ne.readFile,
    readJsonSync: Ne.readFileSync,
    writeJson: Ne.writeFile,
    writeJsonSync: Ne.writeFileSync,
  }
})
var Ae = x((Fl, br) => {
  'use strict'
  var Fa = _().fromPromise,
    pi = K(),
    gr = require('path'),
    Sr = ot(),
    Oa = vt().pathExists
  async function Ca(i, t, e = 'utf-8') {
    let s = gr.dirname(i)
    return ((await Oa(s)) || (await Sr.mkdirs(s)), pi.writeFile(i, t, e))
  }
  o(Ca, 'outputFile')
  function Ta(i, ...t) {
    let e = gr.dirname(i)
    ;(pi.existsSync(e) || Sr.mkdirsSync(e), pi.writeFileSync(i, ...t))
  }
  o(Ta, 'outputFileSync')
  br.exports = { outputFile: Fa(Ca), outputFileSync: Ta }
})
var vr = x((Cl, Er) => {
  'use strict'
  var { stringify: Da } = Pe(),
    { outputFile: Pa } = Ae()
  async function Ra(i, t, e = {}) {
    let s = Da(t, e)
    await Pa(i, s, e)
  }
  o(Ra, 'outputJson')
  Er.exports = Ra
})
var kr = x((Dl, xr) => {
  'use strict'
  var { stringify: Na } = Pe(),
    { outputFileSync: Aa } = Ae()
  function _a(i, t, e) {
    let s = Na(t, e)
    Aa(i, s, e)
  }
  o(_a, 'outputJsonSync')
  xr.exports = _a
})
var Or = x((Rl, Fr) => {
  'use strict'
  var Ma = _().fromPromise,
    X = yr()
  X.outputJson = Ma(vr())
  X.outputJsonSync = kr()
  X.outputJSON = X.outputJson
  X.outputJSONSync = X.outputJsonSync
  X.writeJSON = X.writeJson
  X.writeJSONSync = X.writeJsonSync
  X.readJSON = X.readJson
  X.readJSONSync = X.readJsonSync
  Fr.exports = X
})
var Rr = x((Nl, Pr) => {
  'use strict'
  var La = K(),
    Cr = require('path'),
    { copy: Wa } = De(),
    { remove: Dr } = re(),
    { mkdirp: ja } = ot(),
    { pathExists: Ia } = vt(),
    Tr = Pt()
  async function qa(i, t, e = {}) {
    let s = e.overwrite || e.clobber || !1,
      { srcStat: r, isChangingCase: n = !1 } = await Tr.checkPaths(i, t, 'move', e)
    await Tr.checkParentPaths(i, r, t, 'move')
    let a = Cr.dirname(t)
    return (Cr.parse(a).root !== a && (await ja(a)), $a(i, t, s, n))
  }
  o(qa, 'move')
  async function $a(i, t, e, s) {
    if (!s) {
      if (e) await Dr(t)
      else if (await Ia(t)) throw new Error('dest already exists.')
    }
    try {
      await La.rename(i, t)
    } catch (r) {
      if (r.code !== 'EXDEV') throw r
      await Ba(i, t, e)
    }
  }
  o($a, 'doRename')
  async function Ba(i, t, e) {
    return (await Wa(i, t, { overwrite: e, errorOnExist: !0, preserveTimestamps: !0 }), Dr(i))
  }
  o(Ba, 'moveAcrossDevice')
  Pr.exports = qa
})
var Lr = x((_l, Mr) => {
  'use strict'
  var Ar = Mt(),
    wi = require('path'),
    za = De().copySync,
    _r = re().removeSync,
    Ua = ot().mkdirpSync,
    Nr = Pt()
  function Ga(i, t, e) {
    e = e || {}
    let s = e.overwrite || e.clobber || !1,
      { srcStat: r, isChangingCase: n = !1 } = Nr.checkPathsSync(i, t, 'move', e)
    return (Nr.checkParentPathsSync(i, r, t, 'move'), Ja(t) || Ua(wi.dirname(t)), Ha(i, t, s, n))
  }
  o(Ga, 'moveSync')
  function Ja(i) {
    let t = wi.dirname(i)
    return wi.parse(t).root === t
  }
  o(Ja, 'isParentRoot')
  function Ha(i, t, e, s) {
    if (s) return mi(i, t, e)
    if (e) return (_r(t), mi(i, t, e))
    if (Ar.existsSync(t)) throw new Error('dest already exists.')
    return mi(i, t, e)
  }
  o(Ha, 'doRename')
  function mi(i, t, e) {
    try {
      Ar.renameSync(i, t)
    } catch (s) {
      if (s.code !== 'EXDEV') throw s
      return Va(i, t, e)
    }
  }
  o(mi, 'rename')
  function Va(i, t, e) {
    return (za(i, t, { overwrite: e, errorOnExist: !0, preserveTimestamps: !0 }), _r(i))
  }
  o(Va, 'moveAcrossDevice')
  Mr.exports = Ga
})
var jr = x((Ll, Wr) => {
  'use strict'
  var Ka = _().fromPromise
  Wr.exports = { move: Ka(Rr()), moveSync: Lr() }
})
var yi = x((Wl, Ir) => {
  'use strict'
  Ir.exports = { ...K(), ...De(), ...js(), ...lr(), ...Or(), ...ot(), ...jr(), ...Ae(), ...vt(), ...re() }
})
var Bi = x((Ln) => {
  'use strict'
  var ji = '2.0.1',
    An,
    ti,
    _n,
    qi,
    $i,
    Yt,
    xe,
    ve,
    Ii,
    Xt,
    H,
    Mn = [].slice,
    bc =
      [].indexOf ||
      function (i) {
        for (var t = 0, e = this.length; t < e; t++) if (t in this && this[t] === i) return t
        return -1
      },
    Ec = {}.hasOwnProperty
  xe = require('path')
  _n = o(function (i) {
    return typeof i == 'function'
  }, 'isFunction')
  qi = o(function (i) {
    return (
      typeof i == 'string' ||
      (!!i && typeof i == 'object' && Object.prototype.toString.call(i) === '[object String]')
    )
  }, 'isString')
  H = Ln
  H.VERSION = typeof ji < 'u' && ji !== null ? ji : 'NO-VERSION'
  Xt = o(function (i) {
    return ((i = i.replace(/\\/g, '/')), (i = i.replace(/(?<!^)\/+/g, '/')), i)
  }, 'toUnix')
  for (ve in xe)
    ((Ii = xe[ve]),
      _n(Ii)
        ? (H[ve] = (function (i) {
            return function () {
              var t, e
              return (
                (t = 1 <= arguments.length ? Mn.call(arguments, 0) : []),
                (t = t.map(function (s) {
                  return qi(s) ? Xt(s) : s
                })),
                (e = xe[i].apply(xe, t)),
                qi(e) ? Xt(e) : e
              )
            }
          })(ve))
        : (H[ve] = Ii))
  H.sep = '/'
  ti = {
    toUnix: Xt,
    normalizeSafe: o(function (i) {
      var t
      return (
        (i = Xt(i)),
        (t = H.normalize(i)),
        i.startsWith('./') && !t.startsWith('./') && !t.startsWith('..')
          ? (t = './' + t)
          : i.startsWith('//') && !t.startsWith('//') && (i.startsWith('//./') ? (t = '//.' + t) : (t = '/' + t)),
        t
      )
    }, 'normalizeSafe'),
    normalizeTrim: o(function (i) {
      return ((i = H.normalizeSafe(i)), i.endsWith('/') ? i.slice(0, +(i.length - 2) + 1 || 9e9) : i)
    }, 'normalizeTrim'),
    joinSafe: o(function () {
      var i, t, e
      return (
        (i = 1 <= arguments.length ? Mn.call(arguments, 0) : []),
        (e = H.join.apply(null, i)),
        i.length > 0 &&
          ((t = Xt(i[0])),
          t.startsWith('./') && !e.startsWith('./') && !e.startsWith('..')
            ? (e = './' + e)
            : t.startsWith('//') &&
              !e.startsWith('//') &&
              (t.startsWith('//./') ? (e = '//.' + e) : (e = '/' + e))),
        e
      )
    }, 'joinSafe'),
    addExt: o(function (i, t) {
      return t ? (t[0] !== '.' && (t = '.' + t), i + (i.endsWith(t) ? '' : t)) : i
    }, 'addExt'),
    trimExt: o(function (i, t, e) {
      var s
      return (
        e == null && (e = 7),
        (s = H.extname(i)),
        $i(s, t, e) ? i.slice(0, +(i.length - s.length - 1) + 1 || 9e9) : i
      )
    }, 'trimExt'),
    removeExt: o(function (i, t) {
      return t ? ((t = t[0] === '.' ? t : '.' + t), H.extname(i) === t ? H.trimExt(i, [], t.length) : i) : i
    }, 'removeExt'),
    changeExt: o(function (i, t, e, s) {
      return (s == null && (s = 7), H.trimExt(i, e, s) + (t ? (t[0] === '.' ? t : '.' + t) : ''))
    }, 'changeExt'),
    defaultExt: o(function (i, t, e, s) {
      var r
      return (s == null && (s = 7), (r = H.extname(i)), $i(r, e, s) ? i : H.addExt(i, t))
    }, 'defaultExt'),
  }
  $i = o(function (i, t, e) {
    return (
      t == null && (t = []),
      i &&
        i.length <= e &&
        bc.call(
          t.map(function (s) {
            return (s && s[0] !== '.' ? '.' : '') + s
          }),
          i,
        ) < 0
    )
  }, 'isValidExt')
  for (Yt in ti)
    if (Ec.call(ti, Yt)) {
      if (((An = ti[Yt]), H[Yt] !== void 0)) throw new Error('path.' + Yt + ' already exists.')
      H[Yt] = An
    }
})
var Pc = {}
Jn(Pc, { getWorkspaceDirpaths: () => Dc })
module.exports = Hn(Pc)
var qn = At(yi(), 1)
var gi = o((i, t, e) => {
    let s = i instanceof RegExp ? qr(i, e) : i,
      r = t instanceof RegExp ? qr(t, e) : t,
      n = s !== null && r != null && Ya(s, r, e)
    return (
      n && {
        start: n[0],
        end: n[1],
        pre: e.slice(0, n[0]),
        body: e.slice(n[0] + s.length, n[1]),
        post: e.slice(n[1] + r.length),
      }
    )
  }, 'balanced'),
  qr = o((i, t) => {
    let e = t.match(i)
    return e ? e[0] : null
  }, 'maybeMatch'),
  Ya = o((i, t, e) => {
    let s,
      r,
      n,
      a,
      h,
      c = e.indexOf(i),
      f = e.indexOf(t, c + 1),
      l = c
    if (c >= 0 && f > 0) {
      if (i === t) return [c, f]
      for (s = [], n = e.length; l >= 0 && !h; ) {
        if (l === c) (s.push(l), (c = e.indexOf(i, l + 1)))
        else if (s.length === 1) {
          let u = s.pop()
          u !== void 0 && (h = [u, f])
        } else ((r = s.pop()), r !== void 0 && r < n && ((n = r), (a = f)), (f = e.indexOf(t, l + 1)))
        l = c < f && c >= 0 ? c : f
      }
      s.length && a !== void 0 && (h = [n, a])
    }
    return h
  }, 'range')
var $r = '\0SLASH' + Math.random() + '\0',
  Br = '\0OPEN' + Math.random() + '\0',
  bi = '\0CLOSE' + Math.random() + '\0',
  zr = '\0COMMA' + Math.random() + '\0',
  Ur = '\0PERIOD' + Math.random() + '\0',
  Xa = new RegExp($r, 'g'),
  Qa = new RegExp(Br, 'g'),
  Za = new RegExp(bi, 'g'),
  th = new RegExp(zr, 'g'),
  eh = new RegExp(Ur, 'g'),
  ih = /\\\\/g,
  sh = /\\{/g,
  rh = /\\}/g,
  nh = /\\,/g,
  oh = /\\./g
function Si(i) {
  return isNaN(i) ? i.charCodeAt(0) : parseInt(i, 10)
}
o(Si, 'numeric')
function ah(i) {
  return i.replace(ih, $r).replace(sh, Br).replace(rh, bi).replace(nh, zr).replace(oh, Ur)
}
o(ah, 'escapeBraces')
function hh(i) {
  return i.replace(Xa, '\\').replace(Qa, '{').replace(Za, '}').replace(th, ',').replace(eh, '.')
}
o(hh, 'unescapeBraces')
function Gr(i) {
  if (!i) return ['']
  let t = [],
    e = gi('{', '}', i)
  if (!e) return i.split(',')
  let { pre: s, body: r, post: n } = e,
    a = s.split(',')
  a[a.length - 1] += '{' + r + '}'
  let h = Gr(n)
  return (n.length && ((a[a.length - 1] += h.shift()), a.push.apply(a, h)), t.push.apply(t, a), t)
}
o(Gr, 'parseCommaParts')
function Jr(i) {
  return i ? (i.slice(0, 2) === '{}' && (i = '\\{\\}' + i.slice(2)), oe(ah(i), !0).map(hh)) : []
}
o(Jr, 'expand')
function ch(i) {
  return '{' + i + '}'
}
o(ch, 'embrace')
function lh(i) {
  return /^-?0\d/.test(i)
}
o(lh, 'isPadded')
function uh(i, t) {
  return i <= t
}
o(uh, 'lte')
function fh(i, t) {
  return i >= t
}
o(fh, 'gte')
function oe(i, t) {
  let e = [],
    s = gi('{', '}', i)
  if (!s) return [i]
  let r = s.pre,
    n = s.post.length ? oe(s.post, !1) : ['']
  if (/\$$/.test(s.pre))
    for (let a = 0; a < n.length; a++) {
      let h = r + '{' + s.body + '}' + n[a]
      e.push(h)
    }
  else {
    let a = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(s.body),
      h = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(s.body),
      c = a || h,
      f = s.body.indexOf(',') >= 0
    if (!c && !f) return s.post.match(/,(?!,).*\}/) ? ((i = s.pre + '{' + s.body + bi + s.post), oe(i)) : [i]
    let l
    if (c) l = s.body.split(/\.\./)
    else if (((l = Gr(s.body)), l.length === 1 && l[0] !== void 0 && ((l = oe(l[0], !1).map(ch)), l.length === 1)))
      return n.map((p) => s.pre + l[0] + p)
    let u
    if (c && l[0] !== void 0 && l[1] !== void 0) {
      let p = Si(l[0]),
        d = Si(l[1]),
        w = Math.max(l[0].length, l[1].length),
        m = l.length === 3 && l[2] !== void 0 ? Math.abs(Si(l[2])) : 1,
        g = uh
      d < p && ((m *= -1), (g = fh))
      let v = l.some(lh)
      u = []
      for (let S = p; g(S, d); S += m) {
        let b
        if (h) ((b = String.fromCharCode(S)), b === '\\' && (b = ''))
        else if (((b = String(S)), v)) {
          let C = w - b.length
          if (C > 0) {
            let tt = new Array(C + 1).join('0')
            S < 0 ? (b = '-' + tt + b.slice(1)) : (b = tt + b)
          }
        }
        u.push(b)
      }
    } else {
      u = []
      for (let p = 0; p < l.length; p++) u.push.apply(u, oe(l[p], !1))
    }
    for (let p = 0; p < u.length; p++)
      for (let d = 0; d < n.length; d++) {
        let w = r + u[p] + n[d]
        ;(!t || c || w) && e.push(w)
      }
  }
  return e
}
o(oe, 'expand_')
var ae = o((i) => {
  if (typeof i != 'string') throw new TypeError('invalid pattern')
  if (i.length > 65536) throw new TypeError('pattern is too long')
}, 'assertValidPattern')
var dh = {
    '[:alnum:]': ['\\p{L}\\p{Nl}\\p{Nd}', !0],
    '[:alpha:]': ['\\p{L}\\p{Nl}', !0],
    '[:ascii:]': ['\\x00-\\x7f', !1],
    '[:blank:]': ['\\p{Zs}\\t', !0],
    '[:cntrl:]': ['\\p{Cc}', !0],
    '[:digit:]': ['\\p{Nd}', !0],
    '[:graph:]': ['\\p{Z}\\p{C}', !0, !0],
    '[:lower:]': ['\\p{Ll}', !0],
    '[:print:]': ['\\p{C}', !0],
    '[:punct:]': ['\\p{P}', !0],
    '[:space:]': ['\\p{Z}\\t\\r\\n\\v\\f', !0],
    '[:upper:]': ['\\p{Lu}', !0],
    '[:word:]': ['\\p{L}\\p{Nl}\\p{Nd}\\p{Pc}', !0],
    '[:xdigit:]': ['A-Fa-f0-9', !1],
  },
  he = o((i) => i.replace(/[[\]\\-]/g, '\\$&'), 'braceEscape'),
  ph = o((i) => i.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'regexpEscape'),
  Hr = o((i) => i.join(''), 'rangesToString'),
  Vr = o((i, t) => {
    let e = t
    if (i.charAt(e) !== '[') throw new Error('not in a brace expression')
    let s = [],
      r = [],
      n = e + 1,
      a = !1,
      h = !1,
      c = !1,
      f = !1,
      l = e,
      u = ''
    t: for (; n < i.length; ) {
      let m = i.charAt(n)
      if ((m === '!' || m === '^') && n === e + 1) {
        ;((f = !0), n++)
        continue
      }
      if (m === ']' && a && !c) {
        l = n + 1
        break
      }
      if (((a = !0), m === '\\' && !c)) {
        ;((c = !0), n++)
        continue
      }
      if (m === '[' && !c) {
        for (let [g, [y, v, S]] of Object.entries(dh))
          if (i.startsWith(g, n)) {
            if (u) return ['$.', !1, i.length - e, !0]
            ;((n += g.length), S ? r.push(y) : s.push(y), (h = h || v))
            continue t
          }
      }
      if (((c = !1), u)) {
        ;(m > u ? s.push(he(u) + '-' + he(m)) : m === u && s.push(he(m)), (u = ''), n++)
        continue
      }
      if (i.startsWith('-]', n + 1)) {
        ;(s.push(he(m + '-')), (n += 2))
        continue
      }
      if (i.startsWith('-', n + 1)) {
        ;((u = m), (n += 2))
        continue
      }
      ;(s.push(he(m)), n++)
    }
    if (l < n) return ['', !1, 0, !1]
    if (!s.length && !r.length) return ['$.', !1, i.length - e, !0]
    if (r.length === 0 && s.length === 1 && /^\\?.$/.test(s[0]) && !f) {
      let m = s[0].length === 2 ? s[0].slice(-1) : s[0]
      return [ph(m), !1, l - e, !1]
    }
    let p = '[' + (f ? '^' : '') + Hr(s) + ']',
      d = '[' + (f ? '' : '^') + Hr(r) + ']'
    return [s.length && r.length ? '(' + p + '|' + d + ')' : s.length ? p : d, h, l - e, !0]
  }, 'parseClass')
var at = o(
  (i, { windowsPathsNoEscape: t = !1 } = {}) =>
    t
      ? i.replace(/\[([^\/\\])\]/g, '$1')
      : i.replace(/((?!\\).|^)\[([^\/\\])\]/g, '$1$2').replace(/\\([^\/])/g, '$1'),
  'unescape',
)
var mh = new Set(['!', '?', '+', '*', '@']),
  Kr = o((i) => mh.has(i), 'isExtglobType'),
  wh = '(?!(?:^|/)\\.\\.?(?:$|/))',
  _e = '(?!\\.)',
  yh = new Set(['[', '.']),
  gh = new Set(['..', '.']),
  Sh = new Set('().*{}+?[]^$\\!'),
  bh = o((i) => i.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'regExpEscape'),
  Ei = '[^/]',
  Yr = Ei + '*?',
  Xr = Ei + '+?',
  It = class i {
    static {
      o(this, 'AST')
    }
    type
    #t
    #e
    #n = !1
    #r = []
    #o
    #b
    #y
    #a = !1
    #u
    #h
    #c = !1
    constructor(t, e, s = {}) {
      ;((this.type = t),
        t && (this.#e = !0),
        (this.#o = e),
        (this.#t = this.#o ? this.#o.#t : this),
        (this.#u = this.#t === this ? s : this.#t.#u),
        (this.#y = this.#t === this ? [] : this.#t.#y),
        t === '!' && !this.#t.#a && this.#y.push(this),
        (this.#b = this.#o ? this.#o.#r.length : 0))
    }
    get hasMagic() {
      if (this.#e !== void 0) return this.#e
      for (let t of this.#r) if (typeof t != 'string' && (t.type || t.hasMagic)) return (this.#e = !0)
      return this.#e
    }
    toString() {
      return this.#h !== void 0
        ? this.#h
        : this.type
          ? (this.#h = this.type + '(' + this.#r.map((t) => String(t)).join('|') + ')')
          : (this.#h = this.#r.map((t) => String(t)).join(''))
    }
    #i() {
      if (this !== this.#t) throw new Error('should only call on root')
      if (this.#a) return this
      ;(this.toString(), (this.#a = !0))
      let t
      for (; (t = this.#y.pop()); ) {
        if (t.type !== '!') continue
        let e = t,
          s = e.#o
        for (; s; ) {
          for (let r = e.#b + 1; !s.type && r < s.#r.length; r++)
            for (let n of t.#r) {
              if (typeof n == 'string') throw new Error('string part in extglob AST??')
              n.copyIn(s.#r[r])
            }
          ;((e = s), (s = e.#o))
        }
      }
      return this
    }
    push(...t) {
      for (let e of t)
        if (e !== '') {
          if (typeof e != 'string' && !(e instanceof i && e.#o === this)) throw new Error('invalid part: ' + e)
          this.#r.push(e)
        }
    }
    toJSON() {
      let t =
        this.type === null
          ? this.#r.slice().map((e) => (typeof e == 'string' ? e : e.toJSON()))
          : [this.type, ...this.#r.map((e) => e.toJSON())]
      return (
        this.isStart() && !this.type && t.unshift([]),
        this.isEnd() && (this === this.#t || (this.#t.#a && this.#o?.type === '!')) && t.push({}),
        t
      )
    }
    isStart() {
      if (this.#t === this) return !0
      if (!this.#o?.isStart()) return !1
      if (this.#b === 0) return !0
      let t = this.#o
      for (let e = 0; e < this.#b; e++) {
        let s = t.#r[e]
        if (!(s instanceof i && s.type === '!')) return !1
      }
      return !0
    }
    isEnd() {
      if (this.#t === this || this.#o?.type === '!') return !0
      if (!this.#o?.isEnd()) return !1
      if (!this.type) return this.#o?.isEnd()
      let t = this.#o ? this.#o.#r.length : 0
      return this.#b === t - 1
    }
    copyIn(t) {
      typeof t == 'string' ? this.push(t) : this.push(t.clone(this))
    }
    clone(t) {
      let e = new i(this.type, t)
      for (let s of this.#r) e.copyIn(s)
      return e
    }
    static #f(t, e, s, r) {
      let n = !1,
        a = !1,
        h = -1,
        c = !1
      if (e.type === null) {
        let d = s,
          w = ''
        for (; d < t.length; ) {
          let m = t.charAt(d++)
          if (n || m === '\\') {
            ;((n = !n), (w += m))
            continue
          }
          if (a) {
            ;(d === h + 1 ? (m === '^' || m === '!') && (c = !0) : m === ']' && !(d === h + 2 && c) && (a = !1),
              (w += m))
            continue
          } else if (m === '[') {
            ;((a = !0), (h = d), (c = !1), (w += m))
            continue
          }
          if (!r.noext && Kr(m) && t.charAt(d) === '(') {
            ;(e.push(w), (w = ''))
            let g = new i(m, e)
            ;((d = i.#f(t, g, d, r)), e.push(g))
            continue
          }
          w += m
        }
        return (e.push(w), d)
      }
      let f = s + 1,
        l = new i(null, e),
        u = [],
        p = ''
      for (; f < t.length; ) {
        let d = t.charAt(f++)
        if (n || d === '\\') {
          ;((n = !n), (p += d))
          continue
        }
        if (a) {
          ;(f === h + 1 ? (d === '^' || d === '!') && (c = !0) : d === ']' && !(f === h + 2 && c) && (a = !1),
            (p += d))
          continue
        } else if (d === '[') {
          ;((a = !0), (h = f), (c = !1), (p += d))
          continue
        }
        if (Kr(d) && t.charAt(f) === '(') {
          ;(l.push(p), (p = ''))
          let w = new i(d, l)
          ;(l.push(w), (f = i.#f(t, w, f, r)))
          continue
        }
        if (d === '|') {
          ;(l.push(p), (p = ''), u.push(l), (l = new i(null, e)))
          continue
        }
        if (d === ')')
          return (p === '' && e.#r.length === 0 && (e.#c = !0), l.push(p), (p = ''), e.push(...u, l), f)
        p += d
      }
      return ((e.type = null), (e.#e = void 0), (e.#r = [t.substring(s - 1)]), f)
    }
    static fromGlob(t, e = {}) {
      let s = new i(null, void 0, e)
      return (i.#f(t, s, 0, e), s)
    }
    toMMPattern() {
      if (this !== this.#t) return this.#t.toMMPattern()
      let t = this.toString(),
        [e, s, r, n] = this.toRegExpSource()
      if (!(r || this.#e || (this.#u.nocase && !this.#u.nocaseMagicOnly && t.toUpperCase() !== t.toLowerCase())))
        return s
      let h = (this.#u.nocase ? 'i' : '') + (n ? 'u' : '')
      return Object.assign(new RegExp(`^${e}$`, h), { _src: e, _glob: t })
    }
    get options() {
      return this.#u
    }
    toRegExpSource(t) {
      let e = t ?? !!this.#u.dot
      if ((this.#t === this && this.#i(), !this.type)) {
        let c = this.isStart() && this.isEnd(),
          f = this.#r
            .map((d) => {
              let [w, m, g, y] = typeof d == 'string' ? i.#p(d, this.#e, c) : d.toRegExpSource(t)
              return ((this.#e = this.#e || g), (this.#n = this.#n || y), w)
            })
            .join(''),
          l = ''
        if (this.isStart() && typeof this.#r[0] == 'string' && !(this.#r.length === 1 && gh.has(this.#r[0]))) {
          let w = yh,
            m =
              (e && w.has(f.charAt(0))) ||
              (f.startsWith('\\.') && w.has(f.charAt(2))) ||
              (f.startsWith('\\.\\.') && w.has(f.charAt(4))),
            g = !e && !t && w.has(f.charAt(0))
          l = m ? wh : g ? _e : ''
        }
        let u = ''
        return (
          this.isEnd() && this.#t.#a && this.#o?.type === '!' && (u = '(?:$|\\/)'),
          [l + f + u, at(f), (this.#e = !!this.#e), this.#n]
        )
      }
      let s = this.type === '*' || this.type === '+',
        r = this.type === '!' ? '(?:(?!(?:' : '(?:',
        n = this.#g(e)
      if (this.isStart() && this.isEnd() && !n && this.type !== '!') {
        let c = this.toString()
        return ((this.#r = [c]), (this.type = null), (this.#e = void 0), [c, at(this.toString()), !1, !1])
      }
      let a = !s || t || e || !_e ? '' : this.#g(!0)
      ;(a === n && (a = ''), a && (n = `(?:${n})(?:${a})*?`))
      let h = ''
      if (this.type === '!' && this.#c) h = (this.isStart() && !e ? _e : '') + Xr
      else {
        let c =
          this.type === '!'
            ? '))' + (this.isStart() && !e && !t ? _e : '') + Yr + ')'
            : this.type === '@'
              ? ')'
              : this.type === '?'
                ? ')?'
                : this.type === '+' && a
                  ? ')'
                  : this.type === '*' && a
                    ? ')?'
                    : `)${this.type}`
        h = r + n + c
      }
      return [h, at(n), (this.#e = !!this.#e), this.#n]
    }
    #g(t) {
      return this.#r
        .map((e) => {
          if (typeof e == 'string') throw new Error('string type in extglob ast??')
          let [s, r, n, a] = e.toRegExpSource(t)
          return ((this.#n = this.#n || a), s)
        })
        .filter((e) => !(this.isStart() && this.isEnd()) || !!e)
        .join('|')
    }
    static #p(t, e, s = !1) {
      let r = !1,
        n = '',
        a = !1
      for (let h = 0; h < t.length; h++) {
        let c = t.charAt(h)
        if (r) {
          ;((r = !1), (n += (Sh.has(c) ? '\\' : '') + c))
          continue
        }
        if (c === '\\') {
          h === t.length - 1 ? (n += '\\\\') : (r = !0)
          continue
        }
        if (c === '[') {
          let [f, l, u, p] = Vr(t, h)
          if (u) {
            ;((n += f), (a = a || l), (h += u - 1), (e = e || p))
            continue
          }
        }
        if (c === '*') {
          ;(s && t === '*' ? (n += Xr) : (n += Yr), (e = !0))
          continue
        }
        if (c === '?') {
          ;((n += Ei), (e = !0))
          continue
        }
        n += bh(c)
      }
      return [n, at(t), !!e, a]
    }
  }
var qt = o(
  (i, { windowsPathsNoEscape: t = !1 } = {}) =>
    t ? i.replace(/[?*()[\]]/g, '[$&]') : i.replace(/[?*()[\]\\]/g, '\\$&'),
  'escape',
)
var Q = o(
    (i, t, e = {}) => (ae(t), !e.nocomment && t.charAt(0) === '#' ? !1 : new et(t, e).match(i)),
    'minimatch',
  ),
  Eh = /^\*+([^+@!?\*\[\(]*)$/,
  vh = o((i) => (t) => !t.startsWith('.') && t.endsWith(i), 'starDotExtTest'),
  xh = o((i) => (t) => t.endsWith(i), 'starDotExtTestDot'),
  kh = o(
    (i) => ((i = i.toLowerCase()), (t) => !t.startsWith('.') && t.toLowerCase().endsWith(i)),
    'starDotExtTestNocase',
  ),
  Fh = o((i) => ((i = i.toLowerCase()), (t) => t.toLowerCase().endsWith(i)), 'starDotExtTestNocaseDot'),
  Oh = /^\*+\.\*+$/,
  Ch = o((i) => !i.startsWith('.') && i.includes('.'), 'starDotStarTest'),
  Th = o((i) => i !== '.' && i !== '..' && i.includes('.'), 'starDotStarTestDot'),
  Dh = /^\.\*+$/,
  Ph = o((i) => i !== '.' && i !== '..' && i.startsWith('.'), 'dotStarTest'),
  Rh = /^\*+$/,
  Nh = o((i) => i.length !== 0 && !i.startsWith('.'), 'starTest'),
  Ah = o((i) => i.length !== 0 && i !== '.' && i !== '..', 'starTestDot'),
  _h = /^\?+([^+@!?\*\[\(]*)?$/,
  Mh = o(([i, t = '']) => {
    let e = tn([i])
    return t ? ((t = t.toLowerCase()), (s) => e(s) && s.toLowerCase().endsWith(t)) : e
  }, 'qmarksTestNocase'),
  Lh = o(([i, t = '']) => {
    let e = en([i])
    return t ? ((t = t.toLowerCase()), (s) => e(s) && s.toLowerCase().endsWith(t)) : e
  }, 'qmarksTestNocaseDot'),
  Wh = o(([i, t = '']) => {
    let e = en([i])
    return t ? (s) => e(s) && s.endsWith(t) : e
  }, 'qmarksTestDot'),
  jh = o(([i, t = '']) => {
    let e = tn([i])
    return t ? (s) => e(s) && s.endsWith(t) : e
  }, 'qmarksTest'),
  tn = o(([i]) => {
    let t = i.length
    return (e) => e.length === t && !e.startsWith('.')
  }, 'qmarksTestNoExt'),
  en = o(([i]) => {
    let t = i.length
    return (e) => e.length === t && e !== '.' && e !== '..'
  }, 'qmarksTestNoExtDot'),
  sn =
    typeof process == 'object' && process
      ? (typeof process.env == 'object' && process.env && process.env.__MINIMATCH_TESTING_PLATFORM__) ||
        process.platform
      : 'posix',
  Qr = { win32: { sep: '\\' }, posix: { sep: '/' } },
  Ih = sn === 'win32' ? Qr.win32.sep : Qr.posix.sep
Q.sep = Ih
var z = Symbol('globstar **')
Q.GLOBSTAR = z
var qh = '[^/]',
  $h = qh + '*?',
  Bh = '(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?',
  zh = '(?:(?!(?:\\/|^)\\.).)*?',
  Uh = o(
    (i, t = {}) =>
      (e) =>
        Q(e, i, t),
    'filter',
  )
Q.filter = Uh
var st = o((i, t = {}) => Object.assign({}, i, t), 'ext'),
  Gh = o((i) => {
    if (!i || typeof i != 'object' || !Object.keys(i).length) return Q
    let t = Q
    return Object.assign(
      o((s, r, n = {}) => t(s, r, st(i, n)), 'm'),
      {
        Minimatch: class extends t.Minimatch {
          static {
            o(this, 'Minimatch')
          }
          constructor(r, n = {}) {
            super(r, st(i, n))
          }
          static defaults(r) {
            return t.defaults(st(i, r)).Minimatch
          }
        },
        AST: class extends t.AST {
          static {
            o(this, 'AST')
          }
          constructor(r, n, a = {}) {
            super(r, n, st(i, a))
          }
          static fromGlob(r, n = {}) {
            return t.AST.fromGlob(r, st(i, n))
          }
        },
        unescape: o((s, r = {}) => t.unescape(s, st(i, r)), 'unescape'),
        escape: o((s, r = {}) => t.escape(s, st(i, r)), 'escape'),
        filter: o((s, r = {}) => t.filter(s, st(i, r)), 'filter'),
        defaults: o((s) => t.defaults(st(i, s)), 'defaults'),
        makeRe: o((s, r = {}) => t.makeRe(s, st(i, r)), 'makeRe'),
        braceExpand: o((s, r = {}) => t.braceExpand(s, st(i, r)), 'braceExpand'),
        match: o((s, r, n = {}) => t.match(s, r, st(i, n)), 'match'),
        sep: t.sep,
        GLOBSTAR: z,
      },
    )
  }, 'defaults')
Q.defaults = Gh
var rn = o((i, t = {}) => (ae(i), t.nobrace || !/\{(?:(?!\{).)*\}/.test(i) ? [i] : Jr(i)), 'braceExpand')
Q.braceExpand = rn
var Jh = o((i, t = {}) => new et(i, t).makeRe(), 'makeRe')
Q.makeRe = Jh
var Hh = o((i, t, e = {}) => {
  let s = new et(t, e)
  return ((i = i.filter((r) => s.match(r))), s.options.nonull && !i.length && i.push(t), i)
}, 'match')
Q.match = Hh
var Zr = /[?*]|[+@!]\(.*?\)|\[|\]/,
  Vh = o((i) => i.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'regExpEscape'),
  et = class {
    static {
      o(this, 'Minimatch')
    }
    options
    set;
    pattern
    windowsPathsNoEscape
    nonegate
    negate
    comment
    empty
    preserveMultipleSlashes
    partial
    globSet
    globParts
    nocase
    isWindows
    platform
    windowsNoMagicRoot
    regexp
    constructor(t, e = {}) {
      ;(ae(t),
        (e = e || {}),
        (this.options = e),
        (this.pattern = t),
        (this.platform = e.platform || sn),
        (this.isWindows = this.platform === 'win32'),
        (this.windowsPathsNoEscape = !!e.windowsPathsNoEscape || e.allowWindowsEscape === !1),
        this.windowsPathsNoEscape && (this.pattern = this.pattern.replace(/\\/g, '/')),
        (this.preserveMultipleSlashes = !!e.preserveMultipleSlashes),
        (this.regexp = null),
        (this.negate = !1),
        (this.nonegate = !!e.nonegate),
        (this.comment = !1),
        (this.empty = !1),
        (this.partial = !!e.partial),
        (this.nocase = !!this.options.nocase),
        (this.windowsNoMagicRoot =
          e.windowsNoMagicRoot !== void 0 ? e.windowsNoMagicRoot : !!(this.isWindows && this.nocase)),
        (this.globSet = []),
        (this.globParts = []),
        (this.set = []),
        this.make())
    }
    hasMagic() {
      if (this.options.magicalBraces && this.set.length > 1) return !0
      for (let t of this.set) for (let e of t) if (typeof e != 'string') return !0
      return !1
    }
    debug(...t) {}
    make() {
      let t = this.pattern,
        e = this.options
      if (!e.nocomment && t.charAt(0) === '#') {
        this.comment = !0
        return
      }
      if (!t) {
        this.empty = !0
        return
      }
      ;(this.parseNegate(),
        (this.globSet = [...new Set(this.braceExpand())]),
        e.debug && (this.debug = (...n) => console.error(...n)),
        this.debug(this.pattern, this.globSet))
      let s = this.globSet.map((n) => this.slashSplit(n))
      ;((this.globParts = this.preprocess(s)), this.debug(this.pattern, this.globParts))
      let r = this.globParts.map((n, a, h) => {
        if (this.isWindows && this.windowsNoMagicRoot) {
          let c = n[0] === '' && n[1] === '' && (n[2] === '?' || !Zr.test(n[2])) && !Zr.test(n[3]),
            f = /^[a-z]:/i.test(n[0])
          if (c) return [...n.slice(0, 4), ...n.slice(4).map((l) => this.parse(l))]
          if (f) return [n[0], ...n.slice(1).map((l) => this.parse(l))]
        }
        return n.map((c) => this.parse(c))
      })
      if ((this.debug(this.pattern, r), (this.set = r.filter((n) => n.indexOf(!1) === -1)), this.isWindows))
        for (let n = 0; n < this.set.length; n++) {
          let a = this.set[n]
          a[0] === '' &&
            a[1] === '' &&
            this.globParts[n][2] === '?' &&
            typeof a[3] == 'string' &&
            /^[a-z]:$/i.test(a[3]) &&
            (a[2] = '?')
        }
      this.debug(this.pattern, this.set)
    }
    preprocess(t) {
      if (this.options.noglobstar)
        for (let s = 0; s < t.length; s++)
          for (let r = 0; r < t[s].length; r++) t[s][r] === '**' && (t[s][r] = '*')
      let { optimizationLevel: e = 1 } = this.options
      return (
        e >= 2
          ? ((t = this.firstPhasePreProcess(t)), (t = this.secondPhasePreProcess(t)))
          : e >= 1
            ? (t = this.levelOneOptimize(t))
            : (t = this.adjascentGlobstarOptimize(t)),
        t
      )
    }
    adjascentGlobstarOptimize(t) {
      return t.map((e) => {
        let s = -1
        for (; (s = e.indexOf('**', s + 1)) !== -1; ) {
          let r = s
          for (; e[r + 1] === '**'; ) r++
          r !== s && e.splice(s, r - s)
        }
        return e
      })
    }
    levelOneOptimize(t) {
      return t.map(
        (e) => (
          (e = e.reduce((s, r) => {
            let n = s[s.length - 1]
            return r === '**' && n === '**'
              ? s
              : r === '..' && n && n !== '..' && n !== '.' && n !== '**'
                ? (s.pop(), s)
                : (s.push(r), s)
          }, [])),
          e.length === 0 ? [''] : e
        ),
      )
    }
    levelTwoFileOptimize(t) {
      Array.isArray(t) || (t = this.slashSplit(t))
      let e = !1
      do {
        if (((e = !1), !this.preserveMultipleSlashes)) {
          for (let r = 1; r < t.length - 1; r++) {
            let n = t[r]
            ;(r === 1 && n === '' && t[0] === '') || ((n === '.' || n === '') && ((e = !0), t.splice(r, 1), r--))
          }
          t[0] === '.' && t.length === 2 && (t[1] === '.' || t[1] === '') && ((e = !0), t.pop())
        }
        let s = 0
        for (; (s = t.indexOf('..', s + 1)) !== -1; ) {
          let r = t[s - 1]
          r && r !== '.' && r !== '..' && r !== '**' && ((e = !0), t.splice(s - 1, 2), (s -= 2))
        }
      } while (e)
      return t.length === 0 ? [''] : t
    }
    firstPhasePreProcess(t) {
      let e = !1
      do {
        e = !1
        for (let s of t) {
          let r = -1
          for (; (r = s.indexOf('**', r + 1)) !== -1; ) {
            let a = r
            for (; s[a + 1] === '**'; ) a++
            a > r && s.splice(r + 1, a - r)
            let h = s[r + 1],
              c = s[r + 2],
              f = s[r + 3]
            if (h !== '..' || !c || c === '.' || c === '..' || !f || f === '.' || f === '..') continue
            ;((e = !0), s.splice(r, 1))
            let l = s.slice(0)
            ;((l[r] = '**'), t.push(l), r--)
          }
          if (!this.preserveMultipleSlashes) {
            for (let a = 1; a < s.length - 1; a++) {
              let h = s[a]
              ;(a === 1 && h === '' && s[0] === '') || ((h === '.' || h === '') && ((e = !0), s.splice(a, 1), a--))
            }
            s[0] === '.' && s.length === 2 && (s[1] === '.' || s[1] === '') && ((e = !0), s.pop())
          }
          let n = 0
          for (; (n = s.indexOf('..', n + 1)) !== -1; ) {
            let a = s[n - 1]
            if (a && a !== '.' && a !== '..' && a !== '**') {
              e = !0
              let c = n === 1 && s[n + 1] === '**' ? ['.'] : []
              ;(s.splice(n - 1, 2, ...c), s.length === 0 && s.push(''), (n -= 2))
            }
          }
        }
      } while (e)
      return t
    }
    secondPhasePreProcess(t) {
      for (let e = 0; e < t.length - 1; e++)
        for (let s = e + 1; s < t.length; s++) {
          let r = this.partsMatch(t[e], t[s], !this.preserveMultipleSlashes)
          if (r) {
            ;((t[e] = []), (t[s] = r))
            break
          }
        }
      return t.filter((e) => e.length)
    }
    partsMatch(t, e, s = !1) {
      let r = 0,
        n = 0,
        a = [],
        h = ''
      for (; r < t.length && n < e.length; )
        if (t[r] === e[n]) (a.push(h === 'b' ? e[n] : t[r]), r++, n++)
        else if (s && t[r] === '**' && e[n] === t[r + 1]) (a.push(t[r]), r++)
        else if (s && e[n] === '**' && t[r] === e[n + 1]) (a.push(e[n]), n++)
        else if (t[r] === '*' && e[n] && (this.options.dot || !e[n].startsWith('.')) && e[n] !== '**') {
          if (h === 'b') return !1
          ;((h = 'a'), a.push(t[r]), r++, n++)
        } else if (e[n] === '*' && t[r] && (this.options.dot || !t[r].startsWith('.')) && t[r] !== '**') {
          if (h === 'a') return !1
          ;((h = 'b'), a.push(e[n]), r++, n++)
        } else return !1
      return t.length === e.length && a
    }
    parseNegate() {
      if (this.nonegate) return
      let t = this.pattern,
        e = !1,
        s = 0
      for (let r = 0; r < t.length && t.charAt(r) === '!'; r++) ((e = !e), s++)
      ;(s && (this.pattern = t.slice(s)), (this.negate = e))
    }
    matchOne(t, e, s = !1) {
      let r = this.options
      if (this.isWindows) {
        let m = typeof t[0] == 'string' && /^[a-z]:$/i.test(t[0]),
          g = !m && t[0] === '' && t[1] === '' && t[2] === '?' && /^[a-z]:$/i.test(t[3]),
          y = typeof e[0] == 'string' && /^[a-z]:$/i.test(e[0]),
          v =
            !y && e[0] === '' && e[1] === '' && e[2] === '?' && typeof e[3] == 'string' && /^[a-z]:$/i.test(e[3]),
          S = g ? 3 : m ? 0 : void 0,
          b = v ? 3 : y ? 0 : void 0
        if (typeof S == 'number' && typeof b == 'number') {
          let [C, tt] = [t[S], e[b]]
          C.toLowerCase() === tt.toLowerCase() &&
            ((e[b] = C), b > S ? (e = e.slice(b)) : S > b && (t = t.slice(S)))
        }
      }
      let { optimizationLevel: n = 1 } = this.options
      ;(n >= 2 && (t = this.levelTwoFileOptimize(t)),
        this.debug('matchOne', this, { file: t, pattern: e }),
        this.debug('matchOne', t.length, e.length))
      for (var a = 0, h = 0, c = t.length, f = e.length; a < c && h < f; a++, h++) {
        this.debug('matchOne loop')
        var l = e[h],
          u = t[a]
        if ((this.debug(e, l, u), l === !1)) return !1
        if (l === z) {
          this.debug('GLOBSTAR', [e, l, u])
          var p = a,
            d = h + 1
          if (d === f) {
            for (this.debug('** at the end'); a < c; a++)
              if (t[a] === '.' || t[a] === '..' || (!r.dot && t[a].charAt(0) === '.')) return !1
            return !0
          }
          for (; p < c; ) {
            var w = t[p]
            if (
              (this.debug(
                `
globstar while`,
                t,
                p,
                e,
                d,
                w,
              ),
              this.matchOne(t.slice(p), e.slice(d), s))
            )
              return (this.debug('globstar found match!', p, c, w), !0)
            if (w === '.' || w === '..' || (!r.dot && w.charAt(0) === '.')) {
              this.debug('dot detected!', t, p, e, d)
              break
            }
            ;(this.debug('globstar swallow a segment, and continue'), p++)
          }
          return !!(
            s &&
            (this.debug(
              `
>>> no match, partial?`,
              t,
              p,
              e,
              d,
            ),
            p === c)
          )
        }
        let m
        if (
          (typeof l == 'string'
            ? ((m = u === l), this.debug('string match', l, u, m))
            : ((m = l.test(u)), this.debug('pattern match', l, u, m)),
          !m)
        )
          return !1
      }
      if (a === c && h === f) return !0
      if (a === c) return s
      if (h === f) return a === c - 1 && t[a] === ''
      throw new Error('wtf?')
    }
    braceExpand() {
      return rn(this.pattern, this.options)
    }
    parse(t) {
      ae(t)
      let e = this.options
      if (t === '**') return z
      if (t === '') return ''
      let s,
        r = null
      ;(s = t.match(Rh))
        ? (r = e.dot ? Ah : Nh)
        : (s = t.match(Eh))
          ? (r = (e.nocase ? (e.dot ? Fh : kh) : e.dot ? xh : vh)(s[1]))
          : (s = t.match(_h))
            ? (r = (e.nocase ? (e.dot ? Lh : Mh) : e.dot ? Wh : jh)(s))
            : (s = t.match(Oh))
              ? (r = e.dot ? Th : Ch)
              : (s = t.match(Dh)) && (r = Ph)
      let n = It.fromGlob(t, this.options).toMMPattern()
      return (r && typeof n == 'object' && Reflect.defineProperty(n, 'test', { value: r }), n)
    }
    makeRe() {
      if (this.regexp || this.regexp === !1) return this.regexp
      let t = this.set
      if (!t.length) return ((this.regexp = !1), this.regexp)
      let e = this.options,
        s = e.noglobstar ? $h : e.dot ? Bh : zh,
        r = new Set(e.nocase ? ['i'] : []),
        n = t
          .map((c) => {
            let f = c.map((l) => {
              if (l instanceof RegExp) for (let u of l.flags.split('')) r.add(u)
              return typeof l == 'string' ? Vh(l) : l === z ? z : l._src
            })
            return (
              f.forEach((l, u) => {
                let p = f[u + 1],
                  d = f[u - 1]
                l !== z ||
                  d === z ||
                  (d === void 0
                    ? p !== void 0 && p !== z
                      ? (f[u + 1] = '(?:\\/|' + s + '\\/)?' + p)
                      : (f[u] = s)
                    : p === void 0
                      ? (f[u - 1] = d + '(?:\\/|' + s + ')?')
                      : p !== z && ((f[u - 1] = d + '(?:\\/|\\/' + s + '\\/)' + p), (f[u + 1] = z)))
              }),
              f.filter((l) => l !== z).join('/')
            )
          })
          .join('|'),
        [a, h] = t.length > 1 ? ['(?:', ')'] : ['', '']
      ;((n = '^' + a + n + h + '$'), this.negate && (n = '^(?!' + n + ').+$'))
      try {
        this.regexp = new RegExp(n, [...r].join(''))
      } catch {
        this.regexp = !1
      }
      return this.regexp
    }
    slashSplit(t) {
      return this.preserveMultipleSlashes
        ? t.split('/')
        : this.isWindows && /^\/\/[^\/]+/.test(t)
          ? ['', ...t.split(/\/+/)]
          : t.split(/\/+/)
    }
    match(t, e = this.partial) {
      if ((this.debug('match', t, this.pattern), this.comment)) return !1
      if (this.empty) return t === ''
      if (t === '/' && e) return !0
      let s = this.options
      this.isWindows && (t = t.split('\\').join('/'))
      let r = this.slashSplit(t)
      this.debug(this.pattern, 'split', r)
      let n = this.set
      this.debug(this.pattern, 'set', n)
      let a = r[r.length - 1]
      if (!a) for (let h = r.length - 2; !a && h >= 0; h--) a = r[h]
      for (let h = 0; h < n.length; h++) {
        let c = n[h],
          f = r
        if ((s.matchBase && c.length === 1 && (f = [a]), this.matchOne(f, c, e)))
          return s.flipNegate ? !0 : !this.negate
      }
      return s.flipNegate ? !1 : this.negate
    }
    static defaults(t) {
      return Q.defaults(t).Minimatch
    }
  }
Q.AST = It
Q.Minimatch = et
Q.escape = qt
Q.unescape = at
var Tn = require('node:url')
var $t =
    typeof performance == 'object' && performance && typeof performance.now == 'function' ? performance : Date,
  on = new Set(),
  vi = typeof process == 'object' && process ? process : {},
  an = o((i, t, e, s) => {
    typeof vi.emitWarning == 'function' ? vi.emitWarning(i, t, e, s) : console.error(`[${e}] ${t}: ${i}`)
  }, 'emitWarning'),
  Me = globalThis.AbortController,
  nn = globalThis.AbortSignal
if (typeof Me > 'u') {
  ;((nn = class {
    static {
      o(this, 'AbortSignal')
    }
    onabort
    _onabort = []
    reason
    aborted = !1
    addEventListener(s, r) {
      this._onabort.push(r)
    }
  }),
    (Me = class {
      static {
        o(this, 'AbortController')
      }
      constructor() {
        t()
      }
      signal = new nn()
      abort(s) {
        if (!this.signal.aborted) {
          ;((this.signal.reason = s), (this.signal.aborted = !0))
          for (let r of this.signal._onabort) r(s)
          this.signal.onabort?.(s)
        }
      }
    }))
  let i = vi.env?.LRU_CACHE_IGNORE_AC_WARNING !== '1',
    t = o(() => {
      i &&
        ((i = !1),
        an(
          'AbortController is not defined. If using lru-cache in node 14, load an AbortController polyfill from the `node-abort-controller` package. A minimal polyfill is provided for use by LRUCache.fetch(), but it should not be relied upon in other contexts (eg, passing it to other APIs that use AbortController/AbortSignal might have undesirable effects). You may disable this with LRU_CACHE_IGNORE_AC_WARNING=1 in the env.',
          'NO_ABORT_CONTROLLER',
          'ENOTSUP',
          t,
        ))
    }, 'warnACPolyfill')
}
var Kh = o((i) => !on.has(i), 'shouldWarn'),
  mu = Symbol('type'),
  Ft = o((i) => i && i === Math.floor(i) && i > 0 && isFinite(i), 'isPosInt'),
  hn = o(
    (i) =>
      Ft(i)
        ? i <= Math.pow(2, 8)
          ? Uint8Array
          : i <= Math.pow(2, 16)
            ? Uint16Array
            : i <= Math.pow(2, 32)
              ? Uint32Array
              : i <= Number.MAX_SAFE_INTEGER
                ? Bt
                : null
        : null,
    'getUintArray',
  ),
  Bt = class extends Array {
    static {
      o(this, 'ZeroArray')
    }
    constructor(t) {
      ;(super(t), this.fill(0))
    }
  },
  xi = class i {
    static {
      o(this, 'Stack')
    }
    heap
    length
    static #t = !1
    static create(t) {
      let e = hn(t)
      if (!e) return []
      i.#t = !0
      let s = new i(t, e)
      return ((i.#t = !1), s)
    }
    constructor(t, e) {
      if (!i.#t) throw new TypeError('instantiate Stack using Stack.create(n)')
      ;((this.heap = new e(t)), (this.length = 0))
    }
    push(t) {
      this.heap[this.length++] = t
    }
    pop() {
      return this.heap[--this.length]
    }
  },
  ce = class i {
    static {
      o(this, 'LRUCache')
    }
    #t
    #e
    #n
    #r
    #o
    #b
    #y
    ttl
    ttlResolution
    ttlAutopurge
    updateAgeOnGet
    updateAgeOnHas
    allowStale
    noDisposeOnSet
    noUpdateTTL
    maxEntrySize
    sizeCalculation
    noDeleteOnFetchRejection
    noDeleteOnStaleGet
    allowStaleOnFetchAbort
    allowStaleOnFetchRejection
    ignoreFetchAbort
    #a
    #u
    #h
    #c
    #i
    #f
    #g
    #p
    #m
    #C
    #w
    #T
    #v
    #E
    #S
    #F
    #d
    #P
    static unsafeExposeInternals(t) {
      return {
        starts: t.#v,
        ttls: t.#E,
        sizes: t.#T,
        keyMap: t.#h,
        keyList: t.#c,
        valList: t.#i,
        next: t.#f,
        prev: t.#g,
        get head() {
          return t.#p
        },
        get tail() {
          return t.#m
        },
        free: t.#C,
        isBackgroundFetch: o((e) => t.#l(e), 'isBackgroundFetch'),
        backgroundFetch: o((e, s, r, n) => t.#M(e, s, r, n), 'backgroundFetch'),
        moveToTail: o((e) => t.#j(e), 'moveToTail'),
        indexes: o((e) => t.#O(e), 'indexes'),
        rindexes: o((e) => t.#D(e), 'rindexes'),
        isStale: o((e) => t.#k(e), 'isStale'),
      }
    }
    get max() {
      return this.#t
    }
    get maxSize() {
      return this.#e
    }
    get calculatedSize() {
      return this.#u
    }
    get size() {
      return this.#a
    }
    get fetchMethod() {
      return this.#b
    }
    get memoMethod() {
      return this.#y
    }
    get dispose() {
      return this.#n
    }
    get onInsert() {
      return this.#r
    }
    get disposeAfter() {
      return this.#o
    }
    constructor(t) {
      let {
        max: e = 0,
        ttl: s,
        ttlResolution: r = 1,
        ttlAutopurge: n,
        updateAgeOnGet: a,
        updateAgeOnHas: h,
        allowStale: c,
        dispose: f,
        onInsert: l,
        disposeAfter: u,
        noDisposeOnSet: p,
        noUpdateTTL: d,
        maxSize: w = 0,
        maxEntrySize: m = 0,
        sizeCalculation: g,
        fetchMethod: y,
        memoMethod: v,
        noDeleteOnFetchRejection: S,
        noDeleteOnStaleGet: b,
        allowStaleOnFetchRejection: C,
        allowStaleOnFetchAbort: tt,
        ignoreFetchAbort: St,
      } = t
      if (e !== 0 && !Ft(e)) throw new TypeError('max option must be a nonnegative integer')
      let bt = e ? hn(e) : Array
      if (!bt) throw new Error('invalid max value: ' + e)
      if (
        ((this.#t = e),
        (this.#e = w),
        (this.maxEntrySize = m || this.#e),
        (this.sizeCalculation = g),
        this.sizeCalculation)
      ) {
        if (!this.#e && !this.maxEntrySize)
          throw new TypeError('cannot set sizeCalculation without setting maxSize or maxEntrySize')
        if (typeof this.sizeCalculation != 'function') throw new TypeError('sizeCalculation set to non-function')
      }
      if (v !== void 0 && typeof v != 'function') throw new TypeError('memoMethod must be a function if defined')
      if (((this.#y = v), y !== void 0 && typeof y != 'function'))
        throw new TypeError('fetchMethod must be a function if specified')
      if (
        ((this.#b = y),
        (this.#F = !!y),
        (this.#h = new Map()),
        (this.#c = new Array(e).fill(void 0)),
        (this.#i = new Array(e).fill(void 0)),
        (this.#f = new bt(e)),
        (this.#g = new bt(e)),
        (this.#p = 0),
        (this.#m = 0),
        (this.#C = xi.create(e)),
        (this.#a = 0),
        (this.#u = 0),
        typeof f == 'function' && (this.#n = f),
        typeof l == 'function' && (this.#r = l),
        typeof u == 'function' ? ((this.#o = u), (this.#w = [])) : ((this.#o = void 0), (this.#w = void 0)),
        (this.#S = !!this.#n),
        (this.#P = !!this.#r),
        (this.#d = !!this.#o),
        (this.noDisposeOnSet = !!p),
        (this.noUpdateTTL = !!d),
        (this.noDeleteOnFetchRejection = !!S),
        (this.allowStaleOnFetchRejection = !!C),
        (this.allowStaleOnFetchAbort = !!tt),
        (this.ignoreFetchAbort = !!St),
        this.maxEntrySize !== 0)
      ) {
        if (this.#e !== 0 && !Ft(this.#e)) throw new TypeError('maxSize must be a positive integer if specified')
        if (!Ft(this.maxEntrySize)) throw new TypeError('maxEntrySize must be a positive integer if specified')
        this.#q()
      }
      if (
        ((this.allowStale = !!c),
        (this.noDeleteOnStaleGet = !!b),
        (this.updateAgeOnGet = !!a),
        (this.updateAgeOnHas = !!h),
        (this.ttlResolution = Ft(r) || r === 0 ? r : 1),
        (this.ttlAutopurge = !!n),
        (this.ttl = s || 0),
        this.ttl)
      ) {
        if (!Ft(this.ttl)) throw new TypeError('ttl must be a positive integer if specified')
        this.#s()
      }
      if (this.#t === 0 && this.ttl === 0 && this.#e === 0)
        throw new TypeError('At least one of max, maxSize, or ttl is required')
      if (!this.ttlAutopurge && !this.#t && !this.#e) {
        let E = 'LRU_CACHE_UNBOUNDED'
        Kh(E) &&
          (on.add(E),
          an(
            'TTL caching without ttlAutopurge, max, or maxSize can result in unbounded memory consumption.',
            'UnboundedCacheWarning',
            E,
            i,
          ))
      }
    }
    getRemainingTTL(t) {
      return this.#h.has(t) ? 1 / 0 : 0
    }
    #s() {
      let t = new Bt(this.#t),
        e = new Bt(this.#t)
      ;((this.#E = t),
        (this.#v = e),
        (this.#R = (n, a, h = $t.now()) => {
          if (((e[n] = a !== 0 ? h : 0), (t[n] = a), a !== 0 && this.ttlAutopurge)) {
            let c = setTimeout(() => {
              this.#k(n) && this.#N(this.#c[n], 'expire')
            }, a + 1)
            c.unref && c.unref()
          }
        }),
        (this.#A = (n) => {
          e[n] = t[n] !== 0 ? $t.now() : 0
        }),
        (this.#x = (n, a) => {
          if (t[a]) {
            let h = t[a],
              c = e[a]
            if (!h || !c) return
            ;((n.ttl = h), (n.start = c), (n.now = s || r()))
            let f = n.now - c
            n.remainingTTL = h - f
          }
        }))
      let s = 0,
        r = o(() => {
          let n = $t.now()
          if (this.ttlResolution > 0) {
            s = n
            let a = setTimeout(() => (s = 0), this.ttlResolution)
            a.unref && a.unref()
          }
          return n
        }, 'getNow')
      ;((this.getRemainingTTL = (n) => {
        let a = this.#h.get(n)
        if (a === void 0) return 0
        let h = t[a],
          c = e[a]
        if (!h || !c) return 1 / 0
        let f = (s || r()) - c
        return h - f
      }),
        (this.#k = (n) => {
          let a = e[n],
            h = t[n]
          return !!h && !!a && (s || r()) - a > h
        }))
    }
    #A = o(() => {}, '#updateItemAge')
    #x = o(() => {}, '#statusTTL')
    #R = o(() => {}, '#setItemTTL')
    #k = o(() => !1, '#isStale')
    #q() {
      let t = new Bt(this.#t)
      ;((this.#u = 0),
        (this.#T = t),
        (this.#_ = (e) => {
          ;((this.#u -= t[e]), (t[e] = 0))
        }),
        (this.#$ = (e, s, r, n) => {
          if (this.#l(s)) return 0
          if (!Ft(r))
            if (n) {
              if (typeof n != 'function') throw new TypeError('sizeCalculation must be a function')
              if (((r = n(s, e)), !Ft(r)))
                throw new TypeError('sizeCalculation return invalid (expect positive integer)')
            } else
              throw new TypeError(
                'invalid size value (must be positive integer). When maxSize or maxEntrySize is used, sizeCalculation or size must be set.',
              )
          return r
        }),
        (this.#L = (e, s, r) => {
          if (((t[e] = s), this.#e)) {
            let n = this.#e - t[e]
            for (; this.#u > n; ) this.#W(!0)
          }
          ;((this.#u += t[e]), r && ((r.entrySize = s), (r.totalCalculatedSize = this.#u)))
        }))
    }
    #_ = o((t) => {}, '#removeItemSize')
    #L = o((t, e, s) => {}, '#addItemSize')
    #$ = o((t, e, s, r) => {
      if (s || r) throw new TypeError('cannot set size without setting maxSize or maxEntrySize on cache')
      return 0
    }, '#requireSize');
    *#O({ allowStale: t = this.allowStale } = {}) {
      if (this.#a)
        for (let e = this.#m; !(!this.#B(e) || ((t || !this.#k(e)) && (yield e), e === this.#p)); ) e = this.#g[e]
    }
    *#D({ allowStale: t = this.allowStale } = {}) {
      if (this.#a)
        for (let e = this.#p; !(!this.#B(e) || ((t || !this.#k(e)) && (yield e), e === this.#m)); ) e = this.#f[e]
    }
    #B(t) {
      return t !== void 0 && this.#h.get(this.#c[t]) === t
    }
    *entries() {
      for (let t of this.#O())
        this.#i[t] !== void 0 && this.#c[t] !== void 0 && !this.#l(this.#i[t]) && (yield [this.#c[t], this.#i[t]])
    }
    *rentries() {
      for (let t of this.#D())
        this.#i[t] !== void 0 && this.#c[t] !== void 0 && !this.#l(this.#i[t]) && (yield [this.#c[t], this.#i[t]])
    }
    *keys() {
      for (let t of this.#O()) {
        let e = this.#c[t]
        e !== void 0 && !this.#l(this.#i[t]) && (yield e)
      }
    }
    *rkeys() {
      for (let t of this.#D()) {
        let e = this.#c[t]
        e !== void 0 && !this.#l(this.#i[t]) && (yield e)
      }
    }
    *values() {
      for (let t of this.#O()) this.#i[t] !== void 0 && !this.#l(this.#i[t]) && (yield this.#i[t])
    }
    *rvalues() {
      for (let t of this.#D()) this.#i[t] !== void 0 && !this.#l(this.#i[t]) && (yield this.#i[t])
    }
    [Symbol.iterator]() {
      return this.entries()
    }
    [Symbol.toStringTag] = 'LRUCache'
    find(t, e = {}) {
      for (let s of this.#O()) {
        let r = this.#i[s],
          n = this.#l(r) ? r.__staleWhileFetching : r
        if (n !== void 0 && t(n, this.#c[s], this)) return this.get(this.#c[s], e)
      }
    }
    forEach(t, e = this) {
      for (let s of this.#O()) {
        let r = this.#i[s],
          n = this.#l(r) ? r.__staleWhileFetching : r
        n !== void 0 && t.call(e, n, this.#c[s], this)
      }
    }
    rforEach(t, e = this) {
      for (let s of this.#D()) {
        let r = this.#i[s],
          n = this.#l(r) ? r.__staleWhileFetching : r
        n !== void 0 && t.call(e, n, this.#c[s], this)
      }
    }
    purgeStale() {
      let t = !1
      for (let e of this.#D({ allowStale: !0 })) this.#k(e) && (this.#N(this.#c[e], 'expire'), (t = !0))
      return t
    }
    info(t) {
      let e = this.#h.get(t)
      if (e === void 0) return
      let s = this.#i[e],
        r = this.#l(s) ? s.__staleWhileFetching : s
      if (r === void 0) return
      let n = { value: r }
      if (this.#E && this.#v) {
        let a = this.#E[e],
          h = this.#v[e]
        if (a && h) {
          let c = a - ($t.now() - h)
          ;((n.ttl = c), (n.start = Date.now()))
        }
      }
      return (this.#T && (n.size = this.#T[e]), n)
    }
    dump() {
      let t = []
      for (let e of this.#O({ allowStale: !0 })) {
        let s = this.#c[e],
          r = this.#i[e],
          n = this.#l(r) ? r.__staleWhileFetching : r
        if (n === void 0 || s === void 0) continue
        let a = { value: n }
        if (this.#E && this.#v) {
          a.ttl = this.#E[e]
          let h = $t.now() - this.#v[e]
          a.start = Math.floor(Date.now() - h)
        }
        ;(this.#T && (a.size = this.#T[e]), t.unshift([s, a]))
      }
      return t
    }
    load(t) {
      this.clear()
      for (let [e, s] of t) {
        if (s.start) {
          let r = Date.now() - s.start
          s.start = $t.now() - r
        }
        this.set(e, s.value, s)
      }
    }
    set(t, e, s = {}) {
      if (e === void 0) return (this.delete(t), this)
      let {
          ttl: r = this.ttl,
          start: n,
          noDisposeOnSet: a = this.noDisposeOnSet,
          sizeCalculation: h = this.sizeCalculation,
          status: c,
        } = s,
        { noUpdateTTL: f = this.noUpdateTTL } = s,
        l = this.#$(t, e, s.size || 0, h)
      if (this.maxEntrySize && l > this.maxEntrySize)
        return (c && ((c.set = 'miss'), (c.maxEntrySizeExceeded = !0)), this.#N(t, 'set'), this)
      let u = this.#a === 0 ? void 0 : this.#h.get(t)
      if (u === void 0)
        ((u =
          this.#a === 0
            ? this.#m
            : this.#C.length !== 0
              ? this.#C.pop()
              : this.#a === this.#t
                ? this.#W(!1)
                : this.#a),
          (this.#c[u] = t),
          (this.#i[u] = e),
          this.#h.set(t, u),
          (this.#f[this.#m] = u),
          (this.#g[u] = this.#m),
          (this.#m = u),
          this.#a++,
          this.#L(u, l, c),
          c && (c.set = 'add'),
          (f = !1),
          this.#P && this.#r?.(e, t, 'add'))
      else {
        this.#j(u)
        let p = this.#i[u]
        if (e !== p) {
          if (this.#F && this.#l(p)) {
            p.__abortController.abort(new Error('replaced'))
            let { __staleWhileFetching: d } = p
            d !== void 0 && !a && (this.#S && this.#n?.(d, t, 'set'), this.#d && this.#w?.push([d, t, 'set']))
          } else a || (this.#S && this.#n?.(p, t, 'set'), this.#d && this.#w?.push([p, t, 'set']))
          if ((this.#_(u), this.#L(u, l, c), (this.#i[u] = e), c)) {
            c.set = 'replace'
            let d = p && this.#l(p) ? p.__staleWhileFetching : p
            d !== void 0 && (c.oldValue = d)
          }
        } else c && (c.set = 'update')
        this.#P && this.onInsert?.(e, t, e === p ? 'update' : 'replace')
      }
      if (
        (r !== 0 && !this.#E && this.#s(),
        this.#E && (f || this.#R(u, r, n), c && this.#x(c, u)),
        !a && this.#d && this.#w)
      ) {
        let p = this.#w,
          d
        for (; (d = p?.shift()); ) this.#o?.(...d)
      }
      return this
    }
    pop() {
      try {
        for (; this.#a; ) {
          let t = this.#i[this.#p]
          if ((this.#W(!0), this.#l(t))) {
            if (t.__staleWhileFetching) return t.__staleWhileFetching
          } else if (t !== void 0) return t
        }
      } finally {
        if (this.#d && this.#w) {
          let t = this.#w,
            e
          for (; (e = t?.shift()); ) this.#o?.(...e)
        }
      }
    }
    #W(t) {
      let e = this.#p,
        s = this.#c[e],
        r = this.#i[e]
      return (
        this.#F && this.#l(r)
          ? r.__abortController.abort(new Error('evicted'))
          : (this.#S || this.#d) &&
            (this.#S && this.#n?.(r, s, 'evict'), this.#d && this.#w?.push([r, s, 'evict'])),
        this.#_(e),
        t && ((this.#c[e] = void 0), (this.#i[e] = void 0), this.#C.push(e)),
        this.#a === 1 ? ((this.#p = this.#m = 0), (this.#C.length = 0)) : (this.#p = this.#f[e]),
        this.#h.delete(s),
        this.#a--,
        e
      )
    }
    has(t, e = {}) {
      let { updateAgeOnHas: s = this.updateAgeOnHas, status: r } = e,
        n = this.#h.get(t)
      if (n !== void 0) {
        let a = this.#i[n]
        if (this.#l(a) && a.__staleWhileFetching === void 0) return !1
        if (this.#k(n)) r && ((r.has = 'stale'), this.#x(r, n))
        else return (s && this.#A(n), r && ((r.has = 'hit'), this.#x(r, n)), !0)
      } else r && (r.has = 'miss')
      return !1
    }
    peek(t, e = {}) {
      let { allowStale: s = this.allowStale } = e,
        r = this.#h.get(t)
      if (r === void 0 || (!s && this.#k(r))) return
      let n = this.#i[r]
      return this.#l(n) ? n.__staleWhileFetching : n
    }
    #M(t, e, s, r) {
      let n = e === void 0 ? void 0 : this.#i[e]
      if (this.#l(n)) return n
      let a = new Me(),
        { signal: h } = s
      h?.addEventListener('abort', () => a.abort(h.reason), { signal: a.signal })
      let c = { signal: a.signal, options: s, context: r },
        f = o((m, g = !1) => {
          let { aborted: y } = a.signal,
            v = s.ignoreFetchAbort && m !== void 0
          if (
            (s.status &&
              (y && !g
                ? ((s.status.fetchAborted = !0),
                  (s.status.fetchError = a.signal.reason),
                  v && (s.status.fetchAbortIgnored = !0))
                : (s.status.fetchResolved = !0)),
            y && !v && !g)
          )
            return u(a.signal.reason)
          let S = d
          return (
            this.#i[e] === d &&
              (m === void 0
                ? S.__staleWhileFetching
                  ? (this.#i[e] = S.__staleWhileFetching)
                  : this.#N(t, 'fetch')
                : (s.status && (s.status.fetchUpdated = !0), this.set(t, m, c.options))),
            m
          )
        }, 'cb'),
        l = o((m) => (s.status && ((s.status.fetchRejected = !0), (s.status.fetchError = m)), u(m)), 'eb'),
        u = o((m) => {
          let { aborted: g } = a.signal,
            y = g && s.allowStaleOnFetchAbort,
            v = y || s.allowStaleOnFetchRejection,
            S = v || s.noDeleteOnFetchRejection,
            b = d
          if (
            (this.#i[e] === d &&
              (!S || b.__staleWhileFetching === void 0
                ? this.#N(t, 'fetch')
                : y || (this.#i[e] = b.__staleWhileFetching)),
            v)
          )
            return (
              s.status && b.__staleWhileFetching !== void 0 && (s.status.returnedStale = !0),
              b.__staleWhileFetching
            )
          if (b.__returned === b) throw m
        }, 'fetchFail'),
        p = o((m, g) => {
          let y = this.#b?.(t, n, c)
          ;(y && y instanceof Promise && y.then((v) => m(v === void 0 ? void 0 : v), g),
            a.signal.addEventListener('abort', () => {
              ;(!s.ignoreFetchAbort || s.allowStaleOnFetchAbort) &&
                (m(void 0), s.allowStaleOnFetchAbort && (m = o((v) => f(v, !0), 'res')))
            }))
        }, 'pcall')
      s.status && (s.status.fetchDispatched = !0)
      let d = new Promise(p).then(f, l),
        w = Object.assign(d, { __abortController: a, __staleWhileFetching: n, __returned: void 0 })
      return (
        e === void 0 ? (this.set(t, w, { ...c.options, status: void 0 }), (e = this.#h.get(t))) : (this.#i[e] = w),
        w
      )
    }
    #l(t) {
      if (!this.#F) return !1
      let e = t
      return (
        !!e &&
        e instanceof Promise &&
        e.hasOwnProperty('__staleWhileFetching') &&
        e.__abortController instanceof Me
      )
    }
    async fetch(t, e = {}) {
      let {
        allowStale: s = this.allowStale,
        updateAgeOnGet: r = this.updateAgeOnGet,
        noDeleteOnStaleGet: n = this.noDeleteOnStaleGet,
        ttl: a = this.ttl,
        noDisposeOnSet: h = this.noDisposeOnSet,
        size: c = 0,
        sizeCalculation: f = this.sizeCalculation,
        noUpdateTTL: l = this.noUpdateTTL,
        noDeleteOnFetchRejection: u = this.noDeleteOnFetchRejection,
        allowStaleOnFetchRejection: p = this.allowStaleOnFetchRejection,
        ignoreFetchAbort: d = this.ignoreFetchAbort,
        allowStaleOnFetchAbort: w = this.allowStaleOnFetchAbort,
        context: m,
        forceRefresh: g = !1,
        status: y,
        signal: v,
      } = e
      if (!this.#F)
        return (
          y && (y.fetch = 'get'),
          this.get(t, { allowStale: s, updateAgeOnGet: r, noDeleteOnStaleGet: n, status: y })
        )
      let S = {
          allowStale: s,
          updateAgeOnGet: r,
          noDeleteOnStaleGet: n,
          ttl: a,
          noDisposeOnSet: h,
          size: c,
          sizeCalculation: f,
          noUpdateTTL: l,
          noDeleteOnFetchRejection: u,
          allowStaleOnFetchRejection: p,
          allowStaleOnFetchAbort: w,
          ignoreFetchAbort: d,
          status: y,
          signal: v,
        },
        b = this.#h.get(t)
      if (b === void 0) {
        y && (y.fetch = 'miss')
        let C = this.#M(t, b, S, m)
        return (C.__returned = C)
      } else {
        let C = this.#i[b]
        if (this.#l(C)) {
          let k = s && C.__staleWhileFetching !== void 0
          return (
            y && ((y.fetch = 'inflight'), k && (y.returnedStale = !0)),
            k ? C.__staleWhileFetching : (C.__returned = C)
          )
        }
        let tt = this.#k(b)
        if (!g && !tt) return (y && (y.fetch = 'hit'), this.#j(b), r && this.#A(b), y && this.#x(y, b), C)
        let St = this.#M(t, b, S, m),
          E = St.__staleWhileFetching !== void 0 && s
        return (
          y && ((y.fetch = tt ? 'stale' : 'refresh'), E && tt && (y.returnedStale = !0)),
          E ? St.__staleWhileFetching : (St.__returned = St)
        )
      }
    }
    async forceFetch(t, e = {}) {
      let s = await this.fetch(t, e)
      if (s === void 0) throw new Error('fetch() returned undefined')
      return s
    }
    memo(t, e = {}) {
      let s = this.#y
      if (!s) throw new Error('no memoMethod provided to constructor')
      let { context: r, forceRefresh: n, ...a } = e,
        h = this.get(t, a)
      if (!n && h !== void 0) return h
      let c = s(t, h, { options: a, context: r })
      return (this.set(t, c, a), c)
    }
    get(t, e = {}) {
      let {
          allowStale: s = this.allowStale,
          updateAgeOnGet: r = this.updateAgeOnGet,
          noDeleteOnStaleGet: n = this.noDeleteOnStaleGet,
          status: a,
        } = e,
        h = this.#h.get(t)
      if (h !== void 0) {
        let c = this.#i[h],
          f = this.#l(c)
        return (
          a && this.#x(a, h),
          this.#k(h)
            ? (a && (a.get = 'stale'),
              f
                ? (a && s && c.__staleWhileFetching !== void 0 && (a.returnedStale = !0),
                  s ? c.__staleWhileFetching : void 0)
                : (n || this.#N(t, 'expire'), a && s && (a.returnedStale = !0), s ? c : void 0))
            : (a && (a.get = 'hit'), f ? c.__staleWhileFetching : (this.#j(h), r && this.#A(h), c))
        )
      } else a && (a.get = 'miss')
    }
    #z(t, e) {
      ;((this.#g[e] = t), (this.#f[t] = e))
    }
    #j(t) {
      t !== this.#m &&
        (t === this.#p ? (this.#p = this.#f[t]) : this.#z(this.#g[t], this.#f[t]),
        this.#z(this.#m, t),
        (this.#m = t))
    }
    delete(t) {
      return this.#N(t, 'delete')
    }
    #N(t, e) {
      let s = !1
      if (this.#a !== 0) {
        let r = this.#h.get(t)
        if (r !== void 0)
          if (((s = !0), this.#a === 1)) this.#I(e)
          else {
            this.#_(r)
            let n = this.#i[r]
            if (
              (this.#l(n)
                ? n.__abortController.abort(new Error('deleted'))
                : (this.#S || this.#d) && (this.#S && this.#n?.(n, t, e), this.#d && this.#w?.push([n, t, e])),
              this.#h.delete(t),
              (this.#c[r] = void 0),
              (this.#i[r] = void 0),
              r === this.#m)
            )
              this.#m = this.#g[r]
            else if (r === this.#p) this.#p = this.#f[r]
            else {
              let a = this.#g[r]
              this.#f[a] = this.#f[r]
              let h = this.#f[r]
              this.#g[h] = this.#g[r]
            }
            ;(this.#a--, this.#C.push(r))
          }
      }
      if (this.#d && this.#w?.length) {
        let r = this.#w,
          n
        for (; (n = r?.shift()); ) this.#o?.(...n)
      }
      return s
    }
    clear() {
      return this.#I('delete')
    }
    #I(t) {
      for (let e of this.#D({ allowStale: !0 })) {
        let s = this.#i[e]
        if (this.#l(s)) s.__abortController.abort(new Error('deleted'))
        else {
          let r = this.#c[e]
          ;(this.#S && this.#n?.(s, r, t), this.#d && this.#w?.push([s, r, t]))
        }
      }
      if (
        (this.#h.clear(),
        this.#i.fill(void 0),
        this.#c.fill(void 0),
        this.#E && this.#v && (this.#E.fill(0), this.#v.fill(0)),
        this.#T && this.#T.fill(0),
        (this.#p = 0),
        (this.#m = 0),
        (this.#C.length = 0),
        (this.#u = 0),
        (this.#a = 0),
        this.#d && this.#w)
      ) {
        let e = this.#w,
          s
        for (; (s = e?.shift()); ) this.#o?.(...s)
      }
    }
  }
var Gt = require('node:path'),
  gn = require('node:url'),
  pt = require('fs'),
  nc = At(require('node:fs'), 1),
  Tt = require('node:fs/promises')
var Be = require('node:events'),
  Pi = At(require('node:stream'), 1),
  dn = require('node:string_decoder')
var cn = typeof process == 'object' && process ? process : { stdout: null, stderr: null },
  Yh = o(
    (i) => !!i && typeof i == 'object' && (i instanceof Ct || i instanceof Pi.default || Xh(i) || Qh(i)),
    'isStream',
  ),
  Xh = o(
    (i) =>
      !!i &&
      typeof i == 'object' &&
      i instanceof Be.EventEmitter &&
      typeof i.pipe == 'function' &&
      i.pipe !== Pi.default.Writable.prototype.pipe,
    'isReadable',
  ),
  Qh = o(
    (i) =>
      !!i &&
      typeof i == 'object' &&
      i instanceof Be.EventEmitter &&
      typeof i.write == 'function' &&
      typeof i.end == 'function',
    'isWritable',
  ),
  yt = Symbol('EOF'),
  gt = Symbol('maybeEmitEnd'),
  Ot = Symbol('emittedEnd'),
  Le = Symbol('emittingEnd'),
  le = Symbol('emittedError'),
  We = Symbol('closed'),
  ln = Symbol('read'),
  je = Symbol('flush'),
  un = Symbol('flushChunk'),
  ht = Symbol('encoding'),
  zt = Symbol('decoder'),
  L = Symbol('flowing'),
  ue = Symbol('paused'),
  Ut = Symbol('resume'),
  W = Symbol('buffer'),
  Z = Symbol('pipes'),
  j = Symbol('bufferLength'),
  ki = Symbol('bufferPush'),
  Ie = Symbol('bufferShift'),
  G = Symbol('objectMode'),
  N = Symbol('destroyed'),
  Fi = Symbol('error'),
  Oi = Symbol('emitData'),
  fn = Symbol('emitEnd'),
  Ci = Symbol('emitEnd2'),
  ft = Symbol('async'),
  Ti = Symbol('abort'),
  qe = Symbol('aborted'),
  fe = Symbol('signal'),
  Rt = Symbol('dataListeners'),
  it = Symbol('discarded'),
  de = o((i) => Promise.resolve().then(i), 'defer'),
  Zh = o((i) => i(), 'nodefer'),
  tc = o((i) => i === 'end' || i === 'finish' || i === 'prefinish', 'isEndish'),
  ec = o(
    (i) =>
      i instanceof ArrayBuffer ||
      (!!i && typeof i == 'object' && i.constructor && i.constructor.name === 'ArrayBuffer' && i.byteLength >= 0),
    'isArrayBufferLike',
  ),
  ic = o((i) => !Buffer.isBuffer(i) && ArrayBuffer.isView(i), 'isArrayBufferView'),
  $e = class {
    static {
      o(this, 'Pipe')
    }
    src
    dest
    opts
    ondrain
    constructor(t, e, s) {
      ;((this.src = t),
        (this.dest = e),
        (this.opts = s),
        (this.ondrain = () => t[Ut]()),
        this.dest.on('drain', this.ondrain))
    }
    unpipe() {
      this.dest.removeListener('drain', this.ondrain)
    }
    proxyErrors(t) {}
    end() {
      ;(this.unpipe(), this.opts.end && this.dest.end())
    }
  },
  Di = class extends $e {
    static {
      o(this, 'PipeProxyErrors')
    }
    unpipe() {
      ;(this.src.removeListener('error', this.proxyErrors), super.unpipe())
    }
    constructor(t, e, s) {
      ;(super(t, e, s), (this.proxyErrors = (r) => e.emit('error', r)), t.on('error', this.proxyErrors))
    }
  },
  sc = o((i) => !!i.objectMode, 'isObjectModeOptions'),
  rc = o((i) => !i.objectMode && !!i.encoding && i.encoding !== 'buffer', 'isEncodingOptions'),
  Ct = class extends Be.EventEmitter {
    static {
      o(this, 'Minipass')
    }
    [L] = !1;
    [ue] = !1;
    [Z] = [];
    [W] = [];
    [G];
    [ht];
    [ft];
    [zt];
    [yt] = !1;
    [Ot] = !1;
    [Le] = !1;
    [We] = !1;
    [le] = null;
    [j] = 0;
    [N] = !1;
    [fe];
    [qe] = !1;
    [Rt] = 0;
    [it] = !1
    writable = !0
    readable = !0
    constructor(...t) {
      let e = t[0] || {}
      if ((super(), e.objectMode && typeof e.encoding == 'string'))
        throw new TypeError('Encoding and objectMode may not be used together')
      ;(sc(e)
        ? ((this[G] = !0), (this[ht] = null))
        : rc(e)
          ? ((this[ht] = e.encoding), (this[G] = !1))
          : ((this[G] = !1), (this[ht] = null)),
        (this[ft] = !!e.async),
        (this[zt] = this[ht] ? new dn.StringDecoder(this[ht]) : null),
        e && e.debugExposeBuffer === !0 && Object.defineProperty(this, 'buffer', { get: o(() => this[W], 'get') }),
        e && e.debugExposePipes === !0 && Object.defineProperty(this, 'pipes', { get: o(() => this[Z], 'get') }))
      let { signal: s } = e
      s && ((this[fe] = s), s.aborted ? this[Ti]() : s.addEventListener('abort', () => this[Ti]()))
    }
    get bufferLength() {
      return this[j]
    }
    get encoding() {
      return this[ht]
    }
    set encoding(t) {
      throw new Error('Encoding must be set at instantiation time')
    }
    setEncoding(t) {
      throw new Error('Encoding must be set at instantiation time')
    }
    get objectMode() {
      return this[G]
    }
    set objectMode(t) {
      throw new Error('objectMode must be set at instantiation time')
    }
    get async() {
      return this[ft]
    }
    set async(t) {
      this[ft] = this[ft] || !!t
    }
    [Ti]() {
      ;((this[qe] = !0), this.emit('abort', this[fe]?.reason), this.destroy(this[fe]?.reason))
    }
    get aborted() {
      return this[qe]
    }
    set aborted(t) {}
    write(t, e, s) {
      if (this[qe]) return !1
      if (this[yt]) throw new Error('write after end')
      if (this[N])
        return (
          this.emit(
            'error',
            Object.assign(new Error('Cannot call write after a stream was destroyed'), {
              code: 'ERR_STREAM_DESTROYED',
            }),
          ),
          !0
        )
      ;(typeof e == 'function' && ((s = e), (e = 'utf8')), e || (e = 'utf8'))
      let r = this[ft] ? de : Zh
      if (!this[G] && !Buffer.isBuffer(t)) {
        if (ic(t)) t = Buffer.from(t.buffer, t.byteOffset, t.byteLength)
        else if (ec(t)) t = Buffer.from(t)
        else if (typeof t != 'string') throw new Error('Non-contiguous data written to non-objectMode stream')
      }
      return this[G]
        ? (this[L] && this[j] !== 0 && this[je](!0),
          this[L] ? this.emit('data', t) : this[ki](t),
          this[j] !== 0 && this.emit('readable'),
          s && r(s),
          this[L])
        : t.length
          ? (typeof t == 'string' && !(e === this[ht] && !this[zt]?.lastNeed) && (t = Buffer.from(t, e)),
            Buffer.isBuffer(t) && this[ht] && (t = this[zt].write(t)),
            this[L] && this[j] !== 0 && this[je](!0),
            this[L] ? this.emit('data', t) : this[ki](t),
            this[j] !== 0 && this.emit('readable'),
            s && r(s),
            this[L])
          : (this[j] !== 0 && this.emit('readable'), s && r(s), this[L])
    }
    read(t) {
      if (this[N]) return null
      if (((this[it] = !1), this[j] === 0 || t === 0 || (t && t > this[j]))) return (this[gt](), null)
      ;(this[G] && (t = null),
        this[W].length > 1 &&
          !this[G] &&
          (this[W] = [this[ht] ? this[W].join('') : Buffer.concat(this[W], this[j])]))
      let e = this[ln](t || null, this[W][0])
      return (this[gt](), e)
    }
    [ln](t, e) {
      if (this[G]) this[Ie]()
      else {
        let s = e
        t === s.length || t === null
          ? this[Ie]()
          : typeof s == 'string'
            ? ((this[W][0] = s.slice(t)), (e = s.slice(0, t)), (this[j] -= t))
            : ((this[W][0] = s.subarray(t)), (e = s.subarray(0, t)), (this[j] -= t))
      }
      return (this.emit('data', e), !this[W].length && !this[yt] && this.emit('drain'), e)
    }
    end(t, e, s) {
      return (
        typeof t == 'function' && ((s = t), (t = void 0)),
        typeof e == 'function' && ((s = e), (e = 'utf8')),
        t !== void 0 && this.write(t, e),
        s && this.once('end', s),
        (this[yt] = !0),
        (this.writable = !1),
        (this[L] || !this[ue]) && this[gt](),
        this
      )
    }
    [Ut]() {
      this[N] ||
        (!this[Rt] && !this[Z].length && (this[it] = !0),
        (this[ue] = !1),
        (this[L] = !0),
        this.emit('resume'),
        this[W].length ? this[je]() : this[yt] ? this[gt]() : this.emit('drain'))
    }
    resume() {
      return this[Ut]()
    }
    pause() {
      ;((this[L] = !1), (this[ue] = !0), (this[it] = !1))
    }
    get destroyed() {
      return this[N]
    }
    get flowing() {
      return this[L]
    }
    get paused() {
      return this[ue]
    }
    [ki](t) {
      ;(this[G] ? (this[j] += 1) : (this[j] += t.length), this[W].push(t))
    }
    [Ie]() {
      return (this[G] ? (this[j] -= 1) : (this[j] -= this[W][0].length), this[W].shift())
    }
    [je](t = !1) {
      do;
      while (this[un](this[Ie]()) && this[W].length)
      !t && !this[W].length && !this[yt] && this.emit('drain')
    }
    [un](t) {
      return (this.emit('data', t), this[L])
    }
    pipe(t, e) {
      if (this[N]) return t
      this[it] = !1
      let s = this[Ot]
      return (
        (e = e || {}),
        t === cn.stdout || t === cn.stderr ? (e.end = !1) : (e.end = e.end !== !1),
        (e.proxyErrors = !!e.proxyErrors),
        s
          ? e.end && t.end()
          : (this[Z].push(e.proxyErrors ? new Di(this, t, e) : new $e(this, t, e)),
            this[ft] ? de(() => this[Ut]()) : this[Ut]()),
        t
      )
    }
    unpipe(t) {
      let e = this[Z].find((s) => s.dest === t)
      e &&
        (this[Z].length === 1
          ? (this[L] && this[Rt] === 0 && (this[L] = !1), (this[Z] = []))
          : this[Z].splice(this[Z].indexOf(e), 1),
        e.unpipe())
    }
    addListener(t, e) {
      return this.on(t, e)
    }
    on(t, e) {
      let s = super.on(t, e)
      if (t === 'data') ((this[it] = !1), this[Rt]++, !this[Z].length && !this[L] && this[Ut]())
      else if (t === 'readable' && this[j] !== 0) super.emit('readable')
      else if (tc(t) && this[Ot]) (super.emit(t), this.removeAllListeners(t))
      else if (t === 'error' && this[le]) {
        let r = e
        this[ft] ? de(() => r.call(this, this[le])) : r.call(this, this[le])
      }
      return s
    }
    removeListener(t, e) {
      return this.off(t, e)
    }
    off(t, e) {
      let s = super.off(t, e)
      return (
        t === 'data' &&
          ((this[Rt] = this.listeners('data').length),
          this[Rt] === 0 && !this[it] && !this[Z].length && (this[L] = !1)),
        s
      )
    }
    removeAllListeners(t) {
      let e = super.removeAllListeners(t)
      return (
        (t === 'data' || t === void 0) && ((this[Rt] = 0), !this[it] && !this[Z].length && (this[L] = !1)),
        e
      )
    }
    get emittedEnd() {
      return this[Ot]
    }
    [gt]() {
      !this[Le] &&
        !this[Ot] &&
        !this[N] &&
        this[W].length === 0 &&
        this[yt] &&
        ((this[Le] = !0),
        this.emit('end'),
        this.emit('prefinish'),
        this.emit('finish'),
        this[We] && this.emit('close'),
        (this[Le] = !1))
    }
    emit(t, ...e) {
      let s = e[0]
      if (t !== 'error' && t !== 'close' && t !== N && this[N]) return !1
      if (t === 'data') return !this[G] && !s ? !1 : this[ft] ? (de(() => this[Oi](s)), !0) : this[Oi](s)
      if (t === 'end') return this[fn]()
      if (t === 'close') {
        if (((this[We] = !0), !this[Ot] && !this[N])) return !1
        let n = super.emit('close')
        return (this.removeAllListeners('close'), n)
      } else if (t === 'error') {
        ;((this[le] = s), super.emit(Fi, s))
        let n = !this[fe] || this.listeners('error').length ? super.emit('error', s) : !1
        return (this[gt](), n)
      } else if (t === 'resume') {
        let n = super.emit('resume')
        return (this[gt](), n)
      } else if (t === 'finish' || t === 'prefinish') {
        let n = super.emit(t)
        return (this.removeAllListeners(t), n)
      }
      let r = super.emit(t, ...e)
      return (this[gt](), r)
    }
    [Oi](t) {
      for (let s of this[Z]) s.dest.write(t) === !1 && this.pause()
      let e = this[it] ? !1 : super.emit('data', t)
      return (this[gt](), e)
    }
    [fn]() {
      return this[Ot]
        ? !1
        : ((this[Ot] = !0), (this.readable = !1), this[ft] ? (de(() => this[Ci]()), !0) : this[Ci]())
    }
    [Ci]() {
      if (this[zt]) {
        let e = this[zt].end()
        if (e) {
          for (let s of this[Z]) s.dest.write(e)
          this[it] || super.emit('data', e)
        }
      }
      for (let e of this[Z]) e.end()
      let t = super.emit('end')
      return (this.removeAllListeners('end'), t)
    }
    async collect() {
      let t = Object.assign([], { dataLength: 0 })
      this[G] || (t.dataLength = 0)
      let e = this.promise()
      return (
        this.on('data', (s) => {
          ;(t.push(s), this[G] || (t.dataLength += s.length))
        }),
        await e,
        t
      )
    }
    async concat() {
      if (this[G]) throw new Error('cannot concat in objectMode')
      let t = await this.collect()
      return this[ht] ? t.join('') : Buffer.concat(t, t.dataLength)
    }
    async promise() {
      return new Promise((t, e) => {
        ;(this.on(N, () => e(new Error('stream destroyed'))),
          this.on('error', (s) => e(s)),
          this.on('end', () => t()))
      })
    }
    [Symbol.asyncIterator]() {
      this[it] = !1
      let t = !1,
        e = o(async () => (this.pause(), (t = !0), { value: void 0, done: !0 }), 'stop')
      return {
        next: o(() => {
          if (t) return e()
          let r = this.read()
          if (r !== null) return Promise.resolve({ done: !1, value: r })
          if (this[yt]) return e()
          let n,
            a,
            h = o((u) => {
              ;(this.off('data', c), this.off('end', f), this.off(N, l), e(), a(u))
            }, 'onerr'),
            c = o((u) => {
              ;(this.off('error', h),
                this.off('end', f),
                this.off(N, l),
                this.pause(),
                n({ value: u, done: !!this[yt] }))
            }, 'ondata'),
            f = o(() => {
              ;(this.off('error', h), this.off('data', c), this.off(N, l), e(), n({ done: !0, value: void 0 }))
            }, 'onend'),
            l = o(() => h(new Error('stream destroyed')), 'ondestroy')
          return new Promise((u, p) => {
            ;((a = p), (n = u), this.once(N, l), this.once('error', h), this.once('end', f), this.once('data', c))
          })
        }, 'next'),
        throw: e,
        return: e,
        [Symbol.asyncIterator]() {
          return this
        },
      }
    }
    [Symbol.iterator]() {
      this[it] = !1
      let t = !1,
        e = o(
          () => (
            this.pause(),
            this.off(Fi, e),
            this.off(N, e),
            this.off('end', e),
            (t = !0),
            { done: !0, value: void 0 }
          ),
          'stop',
        ),
        s = o(() => {
          if (t) return e()
          let r = this.read()
          return r === null ? e() : { done: !1, value: r }
        }, 'next')
      return (
        this.once('end', e),
        this.once(Fi, e),
        this.once(N, e),
        {
          next: s,
          throw: e,
          return: e,
          [Symbol.iterator]() {
            return this
          },
        }
      )
    }
    destroy(t) {
      if (this[N]) return (t ? this.emit('error', t) : this.emit(N), this)
      ;((this[N] = !0), (this[it] = !0), (this[W].length = 0), (this[j] = 0))
      let e = this
      return (
        typeof e.close == 'function' && !this[We] && e.close(),
        t ? this.emit('error', t) : this.emit(N),
        this
      )
    }
    static get isStream() {
      return Yh
    }
  }
var oc = pt.realpathSync.native,
  me = {
    lstatSync: pt.lstatSync,
    readdir: pt.readdir,
    readdirSync: pt.readdirSync,
    readlinkSync: pt.readlinkSync,
    realpathSync: oc,
    promises: { lstat: Tt.lstat, readdir: Tt.readdir, readlink: Tt.readlink, realpath: Tt.realpath },
  },
  Sn = o(
    (i) =>
      !i || i === me || i === nc ? me : { ...me, ...i, promises: { ...me.promises, ...(i.promises || {}) } },
    'fsFromOption',
  ),
  bn = /^\\\\\?\\([a-z]:)\\?$/i,
  ac = o((i) => i.replace(/\//g, '\\').replace(bn, '$1\\'), 'uncToDrive'),
  hc = /[\\\/]/,
  nt = 0,
  En = 1,
  vn = 2,
  dt = 4,
  xn = 6,
  kn = 8,
  Nt = 10,
  Fn = 12,
  rt = 15,
  pe = ~rt,
  Ri = 16,
  pn = 32,
  we = 64,
  ct = 128,
  ze = 256,
  Ge = 512,
  mn = we | ct | Ge,
  cc = 1023,
  Ni = o(
    (i) =>
      i.isFile()
        ? kn
        : i.isDirectory()
          ? dt
          : i.isSymbolicLink()
            ? Nt
            : i.isCharacterDevice()
              ? vn
              : i.isBlockDevice()
                ? xn
                : i.isSocket()
                  ? Fn
                  : i.isFIFO()
                    ? En
                    : nt,
    'entToType',
  ),
  wn = new Map(),
  ye = o((i) => {
    let t = wn.get(i)
    if (t) return t
    let e = i.normalize('NFKD')
    return (wn.set(i, e), e)
  }, 'normalize'),
  yn = new Map(),
  Ue = o((i) => {
    let t = yn.get(i)
    if (t) return t
    let e = ye(i.toLowerCase())
    return (yn.set(i, e), e)
  }, 'normalizeNocase'),
  Je = class extends ce {
    static {
      o(this, 'ResolveCache')
    }
    constructor() {
      super({ max: 256 })
    }
  },
  Ai = class extends ce {
    static {
      o(this, 'ChildrenCache')
    }
    constructor(t = 16 * 1024) {
      super({ maxSize: t, sizeCalculation: o((e) => e.length + 1, 'sizeCalculation') })
    }
  },
  On = Symbol('PathScurry setAsCwd'),
  J = class {
    static {
      o(this, 'PathBase')
    }
    name
    root
    roots
    parent
    nocase
    isCWD = !1
    #t
    #e
    get dev() {
      return this.#e
    }
    #n
    get mode() {
      return this.#n
    }
    #r
    get nlink() {
      return this.#r
    }
    #o
    get uid() {
      return this.#o
    }
    #b
    get gid() {
      return this.#b
    }
    #y
    get rdev() {
      return this.#y
    }
    #a
    get blksize() {
      return this.#a
    }
    #u
    get ino() {
      return this.#u
    }
    #h
    get size() {
      return this.#h
    }
    #c
    get blocks() {
      return this.#c
    }
    #i
    get atimeMs() {
      return this.#i
    }
    #f
    get mtimeMs() {
      return this.#f
    }
    #g
    get ctimeMs() {
      return this.#g
    }
    #p
    get birthtimeMs() {
      return this.#p
    }
    #m
    get atime() {
      return this.#m
    }
    #C
    get mtime() {
      return this.#C
    }
    #w
    get ctime() {
      return this.#w
    }
    #T
    get birthtime() {
      return this.#T
    }
    #v
    #E
    #S
    #F
    #d
    #P
    #s
    #A
    #x
    #R
    get parentPath() {
      return (this.parent || this).fullpath()
    }
    get path() {
      return this.parentPath
    }
    constructor(t, e = nt, s, r, n, a, h) {
      ;((this.name = t),
        (this.#v = n ? Ue(t) : ye(t)),
        (this.#s = e & cc),
        (this.nocase = n),
        (this.roots = r),
        (this.root = s || this),
        (this.#A = a),
        (this.#S = h.fullpath),
        (this.#d = h.relative),
        (this.#P = h.relativePosix),
        (this.parent = h.parent),
        this.parent ? (this.#t = this.parent.#t) : (this.#t = Sn(h.fs)))
    }
    depth() {
      return this.#E !== void 0 ? this.#E : this.parent ? (this.#E = this.parent.depth() + 1) : (this.#E = 0)
    }
    childrenCache() {
      return this.#A
    }
    resolve(t) {
      if (!t) return this
      let e = this.getRootString(t),
        r = t.substring(e.length).split(this.splitSep)
      return e ? this.getRoot(e).#k(r) : this.#k(r)
    }
    #k(t) {
      let e = this
      for (let s of t) e = e.child(s)
      return e
    }
    children() {
      let t = this.#A.get(this)
      if (t) return t
      let e = Object.assign([], { provisional: 0 })
      return (this.#A.set(this, e), (this.#s &= ~Ri), e)
    }
    child(t, e) {
      if (t === '' || t === '.') return this
      if (t === '..') return this.parent || this
      let s = this.children(),
        r = this.nocase ? Ue(t) : ye(t)
      for (let c of s) if (c.#v === r) return c
      let n = this.parent ? this.sep : '',
        a = this.#S ? this.#S + n + t : void 0,
        h = this.newChild(t, nt, { ...e, parent: this, fullpath: a })
      return (this.canReaddir() || (h.#s |= ct), s.push(h), h)
    }
    relative() {
      if (this.isCWD) return ''
      if (this.#d !== void 0) return this.#d
      let t = this.name,
        e = this.parent
      if (!e) return (this.#d = this.name)
      let s = e.relative()
      return s + (!s || !e.parent ? '' : this.sep) + t
    }
    relativePosix() {
      if (this.sep === '/') return this.relative()
      if (this.isCWD) return ''
      if (this.#P !== void 0) return this.#P
      let t = this.name,
        e = this.parent
      if (!e) return (this.#P = this.fullpathPosix())
      let s = e.relativePosix()
      return s + (!s || !e.parent ? '' : '/') + t
    }
    fullpath() {
      if (this.#S !== void 0) return this.#S
      let t = this.name,
        e = this.parent
      if (!e) return (this.#S = this.name)
      let r = e.fullpath() + (e.parent ? this.sep : '') + t
      return (this.#S = r)
    }
    fullpathPosix() {
      if (this.#F !== void 0) return this.#F
      if (this.sep === '/') return (this.#F = this.fullpath())
      if (!this.parent) {
        let r = this.fullpath().replace(/\\/g, '/')
        return /^[a-z]:\//i.test(r) ? (this.#F = `//?/${r}`) : (this.#F = r)
      }
      let t = this.parent,
        e = t.fullpathPosix(),
        s = e + (!e || !t.parent ? '' : '/') + this.name
      return (this.#F = s)
    }
    isUnknown() {
      return (this.#s & rt) === nt
    }
    isType(t) {
      return this[`is${t}`]()
    }
    getType() {
      return this.isUnknown()
        ? 'Unknown'
        : this.isDirectory()
          ? 'Directory'
          : this.isFile()
            ? 'File'
            : this.isSymbolicLink()
              ? 'SymbolicLink'
              : this.isFIFO()
                ? 'FIFO'
                : this.isCharacterDevice()
                  ? 'CharacterDevice'
                  : this.isBlockDevice()
                    ? 'BlockDevice'
                    : this.isSocket()
                      ? 'Socket'
                      : 'Unknown'
    }
    isFile() {
      return (this.#s & rt) === kn
    }
    isDirectory() {
      return (this.#s & rt) === dt
    }
    isCharacterDevice() {
      return (this.#s & rt) === vn
    }
    isBlockDevice() {
      return (this.#s & rt) === xn
    }
    isFIFO() {
      return (this.#s & rt) === En
    }
    isSocket() {
      return (this.#s & rt) === Fn
    }
    isSymbolicLink() {
      return (this.#s & Nt) === Nt
    }
    lstatCached() {
      return this.#s & pn ? this : void 0
    }
    readlinkCached() {
      return this.#x
    }
    realpathCached() {
      return this.#R
    }
    readdirCached() {
      let t = this.children()
      return t.slice(0, t.provisional)
    }
    canReadlink() {
      if (this.#x) return !0
      if (!this.parent) return !1
      let t = this.#s & rt
      return !((t !== nt && t !== Nt) || this.#s & ze || this.#s & ct)
    }
    calledReaddir() {
      return !!(this.#s & Ri)
    }
    isENOENT() {
      return !!(this.#s & ct)
    }
    isNamed(t) {
      return this.nocase ? this.#v === Ue(t) : this.#v === ye(t)
    }
    async readlink() {
      let t = this.#x
      if (t) return t
      if (this.canReadlink() && this.parent)
        try {
          let e = await this.#t.promises.readlink(this.fullpath()),
            s = (await this.parent.realpath())?.resolve(e)
          if (s) return (this.#x = s)
        } catch (e) {
          this.#W(e.code)
          return
        }
    }
    readlinkSync() {
      let t = this.#x
      if (t) return t
      if (this.canReadlink() && this.parent)
        try {
          let e = this.#t.readlinkSync(this.fullpath()),
            s = this.parent.realpathSync()?.resolve(e)
          if (s) return (this.#x = s)
        } catch (e) {
          this.#W(e.code)
          return
        }
    }
    #q(t) {
      this.#s |= Ri
      for (let e = t.provisional; e < t.length; e++) {
        let s = t[e]
        s && s.#_()
      }
    }
    #_() {
      this.#s & ct || ((this.#s = (this.#s | ct) & pe), this.#L())
    }
    #L() {
      let t = this.children()
      t.provisional = 0
      for (let e of t) e.#_()
    }
    #$() {
      ;((this.#s |= Ge), this.#O())
    }
    #O() {
      if (this.#s & we) return
      let t = this.#s
      ;((t & rt) === dt && (t &= pe), (this.#s = t | we), this.#L())
    }
    #D(t = '') {
      t === 'ENOTDIR' || t === 'EPERM' ? this.#O() : t === 'ENOENT' ? this.#_() : (this.children().provisional = 0)
    }
    #B(t = '') {
      t === 'ENOTDIR' ? this.parent.#O() : t === 'ENOENT' && this.#_()
    }
    #W(t = '') {
      let e = this.#s
      ;((e |= ze),
        t === 'ENOENT' && (e |= ct),
        (t === 'EINVAL' || t === 'UNKNOWN') && (e &= pe),
        (this.#s = e),
        t === 'ENOTDIR' && this.parent && this.parent.#O())
    }
    #M(t, e) {
      return this.#z(t, e) || this.#l(t, e)
    }
    #l(t, e) {
      let s = Ni(t),
        r = this.newChild(t.name, s, { parent: this }),
        n = r.#s & rt
      return (n !== dt && n !== Nt && n !== nt && (r.#s |= we), e.unshift(r), e.provisional++, r)
    }
    #z(t, e) {
      for (let s = e.provisional; s < e.length; s++) {
        let r = e[s]
        if ((this.nocase ? Ue(t.name) : ye(t.name)) === r.#v) return this.#j(t, r, s, e)
      }
    }
    #j(t, e, s, r) {
      let n = e.name
      return (
        (e.#s = (e.#s & pe) | Ni(t)),
        n !== t.name && (e.name = t.name),
        s !== r.provisional && (s === r.length - 1 ? r.pop() : r.splice(s, 1), r.unshift(e)),
        r.provisional++,
        e
      )
    }
    async lstat() {
      if (!(this.#s & ct))
        try {
          return (this.#N(await this.#t.promises.lstat(this.fullpath())), this)
        } catch (t) {
          this.#B(t.code)
        }
    }
    lstatSync() {
      if (!(this.#s & ct))
        try {
          return (this.#N(this.#t.lstatSync(this.fullpath())), this)
        } catch (t) {
          this.#B(t.code)
        }
    }
    #N(t) {
      let {
        atime: e,
        atimeMs: s,
        birthtime: r,
        birthtimeMs: n,
        blksize: a,
        blocks: h,
        ctime: c,
        ctimeMs: f,
        dev: l,
        gid: u,
        ino: p,
        mode: d,
        mtime: w,
        mtimeMs: m,
        nlink: g,
        rdev: y,
        size: v,
        uid: S,
      } = t
      ;((this.#m = e),
        (this.#i = s),
        (this.#T = r),
        (this.#p = n),
        (this.#a = a),
        (this.#c = h),
        (this.#w = c),
        (this.#g = f),
        (this.#e = l),
        (this.#b = u),
        (this.#u = p),
        (this.#n = d),
        (this.#C = w),
        (this.#f = m),
        (this.#r = g),
        (this.#y = y),
        (this.#h = v),
        (this.#o = S))
      let b = Ni(t)
      ;((this.#s = (this.#s & pe) | b | pn), b !== nt && b !== dt && b !== Nt && (this.#s |= we))
    }
    #I = []
    #G = !1
    #J(t) {
      this.#G = !1
      let e = this.#I.slice()
      ;((this.#I.length = 0), e.forEach((s) => s(null, t)))
    }
    readdirCB(t, e = !1) {
      if (!this.canReaddir()) {
        e ? t(null, []) : queueMicrotask(() => t(null, []))
        return
      }
      let s = this.children()
      if (this.calledReaddir()) {
        let n = s.slice(0, s.provisional)
        e ? t(null, n) : queueMicrotask(() => t(null, n))
        return
      }
      if ((this.#I.push(t), this.#G)) return
      this.#G = !0
      let r = this.fullpath()
      this.#t.readdir(r, { withFileTypes: !0 }, (n, a) => {
        if (n) (this.#D(n.code), (s.provisional = 0))
        else {
          for (let h of a) this.#M(h, s)
          this.#q(s)
        }
        this.#J(s.slice(0, s.provisional))
      })
    }
    #U
    async readdir() {
      if (!this.canReaddir()) return []
      let t = this.children()
      if (this.calledReaddir()) return t.slice(0, t.provisional)
      let e = this.fullpath()
      if (this.#U) await this.#U
      else {
        let s = o(() => {}, 'resolve')
        this.#U = new Promise((r) => (s = r))
        try {
          for (let r of await this.#t.promises.readdir(e, { withFileTypes: !0 })) this.#M(r, t)
          this.#q(t)
        } catch (r) {
          ;(this.#D(r.code), (t.provisional = 0))
        }
        ;((this.#U = void 0), s())
      }
      return t.slice(0, t.provisional)
    }
    readdirSync() {
      if (!this.canReaddir()) return []
      let t = this.children()
      if (this.calledReaddir()) return t.slice(0, t.provisional)
      let e = this.fullpath()
      try {
        for (let s of this.#t.readdirSync(e, { withFileTypes: !0 })) this.#M(s, t)
        this.#q(t)
      } catch (s) {
        ;(this.#D(s.code), (t.provisional = 0))
      }
      return t.slice(0, t.provisional)
    }
    canReaddir() {
      if (this.#s & mn) return !1
      let t = rt & this.#s
      return t === nt || t === dt || t === Nt
    }
    shouldWalk(t, e) {
      return (this.#s & dt) === dt && !(this.#s & mn) && !t.has(this) && (!e || e(this))
    }
    async realpath() {
      if (this.#R) return this.#R
      if (!((Ge | ze | ct) & this.#s))
        try {
          let t = await this.#t.promises.realpath(this.fullpath())
          return (this.#R = this.resolve(t))
        } catch {
          this.#$()
        }
    }
    realpathSync() {
      if (this.#R) return this.#R
      if (!((Ge | ze | ct) & this.#s))
        try {
          let t = this.#t.realpathSync(this.fullpath())
          return (this.#R = this.resolve(t))
        } catch {
          this.#$()
        }
    }
    [On](t) {
      if (t === this) return
      ;((t.isCWD = !1), (this.isCWD = !0))
      let e = new Set([]),
        s = [],
        r = this
      for (; r && r.parent; )
        (e.add(r), (r.#d = s.join(this.sep)), (r.#P = s.join('/')), (r = r.parent), s.push('..'))
      for (r = t; r && r.parent && !e.has(r); ) ((r.#d = void 0), (r.#P = void 0), (r = r.parent))
    }
  },
  He = class i extends J {
    static {
      o(this, 'PathWin32')
    }
    sep = '\\'
    splitSep = hc
    constructor(t, e = nt, s, r, n, a, h) {
      super(t, e, s, r, n, a, h)
    }
    newChild(t, e = nt, s = {}) {
      return new i(t, e, this.root, this.roots, this.nocase, this.childrenCache(), s)
    }
    getRootString(t) {
      return Gt.win32.parse(t).root
    }
    getRoot(t) {
      if (((t = ac(t.toUpperCase())), t === this.root.name)) return this.root
      for (let [e, s] of Object.entries(this.roots)) if (this.sameRoot(t, e)) return (this.roots[t] = s)
      return (this.roots[t] = new Jt(t, this).root)
    }
    sameRoot(t, e = this.root.name) {
      return ((t = t.toUpperCase().replace(/\//g, '\\').replace(bn, '$1\\')), t === e)
    }
  },
  Ve = class i extends J {
    static {
      o(this, 'PathPosix')
    }
    splitSep = '/'
    sep = '/'
    constructor(t, e = nt, s, r, n, a, h) {
      super(t, e, s, r, n, a, h)
    }
    getRootString(t) {
      return t.startsWith('/') ? '/' : ''
    }
    getRoot(t) {
      return this.root
    }
    newChild(t, e = nt, s = {}) {
      return new i(t, e, this.root, this.roots, this.nocase, this.childrenCache(), s)
    }
  },
  Ke = class {
    static {
      o(this, 'PathScurryBase')
    }
    root
    rootPath
    roots
    cwd
    #t
    #e
    #n
    nocase
    #r
    constructor(t = process.cwd(), e, s, { nocase: r, childrenCacheSize: n = 16 * 1024, fs: a = me } = {}) {
      ;((this.#r = Sn(a)), (t instanceof URL || t.startsWith('file://')) && (t = (0, gn.fileURLToPath)(t)))
      let h = e.resolve(t)
      ;((this.roots = Object.create(null)),
        (this.rootPath = this.parseRootPath(h)),
        (this.#t = new Je()),
        (this.#e = new Je()),
        (this.#n = new Ai(n)))
      let c = h.substring(this.rootPath.length).split(s)
      if ((c.length === 1 && !c[0] && c.pop(), r === void 0))
        throw new TypeError('must provide nocase setting to PathScurryBase ctor')
      ;((this.nocase = r), (this.root = this.newRoot(this.#r)), (this.roots[this.rootPath] = this.root))
      let f = this.root,
        l = c.length - 1,
        u = e.sep,
        p = this.rootPath,
        d = !1
      for (let w of c) {
        let m = l--
        ;((f = f.child(w, {
          relative: new Array(m).fill('..').join(u),
          relativePosix: new Array(m).fill('..').join('/'),
          fullpath: (p += (d ? '' : u) + w),
        })),
          (d = !0))
      }
      this.cwd = f
    }
    depth(t = this.cwd) {
      return (typeof t == 'string' && (t = this.cwd.resolve(t)), t.depth())
    }
    childrenCache() {
      return this.#n
    }
    resolve(...t) {
      let e = ''
      for (let n = t.length - 1; n >= 0; n--) {
        let a = t[n]
        if (!(!a || a === '.') && ((e = e ? `${a}/${e}` : a), this.isAbsolute(a))) break
      }
      let s = this.#t.get(e)
      if (s !== void 0) return s
      let r = this.cwd.resolve(e).fullpath()
      return (this.#t.set(e, r), r)
    }
    resolvePosix(...t) {
      let e = ''
      for (let n = t.length - 1; n >= 0; n--) {
        let a = t[n]
        if (!(!a || a === '.') && ((e = e ? `${a}/${e}` : a), this.isAbsolute(a))) break
      }
      let s = this.#e.get(e)
      if (s !== void 0) return s
      let r = this.cwd.resolve(e).fullpathPosix()
      return (this.#e.set(e, r), r)
    }
    relative(t = this.cwd) {
      return (typeof t == 'string' && (t = this.cwd.resolve(t)), t.relative())
    }
    relativePosix(t = this.cwd) {
      return (typeof t == 'string' && (t = this.cwd.resolve(t)), t.relativePosix())
    }
    basename(t = this.cwd) {
      return (typeof t == 'string' && (t = this.cwd.resolve(t)), t.name)
    }
    dirname(t = this.cwd) {
      return (typeof t == 'string' && (t = this.cwd.resolve(t)), (t.parent || t).fullpath())
    }
    async readdir(t = this.cwd, e = { withFileTypes: !0 }) {
      typeof t == 'string' ? (t = this.cwd.resolve(t)) : t instanceof J || ((e = t), (t = this.cwd))
      let { withFileTypes: s } = e
      if (t.canReaddir()) {
        let r = await t.readdir()
        return s ? r : r.map((n) => n.name)
      } else return []
    }
    readdirSync(t = this.cwd, e = { withFileTypes: !0 }) {
      typeof t == 'string' ? (t = this.cwd.resolve(t)) : t instanceof J || ((e = t), (t = this.cwd))
      let { withFileTypes: s = !0 } = e
      return t.canReaddir() ? (s ? t.readdirSync() : t.readdirSync().map((r) => r.name)) : []
    }
    async lstat(t = this.cwd) {
      return (typeof t == 'string' && (t = this.cwd.resolve(t)), t.lstat())
    }
    lstatSync(t = this.cwd) {
      return (typeof t == 'string' && (t = this.cwd.resolve(t)), t.lstatSync())
    }
    async readlink(t = this.cwd, { withFileTypes: e } = { withFileTypes: !1 }) {
      typeof t == 'string' ? (t = this.cwd.resolve(t)) : t instanceof J || ((e = t.withFileTypes), (t = this.cwd))
      let s = await t.readlink()
      return e ? s : s?.fullpath()
    }
    readlinkSync(t = this.cwd, { withFileTypes: e } = { withFileTypes: !1 }) {
      typeof t == 'string' ? (t = this.cwd.resolve(t)) : t instanceof J || ((e = t.withFileTypes), (t = this.cwd))
      let s = t.readlinkSync()
      return e ? s : s?.fullpath()
    }
    async realpath(t = this.cwd, { withFileTypes: e } = { withFileTypes: !1 }) {
      typeof t == 'string' ? (t = this.cwd.resolve(t)) : t instanceof J || ((e = t.withFileTypes), (t = this.cwd))
      let s = await t.realpath()
      return e ? s : s?.fullpath()
    }
    realpathSync(t = this.cwd, { withFileTypes: e } = { withFileTypes: !1 }) {
      typeof t == 'string' ? (t = this.cwd.resolve(t)) : t instanceof J || ((e = t.withFileTypes), (t = this.cwd))
      let s = t.realpathSync()
      return e ? s : s?.fullpath()
    }
    async walk(t = this.cwd, e = {}) {
      typeof t == 'string' ? (t = this.cwd.resolve(t)) : t instanceof J || ((e = t), (t = this.cwd))
      let { withFileTypes: s = !0, follow: r = !1, filter: n, walkFilter: a } = e,
        h = []
      ;(!n || n(t)) && h.push(s ? t : t.fullpath())
      let c = new Set(),
        f = o((u, p) => {
          ;(c.add(u),
            u.readdirCB((d, w) => {
              if (d) return p(d)
              let m = w.length
              if (!m) return p()
              let g = o(() => {
                --m === 0 && p()
              }, 'next')
              for (let y of w)
                ((!n || n(y)) && h.push(s ? y : y.fullpath()),
                  r && y.isSymbolicLink()
                    ? y
                        .realpath()
                        .then((v) => (v?.isUnknown() ? v.lstat() : v))
                        .then((v) => (v?.shouldWalk(c, a) ? f(v, g) : g()))
                    : y.shouldWalk(c, a)
                      ? f(y, g)
                      : g())
            }, !0))
        }, 'walk'),
        l = t
      return new Promise((u, p) => {
        f(l, (d) => {
          if (d) return p(d)
          u(h)
        })
      })
    }
    walkSync(t = this.cwd, e = {}) {
      typeof t == 'string' ? (t = this.cwd.resolve(t)) : t instanceof J || ((e = t), (t = this.cwd))
      let { withFileTypes: s = !0, follow: r = !1, filter: n, walkFilter: a } = e,
        h = []
      ;(!n || n(t)) && h.push(s ? t : t.fullpath())
      let c = new Set([t])
      for (let f of c) {
        let l = f.readdirSync()
        for (let u of l) {
          ;(!n || n(u)) && h.push(s ? u : u.fullpath())
          let p = u
          if (u.isSymbolicLink()) {
            if (!(r && (p = u.realpathSync()))) continue
            p.isUnknown() && p.lstatSync()
          }
          p.shouldWalk(c, a) && c.add(p)
        }
      }
      return h
    }
    [Symbol.asyncIterator]() {
      return this.iterate()
    }
    iterate(t = this.cwd, e = {}) {
      return (
        typeof t == 'string' ? (t = this.cwd.resolve(t)) : t instanceof J || ((e = t), (t = this.cwd)),
        this.stream(t, e)[Symbol.asyncIterator]()
      )
    }
    [Symbol.iterator]() {
      return this.iterateSync()
    }
    *iterateSync(t = this.cwd, e = {}) {
      typeof t == 'string' ? (t = this.cwd.resolve(t)) : t instanceof J || ((e = t), (t = this.cwd))
      let { withFileTypes: s = !0, follow: r = !1, filter: n, walkFilter: a } = e
      ;(!n || n(t)) && (yield s ? t : t.fullpath())
      let h = new Set([t])
      for (let c of h) {
        let f = c.readdirSync()
        for (let l of f) {
          ;(!n || n(l)) && (yield s ? l : l.fullpath())
          let u = l
          if (l.isSymbolicLink()) {
            if (!(r && (u = l.realpathSync()))) continue
            u.isUnknown() && u.lstatSync()
          }
          u.shouldWalk(h, a) && h.add(u)
        }
      }
    }
    stream(t = this.cwd, e = {}) {
      typeof t == 'string' ? (t = this.cwd.resolve(t)) : t instanceof J || ((e = t), (t = this.cwd))
      let { withFileTypes: s = !0, follow: r = !1, filter: n, walkFilter: a } = e,
        h = new Ct({ objectMode: !0 })
      ;(!n || n(t)) && h.write(s ? t : t.fullpath())
      let c = new Set(),
        f = [t],
        l = 0,
        u = o(() => {
          let p = !1
          for (; !p; ) {
            let d = f.shift()
            if (!d) {
              l === 0 && h.end()
              return
            }
            ;(l++, c.add(d))
            let w = o((g, y, v = !1) => {
                if (g) return h.emit('error', g)
                if (r && !v) {
                  let S = []
                  for (let b of y)
                    b.isSymbolicLink() && S.push(b.realpath().then((C) => (C?.isUnknown() ? C.lstat() : C)))
                  if (S.length) {
                    Promise.all(S).then(() => w(null, y, !0))
                    return
                  }
                }
                for (let S of y) S && (!n || n(S)) && (h.write(s ? S : S.fullpath()) || (p = !0))
                l--
                for (let S of y) {
                  let b = S.realpathCached() || S
                  b.shouldWalk(c, a) && f.push(b)
                }
                p && !h.flowing ? h.once('drain', u) : m || u()
              }, 'onReaddir'),
              m = !0
            ;(d.readdirCB(w, !0), (m = !1))
          }
        }, 'process')
      return (u(), h)
    }
    streamSync(t = this.cwd, e = {}) {
      typeof t == 'string' ? (t = this.cwd.resolve(t)) : t instanceof J || ((e = t), (t = this.cwd))
      let { withFileTypes: s = !0, follow: r = !1, filter: n, walkFilter: a } = e,
        h = new Ct({ objectMode: !0 }),
        c = new Set()
      ;(!n || n(t)) && h.write(s ? t : t.fullpath())
      let f = [t],
        l = 0,
        u = o(() => {
          let p = !1
          for (; !p; ) {
            let d = f.shift()
            if (!d) {
              l === 0 && h.end()
              return
            }
            ;(l++, c.add(d))
            let w = d.readdirSync()
            for (let m of w) (!n || n(m)) && (h.write(s ? m : m.fullpath()) || (p = !0))
            l--
            for (let m of w) {
              let g = m
              if (m.isSymbolicLink()) {
                if (!(r && (g = m.realpathSync()))) continue
                g.isUnknown() && g.lstatSync()
              }
              g.shouldWalk(c, a) && f.push(g)
            }
          }
          p && !h.flowing && h.once('drain', u)
        }, 'process')
      return (u(), h)
    }
    chdir(t = this.cwd) {
      let e = this.cwd
      ;((this.cwd = typeof t == 'string' ? this.cwd.resolve(t) : t), this.cwd[On](e))
    }
  },
  Jt = class extends Ke {
    static {
      o(this, 'PathScurryWin32')
    }
    sep = '\\'
    constructor(t = process.cwd(), e = {}) {
      let { nocase: s = !0 } = e
      ;(super(t, Gt.win32, '\\', { ...e, nocase: s }), (this.nocase = s))
      for (let r = this.cwd; r; r = r.parent) r.nocase = this.nocase
    }
    parseRootPath(t) {
      return Gt.win32.parse(t).root.toUpperCase()
    }
    newRoot(t) {
      return new He(this.rootPath, dt, void 0, this.roots, this.nocase, this.childrenCache(), { fs: t })
    }
    isAbsolute(t) {
      return t.startsWith('/') || t.startsWith('\\') || /^[a-z]:(\/|\\)/i.test(t)
    }
  },
  Ht = class extends Ke {
    static {
      o(this, 'PathScurryPosix')
    }
    sep = '/'
    constructor(t = process.cwd(), e = {}) {
      let { nocase: s = !1 } = e
      ;(super(t, Gt.posix, '/', { ...e, nocase: s }), (this.nocase = s))
    }
    parseRootPath(t) {
      return '/'
    }
    newRoot(t) {
      return new Ve(this.rootPath, dt, void 0, this.roots, this.nocase, this.childrenCache(), { fs: t })
    }
    isAbsolute(t) {
      return t.startsWith('/')
    }
  },
  ge = class extends Ht {
    static {
      o(this, 'PathScurryDarwin')
    }
    constructor(t = process.cwd(), e = {}) {
      let { nocase: s = !0 } = e
      super(t, { ...e, nocase: s })
    }
  },
  vu = process.platform === 'win32' ? He : Ve,
  Cn = process.platform === 'win32' ? Jt : process.platform === 'darwin' ? ge : Ht
var lc = o((i) => i.length >= 1, 'isPatternList'),
  uc = o((i) => i.length >= 1, 'isGlobList'),
  Vt = class i {
    static {
      o(this, 'Pattern')
    }
    #t
    #e
    #n
    length
    #r
    #o
    #b
    #y
    #a
    #u
    #h = !0
    constructor(t, e, s, r) {
      if (!lc(t)) throw new TypeError('empty pattern list')
      if (!uc(e)) throw new TypeError('empty glob list')
      if (e.length !== t.length) throw new TypeError('mismatched pattern list and glob list lengths')
      if (((this.length = t.length), s < 0 || s >= this.length)) throw new TypeError('index out of range')
      if (((this.#t = t), (this.#e = e), (this.#n = s), (this.#r = r), this.#n === 0)) {
        if (this.isUNC()) {
          let [n, a, h, c, ...f] = this.#t,
            [l, u, p, d, ...w] = this.#e
          f[0] === '' && (f.shift(), w.shift())
          let m = [n, a, h, c, ''].join('/'),
            g = [l, u, p, d, ''].join('/')
          ;((this.#t = [m, ...f]), (this.#e = [g, ...w]), (this.length = this.#t.length))
        } else if (this.isDrive() || this.isAbsolute()) {
          let [n, ...a] = this.#t,
            [h, ...c] = this.#e
          a[0] === '' && (a.shift(), c.shift())
          let f = n + '/',
            l = h + '/'
          ;((this.#t = [f, ...a]), (this.#e = [l, ...c]), (this.length = this.#t.length))
        }
      }
    }
    pattern() {
      return this.#t[this.#n]
    }
    isString() {
      return typeof this.#t[this.#n] == 'string'
    }
    isGlobstar() {
      return this.#t[this.#n] === z
    }
    isRegExp() {
      return this.#t[this.#n] instanceof RegExp
    }
    globString() {
      return (this.#b =
        this.#b ||
        (this.#n === 0
          ? this.isAbsolute()
            ? this.#e[0] + this.#e.slice(1).join('/')
            : this.#e.join('/')
          : this.#e.slice(this.#n).join('/')))
    }
    hasMore() {
      return this.length > this.#n + 1
    }
    rest() {
      return this.#o !== void 0
        ? this.#o
        : this.hasMore()
          ? ((this.#o = new i(this.#t, this.#e, this.#n + 1, this.#r)),
            (this.#o.#u = this.#u),
            (this.#o.#a = this.#a),
            (this.#o.#y = this.#y),
            this.#o)
          : (this.#o = null)
    }
    isUNC() {
      let t = this.#t
      return this.#a !== void 0
        ? this.#a
        : (this.#a =
            this.#r === 'win32' &&
            this.#n === 0 &&
            t[0] === '' &&
            t[1] === '' &&
            typeof t[2] == 'string' &&
            !!t[2] &&
            typeof t[3] == 'string' &&
            !!t[3])
    }
    isDrive() {
      let t = this.#t
      return this.#y !== void 0
        ? this.#y
        : (this.#y =
            this.#r === 'win32' &&
            this.#n === 0 &&
            this.length > 1 &&
            typeof t[0] == 'string' &&
            /^[a-z]:$/i.test(t[0]))
    }
    isAbsolute() {
      let t = this.#t
      return this.#u !== void 0
        ? this.#u
        : (this.#u = (t[0] === '' && t.length > 1) || this.isDrive() || this.isUNC())
    }
    root() {
      let t = this.#t[0]
      return typeof t == 'string' && this.isAbsolute() && this.#n === 0 ? t : ''
    }
    checkFollowGlobstar() {
      return !(this.#n === 0 || !this.isGlobstar() || !this.#h)
    }
    markFollowGlobstar() {
      return this.#n === 0 || !this.isGlobstar() || !this.#h ? !1 : ((this.#h = !1), !0)
    }
  }
var fc = typeof process == 'object' && process && typeof process.platform == 'string' ? process.platform : 'linux',
  Kt = class {
    static {
      o(this, 'Ignore')
    }
    relative
    relativeChildren
    absolute
    absoluteChildren
    platform
    mmopts
    constructor(t, { nobrace: e, nocase: s, noext: r, noglobstar: n, platform: a = fc }) {
      ;((this.relative = []),
        (this.absolute = []),
        (this.relativeChildren = []),
        (this.absoluteChildren = []),
        (this.platform = a),
        (this.mmopts = {
          dot: !0,
          nobrace: e,
          nocase: s,
          noext: r,
          noglobstar: n,
          optimizationLevel: 2,
          platform: a,
          nocomment: !0,
          nonegate: !0,
        }))
      for (let h of t) this.add(h)
    }
    add(t) {
      let e = new et(t, this.mmopts)
      for (let s = 0; s < e.set.length; s++) {
        let r = e.set[s],
          n = e.globParts[s]
        if (!r || !n) throw new Error('invalid pattern object')
        for (; r[0] === '.' && n[0] === '.'; ) (r.shift(), n.shift())
        let a = new Vt(r, n, 0, this.platform),
          h = new et(a.globString(), this.mmopts),
          c = n[n.length - 1] === '**',
          f = a.isAbsolute()
        ;(f ? this.absolute.push(h) : this.relative.push(h),
          c && (f ? this.absoluteChildren.push(h) : this.relativeChildren.push(h)))
      }
    }
    ignored(t) {
      let e = t.fullpath(),
        s = `${e}/`,
        r = t.relative() || '.',
        n = `${r}/`
      for (let a of this.relative) if (a.match(r) || a.match(n)) return !0
      for (let a of this.absolute) if (a.match(e) || a.match(s)) return !0
      return !1
    }
    childrenIgnored(t) {
      let e = t.fullpath() + '/',
        s = (t.relative() || '.') + '/'
      for (let r of this.relativeChildren) if (r.match(s)) return !0
      for (let r of this.absoluteChildren) if (r.match(e)) return !0
      return !1
    }
  }
var _i = class i {
    static {
      o(this, 'HasWalkedCache')
    }
    store
    constructor(t = new Map()) {
      this.store = t
    }
    copy() {
      return new i(new Map(this.store))
    }
    hasWalked(t, e) {
      return this.store.get(t.fullpath())?.has(e.globString())
    }
    storeWalked(t, e) {
      let s = t.fullpath(),
        r = this.store.get(s)
      r ? r.add(e.globString()) : this.store.set(s, new Set([e.globString()]))
    }
  },
  Mi = class {
    static {
      o(this, 'MatchRecord')
    }
    store = new Map()
    add(t, e, s) {
      let r = (e ? 2 : 0) | (s ? 1 : 0),
        n = this.store.get(t)
      this.store.set(t, n === void 0 ? r : r & n)
    }
    entries() {
      return [...this.store.entries()].map(([t, e]) => [t, !!(e & 2), !!(e & 1)])
    }
  },
  Li = class {
    static {
      o(this, 'SubWalks')
    }
    store = new Map()
    add(t, e) {
      if (!t.canReaddir()) return
      let s = this.store.get(t)
      s ? s.find((r) => r.globString() === e.globString()) || s.push(e) : this.store.set(t, [e])
    }
    get(t) {
      let e = this.store.get(t)
      if (!e) throw new Error('attempting to walk unknown path')
      return e
    }
    entries() {
      return this.keys().map((t) => [t, this.store.get(t)])
    }
    keys() {
      return [...this.store.keys()].filter((t) => t.canReaddir())
    }
  },
  Se = class i {
    static {
      o(this, 'Processor')
    }
    hasWalkedCache
    matches = new Mi()
    subwalks = new Li()
    patterns
    follow
    dot
    opts
    constructor(t, e) {
      ;((this.opts = t),
        (this.follow = !!t.follow),
        (this.dot = !!t.dot),
        (this.hasWalkedCache = e ? e.copy() : new _i()))
    }
    processPatterns(t, e) {
      this.patterns = e
      let s = e.map((r) => [t, r])
      for (let [r, n] of s) {
        this.hasWalkedCache.storeWalked(r, n)
        let a = n.root(),
          h = n.isAbsolute() && this.opts.absolute !== !1
        if (a) {
          r = r.resolve(a === '/' && this.opts.root !== void 0 ? this.opts.root : a)
          let u = n.rest()
          if (u) n = u
          else {
            this.matches.add(r, !0, !1)
            continue
          }
        }
        if (r.isENOENT()) continue
        let c,
          f,
          l = !1
        for (; typeof (c = n.pattern()) == 'string' && (f = n.rest()); ) ((r = r.resolve(c)), (n = f), (l = !0))
        if (((c = n.pattern()), (f = n.rest()), l)) {
          if (this.hasWalkedCache.hasWalked(r, n)) continue
          this.hasWalkedCache.storeWalked(r, n)
        }
        if (typeof c == 'string') {
          let u = c === '..' || c === '' || c === '.'
          this.matches.add(r.resolve(c), h, u)
          continue
        } else if (c === z) {
          ;(!r.isSymbolicLink() || this.follow || n.checkFollowGlobstar()) && this.subwalks.add(r, n)
          let u = f?.pattern(),
            p = f?.rest()
          if (!f || ((u === '' || u === '.') && !p)) this.matches.add(r, h, u === '' || u === '.')
          else if (u === '..') {
            let d = r.parent || r
            p ? this.hasWalkedCache.hasWalked(d, p) || this.subwalks.add(d, p) : this.matches.add(d, h, !0)
          }
        } else c instanceof RegExp && this.subwalks.add(r, n)
      }
      return this
    }
    subwalkTargets() {
      return this.subwalks.keys()
    }
    child() {
      return new i(this.opts, this.hasWalkedCache)
    }
    filterEntries(t, e) {
      let s = this.subwalks.get(t),
        r = this.child()
      for (let n of e)
        for (let a of s) {
          let h = a.isAbsolute(),
            c = a.pattern(),
            f = a.rest()
          c === z
            ? r.testGlobstar(n, a, f, h)
            : c instanceof RegExp
              ? r.testRegExp(n, c, f, h)
              : r.testString(n, c, f, h)
        }
      return r
    }
    testGlobstar(t, e, s, r) {
      if (
        ((this.dot || !t.name.startsWith('.')) &&
          (e.hasMore() || this.matches.add(t, r, !1),
          t.canReaddir() &&
            (this.follow || !t.isSymbolicLink()
              ? this.subwalks.add(t, e)
              : t.isSymbolicLink() &&
                (s && e.checkFollowGlobstar()
                  ? this.subwalks.add(t, s)
                  : e.markFollowGlobstar() && this.subwalks.add(t, e)))),
        s)
      ) {
        let n = s.pattern()
        if (typeof n == 'string' && n !== '..' && n !== '' && n !== '.') this.testString(t, n, s.rest(), r)
        else if (n === '..') {
          let a = t.parent || t
          this.subwalks.add(a, s)
        } else n instanceof RegExp && this.testRegExp(t, n, s.rest(), r)
      }
    }
    testRegExp(t, e, s, r) {
      e.test(t.name) && (s ? this.subwalks.add(t, s) : this.matches.add(t, r, !1))
    }
    testString(t, e, s, r) {
      t.isNamed(e) && (s ? this.subwalks.add(t, s) : this.matches.add(t, r, !1))
    }
  }
var dc = o((i, t) => (typeof i == 'string' ? new Kt([i], t) : Array.isArray(i) ? new Kt(i, t) : i), 'makeIgnore'),
  Ye = class {
    static {
      o(this, 'GlobUtil')
    }
    path
    patterns
    opts
    seen = new Set()
    paused = !1
    aborted = !1
    #t = []
    #e
    #n
    signal
    maxDepth
    includeChildMatches
    constructor(t, e, s) {
      if (
        ((this.patterns = t),
        (this.path = e),
        (this.opts = s),
        (this.#n = !s.posix && s.platform === 'win32' ? '\\' : '/'),
        (this.includeChildMatches = s.includeChildMatches !== !1),
        (s.ignore || !this.includeChildMatches) &&
          ((this.#e = dc(s.ignore ?? [], s)), !this.includeChildMatches && typeof this.#e.add != 'function'))
      ) {
        let r = 'cannot ignore child matches, ignore lacks add() method.'
        throw new Error(r)
      }
      ;((this.maxDepth = s.maxDepth || 1 / 0),
        s.signal &&
          ((this.signal = s.signal),
          this.signal.addEventListener('abort', () => {
            this.#t.length = 0
          })))
    }
    #r(t) {
      return this.seen.has(t) || !!this.#e?.ignored?.(t)
    }
    #o(t) {
      return !!this.#e?.childrenIgnored?.(t)
    }
    pause() {
      this.paused = !0
    }
    resume() {
      if (this.signal?.aborted) return
      this.paused = !1
      let t
      for (; !this.paused && (t = this.#t.shift()); ) t()
    }
    onResume(t) {
      this.signal?.aborted || (this.paused ? this.#t.push(t) : t())
    }
    async matchCheck(t, e) {
      if (e && this.opts.nodir) return
      let s
      if (this.opts.realpath) {
        if (((s = t.realpathCached() || (await t.realpath())), !s)) return
        t = s
      }
      let n = t.isUnknown() || this.opts.stat ? await t.lstat() : t
      if (this.opts.follow && this.opts.nodir && n?.isSymbolicLink()) {
        let a = await n.realpath()
        a && (a.isUnknown() || this.opts.stat) && (await a.lstat())
      }
      return this.matchCheckTest(n, e)
    }
    matchCheckTest(t, e) {
      return t &&
        (this.maxDepth === 1 / 0 || t.depth() <= this.maxDepth) &&
        (!e || t.canReaddir()) &&
        (!this.opts.nodir || !t.isDirectory()) &&
        (!this.opts.nodir || !this.opts.follow || !t.isSymbolicLink() || !t.realpathCached()?.isDirectory()) &&
        !this.#r(t)
        ? t
        : void 0
    }
    matchCheckSync(t, e) {
      if (e && this.opts.nodir) return
      let s
      if (this.opts.realpath) {
        if (((s = t.realpathCached() || t.realpathSync()), !s)) return
        t = s
      }
      let n = t.isUnknown() || this.opts.stat ? t.lstatSync() : t
      if (this.opts.follow && this.opts.nodir && n?.isSymbolicLink()) {
        let a = n.realpathSync()
        a && (a?.isUnknown() || this.opts.stat) && a.lstatSync()
      }
      return this.matchCheckTest(n, e)
    }
    matchFinish(t, e) {
      if (this.#r(t)) return
      if (!this.includeChildMatches && this.#e?.add) {
        let n = `${t.relativePosix()}/**`
        this.#e.add(n)
      }
      let s = this.opts.absolute === void 0 ? e : this.opts.absolute
      this.seen.add(t)
      let r = this.opts.mark && t.isDirectory() ? this.#n : ''
      if (this.opts.withFileTypes) this.matchEmit(t)
      else if (s) {
        let n = this.opts.posix ? t.fullpathPosix() : t.fullpath()
        this.matchEmit(n + r)
      } else {
        let n = this.opts.posix ? t.relativePosix() : t.relative(),
          a = this.opts.dotRelative && !n.startsWith('..' + this.#n) ? '.' + this.#n : ''
        this.matchEmit(n ? a + n + r : '.' + r)
      }
    }
    async match(t, e, s) {
      let r = await this.matchCheck(t, s)
      r && this.matchFinish(r, e)
    }
    matchSync(t, e, s) {
      let r = this.matchCheckSync(t, s)
      r && this.matchFinish(r, e)
    }
    walkCB(t, e, s) {
      ;(this.signal?.aborted && s(), this.walkCB2(t, e, new Se(this.opts), s))
    }
    walkCB2(t, e, s, r) {
      if (this.#o(t)) return r()
      if ((this.signal?.aborted && r(), this.paused)) {
        this.onResume(() => this.walkCB2(t, e, s, r))
        return
      }
      s.processPatterns(t, e)
      let n = 1,
        a = o(() => {
          --n === 0 && r()
        }, 'next')
      for (let [h, c, f] of s.matches.entries()) this.#r(h) || (n++, this.match(h, c, f).then(() => a()))
      for (let h of s.subwalkTargets()) {
        if (this.maxDepth !== 1 / 0 && h.depth() >= this.maxDepth) continue
        n++
        let c = h.readdirCached()
        h.calledReaddir() ? this.walkCB3(h, c, s, a) : h.readdirCB((f, l) => this.walkCB3(h, l, s, a), !0)
      }
      a()
    }
    walkCB3(t, e, s, r) {
      s = s.filterEntries(t, e)
      let n = 1,
        a = o(() => {
          --n === 0 && r()
        }, 'next')
      for (let [h, c, f] of s.matches.entries()) this.#r(h) || (n++, this.match(h, c, f).then(() => a()))
      for (let [h, c] of s.subwalks.entries()) (n++, this.walkCB2(h, c, s.child(), a))
      a()
    }
    walkCBSync(t, e, s) {
      ;(this.signal?.aborted && s(), this.walkCB2Sync(t, e, new Se(this.opts), s))
    }
    walkCB2Sync(t, e, s, r) {
      if (this.#o(t)) return r()
      if ((this.signal?.aborted && r(), this.paused)) {
        this.onResume(() => this.walkCB2Sync(t, e, s, r))
        return
      }
      s.processPatterns(t, e)
      let n = 1,
        a = o(() => {
          --n === 0 && r()
        }, 'next')
      for (let [h, c, f] of s.matches.entries()) this.#r(h) || this.matchSync(h, c, f)
      for (let h of s.subwalkTargets()) {
        if (this.maxDepth !== 1 / 0 && h.depth() >= this.maxDepth) continue
        n++
        let c = h.readdirSync()
        this.walkCB3Sync(h, c, s, a)
      }
      a()
    }
    walkCB3Sync(t, e, s, r) {
      s = s.filterEntries(t, e)
      let n = 1,
        a = o(() => {
          --n === 0 && r()
        }, 'next')
      for (let [h, c, f] of s.matches.entries()) this.#r(h) || this.matchSync(h, c, f)
      for (let [h, c] of s.subwalks.entries()) (n++, this.walkCB2Sync(h, c, s.child(), a))
      a()
    }
  },
  be = class extends Ye {
    static {
      o(this, 'GlobWalker')
    }
    matches = new Set()
    constructor(t, e, s) {
      super(t, e, s)
    }
    matchEmit(t) {
      this.matches.add(t)
    }
    async walk() {
      if (this.signal?.aborted) throw this.signal.reason
      return (
        this.path.isUnknown() && (await this.path.lstat()),
        await new Promise((t, e) => {
          this.walkCB(this.path, this.patterns, () => {
            this.signal?.aborted ? e(this.signal.reason) : t(this.matches)
          })
        }),
        this.matches
      )
    }
    walkSync() {
      if (this.signal?.aborted) throw this.signal.reason
      return (
        this.path.isUnknown() && this.path.lstatSync(),
        this.walkCBSync(this.path, this.patterns, () => {
          if (this.signal?.aborted) throw this.signal.reason
        }),
        this.matches
      )
    }
  },
  Ee = class extends Ye {
    static {
      o(this, 'GlobStream')
    }
    results
    constructor(t, e, s) {
      ;(super(t, e, s),
        (this.results = new Ct({ signal: this.signal, objectMode: !0 })),
        this.results.on('drain', () => this.resume()),
        this.results.on('resume', () => this.resume()))
    }
    matchEmit(t) {
      ;(this.results.write(t), this.results.flowing || this.pause())
    }
    stream() {
      let t = this.path
      return (
        t.isUnknown()
          ? t.lstat().then(() => {
              this.walkCB(t, this.patterns, () => this.results.end())
            })
          : this.walkCB(t, this.patterns, () => this.results.end()),
        this.results
      )
    }
    streamSync() {
      return (
        this.path.isUnknown() && this.path.lstatSync(),
        this.walkCBSync(this.path, this.patterns, () => this.results.end()),
        this.results
      )
    }
  }
var pc = typeof process == 'object' && process && typeof process.platform == 'string' ? process.platform : 'linux',
  lt = class {
    static {
      o(this, 'Glob')
    }
    absolute
    cwd
    root
    dot
    dotRelative
    follow
    ignore
    magicalBraces
    mark
    matchBase
    maxDepth
    nobrace
    nocase
    nodir
    noext
    noglobstar
    pattern
    platform
    realpath
    scurry
    stat
    signal
    windowsPathsNoEscape
    withFileTypes
    includeChildMatches
    opts
    patterns
    constructor(t, e) {
      if (!e) throw new TypeError('glob options required')
      if (
        ((this.withFileTypes = !!e.withFileTypes),
        (this.signal = e.signal),
        (this.follow = !!e.follow),
        (this.dot = !!e.dot),
        (this.dotRelative = !!e.dotRelative),
        (this.nodir = !!e.nodir),
        (this.mark = !!e.mark),
        e.cwd
          ? (e.cwd instanceof URL || e.cwd.startsWith('file://')) && (e.cwd = (0, Tn.fileURLToPath)(e.cwd))
          : (this.cwd = ''),
        (this.cwd = e.cwd || ''),
        (this.root = e.root),
        (this.magicalBraces = !!e.magicalBraces),
        (this.nobrace = !!e.nobrace),
        (this.noext = !!e.noext),
        (this.realpath = !!e.realpath),
        (this.absolute = e.absolute),
        (this.includeChildMatches = e.includeChildMatches !== !1),
        (this.noglobstar = !!e.noglobstar),
        (this.matchBase = !!e.matchBase),
        (this.maxDepth = typeof e.maxDepth == 'number' ? e.maxDepth : 1 / 0),
        (this.stat = !!e.stat),
        (this.ignore = e.ignore),
        this.withFileTypes && this.absolute !== void 0)
      )
        throw new Error('cannot set absolute and withFileTypes:true')
      if (
        (typeof t == 'string' && (t = [t]),
        (this.windowsPathsNoEscape = !!e.windowsPathsNoEscape || e.allowWindowsEscape === !1),
        this.windowsPathsNoEscape && (t = t.map((c) => c.replace(/\\/g, '/'))),
        this.matchBase)
      ) {
        if (e.noglobstar) throw new TypeError('base matching requires globstar')
        t = t.map((c) => (c.includes('/') ? c : `./**/${c}`))
      }
      if (
        ((this.pattern = t),
        (this.platform = e.platform || pc),
        (this.opts = { ...e, platform: this.platform }),
        e.scurry)
      ) {
        if (((this.scurry = e.scurry), e.nocase !== void 0 && e.nocase !== e.scurry.nocase))
          throw new Error('nocase option contradicts provided scurry option')
      } else {
        let c = e.platform === 'win32' ? Jt : e.platform === 'darwin' ? ge : e.platform ? Ht : Cn
        this.scurry = new c(this.cwd, { nocase: e.nocase, fs: e.fs })
      }
      this.nocase = this.scurry.nocase
      let s = this.platform === 'darwin' || this.platform === 'win32',
        r = {
          ...e,
          dot: this.dot,
          matchBase: this.matchBase,
          nobrace: this.nobrace,
          nocase: this.nocase,
          nocaseMagicOnly: s,
          nocomment: !0,
          noext: this.noext,
          nonegate: !0,
          optimizationLevel: 2,
          platform: this.platform,
          windowsPathsNoEscape: this.windowsPathsNoEscape,
          debug: !!this.opts.debug,
        },
        n = this.pattern.map((c) => new et(c, r)),
        [a, h] = n.reduce((c, f) => (c[0].push(...f.set), c[1].push(...f.globParts), c), [[], []])
      this.patterns = a.map((c, f) => {
        let l = h[f]
        if (!l) throw new Error('invalid pattern object')
        return new Vt(c, l, 0, this.platform)
      })
    }
    async walk() {
      return [
        ...(await new be(this.patterns, this.scurry.cwd, {
          ...this.opts,
          maxDepth: this.maxDepth !== 1 / 0 ? this.maxDepth + this.scurry.cwd.depth() : 1 / 0,
          platform: this.platform,
          nocase: this.nocase,
          includeChildMatches: this.includeChildMatches,
        }).walk()),
      ]
    }
    walkSync() {
      return [
        ...new be(this.patterns, this.scurry.cwd, {
          ...this.opts,
          maxDepth: this.maxDepth !== 1 / 0 ? this.maxDepth + this.scurry.cwd.depth() : 1 / 0,
          platform: this.platform,
          nocase: this.nocase,
          includeChildMatches: this.includeChildMatches,
        }).walkSync(),
      ]
    }
    stream() {
      return new Ee(this.patterns, this.scurry.cwd, {
        ...this.opts,
        maxDepth: this.maxDepth !== 1 / 0 ? this.maxDepth + this.scurry.cwd.depth() : 1 / 0,
        platform: this.platform,
        nocase: this.nocase,
        includeChildMatches: this.includeChildMatches,
      }).stream()
    }
    streamSync() {
      return new Ee(this.patterns, this.scurry.cwd, {
        ...this.opts,
        maxDepth: this.maxDepth !== 1 / 0 ? this.maxDepth + this.scurry.cwd.depth() : 1 / 0,
        platform: this.platform,
        nocase: this.nocase,
        includeChildMatches: this.includeChildMatches,
      }).streamSync()
    }
    iterateSync() {
      return this.streamSync()[Symbol.iterator]()
    }
    [Symbol.iterator]() {
      return this.iterateSync()
    }
    iterate() {
      return this.stream()[Symbol.asyncIterator]()
    }
    [Symbol.asyncIterator]() {
      return this.iterate()
    }
  }
var Wi = o((i, t = {}) => {
  Array.isArray(i) || (i = [i])
  for (let e of i) if (new et(e, t).hasMagic()) return !0
  return !1
}, 'hasMagic')
function Xe(i, t = {}) {
  return new lt(i, t).streamSync()
}
o(Xe, 'globStreamSync')
function Rn(i, t = {}) {
  return new lt(i, t).stream()
}
o(Rn, 'globStream')
function Qe(i, t = {}) {
  return new lt(i, t).walkSync()
}
o(Qe, 'globSync')
async function Dn(i, t = {}) {
  return new lt(i, t).walk()
}
o(Dn, 'glob_')
function Ze(i, t = {}) {
  return new lt(i, t).iterateSync()
}
o(Ze, 'globIterateSync')
function Nn(i, t = {}) {
  return new lt(i, t).iterate()
}
o(Nn, 'globIterate')
var mc = Xe,
  wc = Object.assign(Rn, { sync: Xe }),
  yc = Ze,
  gc = Object.assign(Nn, { sync: Ze }),
  Sc = Object.assign(Qe, { stream: Xe, iterate: Ze }),
  Pn = Object.assign(Dn, {
    glob: Dn,
    globSync: Qe,
    sync: Sc,
    globStream: Rn,
    stream: wc,
    globStreamSync: Xe,
    streamSync: mc,
    globIterate: Nn,
    iterate: gc,
    globIterateSync: Ze,
    iterateSync: yc,
    Glob: lt,
    hasMagic: Wi,
    escape: qt,
    unescape: at,
  })
Pn.glob = Pn
var Gi = At(Bi(), 1)
var ii = At(Bi(), 1),
  Ui = At(yi(), 1)
var vc = o((i, t, e, s) => {
    if (e === 'length' || e === 'prototype' || e === 'arguments' || e === 'caller') return
    let r = Object.getOwnPropertyDescriptor(i, e),
      n = Object.getOwnPropertyDescriptor(t, e)
    ;(!xc(r, n) && s) || Object.defineProperty(i, e, n)
  }, 'copyProperty'),
  xc = o(function (i, t) {
    return (
      i === void 0 ||
      i.configurable ||
      (i.writable === t.writable &&
        i.enumerable === t.enumerable &&
        i.configurable === t.configurable &&
        (i.writable || i.value === t.value))
    )
  }, 'canCopyProperty'),
  kc = o((i, t) => {
    let e = Object.getPrototypeOf(t)
    e !== Object.getPrototypeOf(i) && Object.setPrototypeOf(i, e)
  }, 'changePrototype'),
  Fc = o(
    (i, t) => `/* Wrapped ${i}*/
${t}`,
    'wrappedToString',
  ),
  Oc = Object.getOwnPropertyDescriptor(Function.prototype, 'toString'),
  Cc = Object.getOwnPropertyDescriptor(Function.prototype.toString, 'name'),
  Tc = o((i, t, e) => {
    let s = e === '' ? '' : `with ${e.trim()}() `,
      r = Fc.bind(null, s, t.toString())
    Object.defineProperty(r, 'name', Cc)
    let { writable: n, enumerable: a, configurable: h } = Oc
    Object.defineProperty(i, 'toString', { value: r, writable: n, enumerable: a, configurable: h })
  }, 'changeToString')
function zi(i, t, { ignoreNonConfigurable: e = !1 } = {}) {
  let { name: s } = i
  for (let r of Reflect.ownKeys(t)) vc(i, t, r, e)
  return (kc(i, t), Tc(i, t, s), i)
}
o(zi, 'mimicFunction')
var ei = new WeakMap(),
  Wn = o((i, t = {}) => {
    if (typeof i != 'function') throw new TypeError('Expected a function')
    let e,
      s = 0,
      r = i.displayName || i.name || '<anonymous>',
      n = o(function (...a) {
        if ((ei.set(n, ++s), s === 1)) ((e = i.apply(this, a)), (i = void 0))
        else if (t.throw === !0) throw new Error(`Function \`${r}\` can only be called once`)
        return e
      }, 'onetime')
    return (zi(n, i), ei.set(n, s), n)
  }, 'onetime')
Wn.callCount = (i) => {
  if (!ei.has(i)) throw new Error(`The given function \`${i.name}\` is not wrapped by the \`onetime\` package`)
  return ei.get(i)
}
var jn = Wn
var In = jn(
  o(function () {
    return o(function t(e = process.cwd()) {
      e = ii.default.normalizeSafe(e)
      let s = ii.default.joinSafe(e, 'package.json')
      if (Ui.default.existsSync(s) && Ui.default.readJsonSync(s)?.workspaces) return e
      let r = ii.default.dirname(e)
      if (r !== e) return t(r)
      throw new Error('Could not find repo root from process.cwd(): ' + process.cwd())
    }, 'recurse')()
  }, 'getRepoRootDirpath'),
)
function Dc() {
  let i = In(),
    t = qn.default.readJsonSync(Gi.default.joinSafe(i, 'package.json'))
  if (!t.workspaces) throw new Error(`No workspaces found in package.json at ${i}`)
  return t.workspaces.flatMap((e) => Qe(e)).map(Gi.default.normalizeSafe)
}
o(Dc, 'getWorkspaceDirpaths')
0 && (module.exports = { getWorkspaceDirpaths })

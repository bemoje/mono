'use strict'
var nn = Object.create
var ae = Object.defineProperty
var on = Object.getOwnPropertyDescriptor
var cn = Object.getOwnPropertyNames
var an = Object.getPrototypeOf,
  un = Object.prototype.hasOwnProperty
var o = (e, t) => ae(e, 'name', { value: t, configurable: !0 })
var d = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports),
  sn = (e, t) => {
    for (var r in t) ae(e, r, { get: t[r], enumerable: !0 })
  },
  Ze = (e, t, r, n) => {
    if ((t && typeof t == 'object') || typeof t == 'function')
      for (let i of cn(t))
        !un.call(e, i) && i !== r && ae(e, i, { get: () => t[i], enumerable: !(n = on(t, i)) || n.enumerable })
    return e
  }
var et = (e, t, r) => (
    (r = e != null ? nn(an(e)) : {}),
    Ze(t || !e || !e.__esModule ? ae(r, 'default', { value: e, enumerable: !0 }) : r, e)
  ),
  fn = (e) => Ze(ae({}, '__esModule', { value: !0 }), e)
var ot = d((it) => {
  'use strict'
  var Ce = '2.0.1',
    tt,
    we,
    rt,
    Te,
    Le,
    Z,
    se,
    ue,
    je,
    ee,
    $,
    nt = [].slice,
    ln =
      [].indexOf ||
      function (e) {
        for (var t = 0, r = this.length; t < r; t++) if (t in this && this[t] === e) return t
        return -1
      },
    yn = {}.hasOwnProperty
  se = require('path')
  rt = o(function (e) {
    return typeof e == 'function'
  }, 'isFunction')
  Te = o(function (e) {
    return (
      typeof e == 'string' ||
      (!!e && typeof e == 'object' && Object.prototype.toString.call(e) === '[object String]')
    )
  }, 'isString')
  $ = it
  $.VERSION = typeof Ce < 'u' && Ce !== null ? Ce : 'NO-VERSION'
  ee = o(function (e) {
    return ((e = e.replace(/\\/g, '/')), (e = e.replace(/(?<!^)\/+/g, '/')), e)
  }, 'toUnix')
  for (ue in se)
    ((je = se[ue]),
      rt(je)
        ? ($[ue] = (function (e) {
            return function () {
              var t, r
              return (
                (t = 1 <= arguments.length ? nt.call(arguments, 0) : []),
                (t = t.map(function (n) {
                  return Te(n) ? ee(n) : n
                })),
                (r = se[e].apply(se, t)),
                Te(r) ? ee(r) : r
              )
            }
          })(ue))
        : ($[ue] = je))
  $.sep = '/'
  we = {
    toUnix: ee,
    normalizeSafe: o(function (e) {
      var t
      return (
        (e = ee(e)),
        (t = $.normalize(e)),
        e.startsWith('./') && !t.startsWith('./') && !t.startsWith('..')
          ? (t = './' + t)
          : e.startsWith('//') && !t.startsWith('//') && (e.startsWith('//./') ? (t = '//.' + t) : (t = '/' + t)),
        t
      )
    }, 'normalizeSafe'),
    normalizeTrim: o(function (e) {
      return ((e = $.normalizeSafe(e)), e.endsWith('/') ? e.slice(0, +(e.length - 2) + 1 || 9e9) : e)
    }, 'normalizeTrim'),
    joinSafe: o(function () {
      var e, t, r
      return (
        (e = 1 <= arguments.length ? nt.call(arguments, 0) : []),
        (r = $.join.apply(null, e)),
        e.length > 0 &&
          ((t = ee(e[0])),
          t.startsWith('./') && !r.startsWith('./') && !r.startsWith('..')
            ? (r = './' + r)
            : t.startsWith('//') &&
              !r.startsWith('//') &&
              (t.startsWith('//./') ? (r = '//.' + r) : (r = '/' + r))),
        r
      )
    }, 'joinSafe'),
    addExt: o(function (e, t) {
      return t ? (t[0] !== '.' && (t = '.' + t), e + (e.endsWith(t) ? '' : t)) : e
    }, 'addExt'),
    trimExt: o(function (e, t, r) {
      var n
      return (
        r == null && (r = 7),
        (n = $.extname(e)),
        Le(n, t, r) ? e.slice(0, +(e.length - n.length - 1) + 1 || 9e9) : e
      )
    }, 'trimExt'),
    removeExt: o(function (e, t) {
      return t ? ((t = t[0] === '.' ? t : '.' + t), $.extname(e) === t ? $.trimExt(e, [], t.length) : e) : e
    }, 'removeExt'),
    changeExt: o(function (e, t, r, n) {
      return (n == null && (n = 7), $.trimExt(e, r, n) + (t ? (t[0] === '.' ? t : '.' + t) : ''))
    }, 'changeExt'),
    defaultExt: o(function (e, t, r, n) {
      var i
      return (n == null && (n = 7), (i = $.extname(e)), Le(i, r, n) ? e : $.addExt(e, t))
    }, 'defaultExt'),
  }
  Le = o(function (e, t, r) {
    return (
      t == null && (t = []),
      e &&
        e.length <= r &&
        ln.call(
          t.map(function (n) {
            return (n && n[0] !== '.' ? '.' : '') + n
          }),
          e,
        ) < 0
    )
  }, 'isValidExt')
  for (Z in we)
    if (yn.call(we, Z)) {
      if (((tt = we[Z]), $[Z] !== void 0)) throw new Error('path.' + Z + ' already exists.')
      $[Z] = tt
    }
})
var x = d(($e) => {
  'use strict'
  $e.fromCallback = function (e) {
    return Object.defineProperty(
      function (...t) {
        if (typeof t[t.length - 1] == 'function') e.apply(this, t)
        else
          return new Promise((r, n) => {
            ;(t.push((i, c) => (i != null ? n(i) : r(c))), e.apply(this, t))
          })
      },
      'name',
      { value: e.name },
    )
  }
  $e.fromPromise = function (e) {
    return Object.defineProperty(
      function (...t) {
        let r = t[t.length - 1]
        if (typeof r != 'function') return e.apply(this, t)
        ;(t.pop(), e.apply(this, t).then((n) => r(null, n), r))
      },
      'name',
      { value: e.name },
    )
  }
})
var at = d((Do, ct) => {
  'use strict'
  var G = require('constants'),
    mn = process.cwd,
    Se = null,
    hn = process.env.GRACEFUL_FS_PLATFORM || process.platform
  process.cwd = function () {
    return (Se || (Se = mn.call(process)), Se)
  }
  try {
    process.cwd()
  } catch {}
  typeof process.chdir == 'function' &&
    ((We = process.chdir),
    (process.chdir = function (e) {
      ;((Se = null), We.call(process, e))
    }),
    Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, We))
  var We
  ct.exports = dn
  function dn(e) {
    ;(G.hasOwnProperty('O_SYMLINK') && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e),
      e.lutimes || r(e),
      (e.chown = c(e.chown)),
      (e.fchown = c(e.fchown)),
      (e.lchown = c(e.lchown)),
      (e.chmod = n(e.chmod)),
      (e.fchmod = n(e.fchmod)),
      (e.lchmod = n(e.lchmod)),
      (e.chownSync = a(e.chownSync)),
      (e.fchownSync = a(e.fchownSync)),
      (e.lchownSync = a(e.lchownSync)),
      (e.chmodSync = i(e.chmodSync)),
      (e.fchmodSync = i(e.fchmodSync)),
      (e.lchmodSync = i(e.lchmodSync)),
      (e.stat = f(e.stat)),
      (e.fstat = f(e.fstat)),
      (e.lstat = f(e.lstat)),
      (e.statSync = k(e.statSync)),
      (e.fstatSync = k(e.fstatSync)),
      (e.lstatSync = k(e.lstatSync)),
      e.chmod &&
        !e.lchmod &&
        ((e.lchmod = function (u, h, y) {
          y && process.nextTick(y)
        }),
        (e.lchmodSync = function () {})),
      e.chown &&
        !e.lchown &&
        ((e.lchown = function (u, h, y, s) {
          s && process.nextTick(s)
        }),
        (e.lchownSync = function () {})),
      hn === 'win32' &&
        (e.rename =
          typeof e.rename != 'function'
            ? e.rename
            : (function (u) {
                function h(y, s, m) {
                  var g = Date.now(),
                    S = 0
                  u(
                    y,
                    s,
                    o(function F(J) {
                      if (
                        J &&
                        (J.code === 'EACCES' || J.code === 'EPERM' || J.code === 'EBUSY') &&
                        Date.now() - g < 6e4
                      ) {
                        ;(setTimeout(function () {
                          e.stat(s, function (I, ce) {
                            I && I.code === 'ENOENT' ? u(y, s, F) : m(J)
                          })
                        }, S),
                          S < 100 && (S += 10))
                        return
                      }
                      m && m(J)
                    }, 'CB'),
                  )
                }
                return (o(h, 'rename'), Object.setPrototypeOf && Object.setPrototypeOf(h, u), h)
              })(e.rename)),
      (e.read =
        typeof e.read != 'function'
          ? e.read
          : (function (u) {
              function h(y, s, m, g, S, F) {
                var J
                if (F && typeof F == 'function') {
                  var I = 0
                  J = o(function (ce, Xe, ze) {
                    if (ce && ce.code === 'EAGAIN' && I < 10) return (I++, u.call(e, y, s, m, g, S, J))
                    F.apply(this, arguments)
                  }, 'callback')
                }
                return u.call(e, y, s, m, g, S, J)
              }
              return (o(h, 'read'), Object.setPrototypeOf && Object.setPrototypeOf(h, u), h)
            })(e.read)),
      (e.readSync =
        typeof e.readSync != 'function'
          ? e.readSync
          : (function (u) {
              return function (h, y, s, m, g) {
                for (var S = 0; ; )
                  try {
                    return u.call(e, h, y, s, m, g)
                  } catch (F) {
                    if (F.code === 'EAGAIN' && S < 10) {
                      S++
                      continue
                    }
                    throw F
                  }
              }
            })(e.readSync)))
    function t(u) {
      ;((u.lchmod = function (h, y, s) {
        u.open(h, G.O_WRONLY | G.O_SYMLINK, y, function (m, g) {
          if (m) {
            s && s(m)
            return
          }
          u.fchmod(g, y, function (S) {
            u.close(g, function (F) {
              s && s(S || F)
            })
          })
        })
      }),
        (u.lchmodSync = function (h, y) {
          var s = u.openSync(h, G.O_WRONLY | G.O_SYMLINK, y),
            m = !0,
            g
          try {
            ;((g = u.fchmodSync(s, y)), (m = !1))
          } finally {
            if (m)
              try {
                u.closeSync(s)
              } catch {}
            else u.closeSync(s)
          }
          return g
        }))
    }
    o(t, 'patchLchmod')
    function r(u) {
      G.hasOwnProperty('O_SYMLINK') && u.futimes
        ? ((u.lutimes = function (h, y, s, m) {
            u.open(h, G.O_SYMLINK, function (g, S) {
              if (g) {
                m && m(g)
                return
              }
              u.futimes(S, y, s, function (F) {
                u.close(S, function (J) {
                  m && m(F || J)
                })
              })
            })
          }),
          (u.lutimesSync = function (h, y, s) {
            var m = u.openSync(h, G.O_SYMLINK),
              g,
              S = !0
            try {
              ;((g = u.futimesSync(m, y, s)), (S = !1))
            } finally {
              if (S)
                try {
                  u.closeSync(m)
                } catch {}
              else u.closeSync(m)
            }
            return g
          }))
        : u.futimes &&
          ((u.lutimes = function (h, y, s, m) {
            m && process.nextTick(m)
          }),
          (u.lutimesSync = function () {}))
    }
    o(r, 'patchLutimes')
    function n(u) {
      return (
        u &&
        function (h, y, s) {
          return u.call(e, h, y, function (m) {
            ;(L(m) && (m = null), s && s.apply(this, arguments))
          })
        }
      )
    }
    o(n, 'chmodFix')
    function i(u) {
      return (
        u &&
        function (h, y) {
          try {
            return u.call(e, h, y)
          } catch (s) {
            if (!L(s)) throw s
          }
        }
      )
    }
    o(i, 'chmodFixSync')
    function c(u) {
      return (
        u &&
        function (h, y, s, m) {
          return u.call(e, h, y, s, function (g) {
            ;(L(g) && (g = null), m && m.apply(this, arguments))
          })
        }
      )
    }
    o(c, 'chownFix')
    function a(u) {
      return (
        u &&
        function (h, y, s) {
          try {
            return u.call(e, h, y, s)
          } catch (m) {
            if (!L(m)) throw m
          }
        }
      )
    }
    o(a, 'chownFixSync')
    function f(u) {
      return (
        u &&
        function (h, y, s) {
          typeof y == 'function' && ((s = y), (y = null))
          function m(g, S) {
            ;(S && (S.uid < 0 && (S.uid += 4294967296), S.gid < 0 && (S.gid += 4294967296)),
              s && s.apply(this, arguments))
          }
          return (o(m, 'callback'), y ? u.call(e, h, y, m) : u.call(e, h, m))
        }
      )
    }
    o(f, 'statFix')
    function k(u) {
      return (
        u &&
        function (h, y) {
          var s = y ? u.call(e, h, y) : u.call(e, h)
          return (s && (s.uid < 0 && (s.uid += 4294967296), s.gid < 0 && (s.gid += 4294967296)), s)
        }
      )
    }
    o(k, 'statFixSync')
    function L(u) {
      if (!u || u.code === 'ENOSYS') return !0
      var h = !process.getuid || process.getuid() !== 0
      return !!(h && (u.code === 'EINVAL' || u.code === 'EPERM'))
    }
    o(L, 'chownErOk')
  }
  o(dn, 'patch')
})
var ft = d((Co, st) => {
  'use strict'
  var ut = require('stream').Stream
  st.exports = pn
  function pn(e) {
    return { ReadStream: t, WriteStream: r }
    function t(n, i) {
      if (!(this instanceof t)) return new t(n, i)
      ut.call(this)
      var c = this
      ;((this.path = n),
        (this.fd = null),
        (this.readable = !0),
        (this.paused = !1),
        (this.flags = 'r'),
        (this.mode = 438),
        (this.bufferSize = 64 * 1024),
        (i = i || {}))
      for (var a = Object.keys(i), f = 0, k = a.length; f < k; f++) {
        var L = a[f]
        this[L] = i[L]
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
          c._read()
        })
        return
      }
      e.open(this.path, this.flags, this.mode, function (u, h) {
        if (u) {
          ;(c.emit('error', u), (c.readable = !1))
          return
        }
        ;((c.fd = h), c.emit('open', h), c._read())
      })
    }
    function r(n, i) {
      if (!(this instanceof r)) return new r(n, i)
      ;(ut.call(this),
        (this.path = n),
        (this.fd = null),
        (this.writable = !0),
        (this.flags = 'w'),
        (this.encoding = 'binary'),
        (this.mode = 438),
        (this.bytesWritten = 0),
        (i = i || {}))
      for (var c = Object.keys(i), a = 0, f = c.length; a < f; a++) {
        var k = c[a]
        this[k] = i[k]
      }
      if (this.start !== void 0) {
        if (typeof this.start != 'number') throw TypeError('start must be a Number')
        if (this.start < 0) throw new Error('start must be >= zero')
        this.pos = this.start
      }
      ;((this.busy = !1),
        (this._queue = []),
        this.fd === null &&
          ((this._open = e.open),
          this._queue.push([this._open, this.path, this.flags, this.mode, void 0]),
          this.flush()))
    }
  }
  o(pn, 'legacy')
})
var yt = d((To, lt) => {
  'use strict'
  lt.exports = Sn
  var wn =
    Object.getPrototypeOf ||
    function (e) {
      return e.__proto__
    }
  function Sn(e) {
    if (e === null || typeof e != 'object') return e
    if (e instanceof Object) var t = { __proto__: wn(e) }
    else var t = Object.create(null)
    return (
      Object.getOwnPropertyNames(e).forEach(function (r) {
        Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(e, r))
      }),
      t
    )
  }
  o(Sn, 'clone')
})
var re = d(($o, Re) => {
  'use strict'
  var q = require('fs'),
    vn = at(),
    gn = ft(),
    En = yt(),
    ve = require('util'),
    T,
    Ee
  typeof Symbol == 'function' && typeof Symbol.for == 'function'
    ? ((T = Symbol.for('graceful-fs.queue')), (Ee = Symbol.for('graceful-fs.previous')))
    : ((T = '___graceful-fs.queue'), (Ee = '___graceful-fs.previous'))
  function kn() {}
  o(kn, 'noop')
  function dt(e, t) {
    Object.defineProperty(e, T, {
      get: o(function () {
        return t
      }, 'get'),
    })
  }
  o(dt, 'publishQueue')
  var X = kn
  ve.debuglog
    ? (X = ve.debuglog('gfs4'))
    : /\bgfs4\b/i.test(process.env.NODE_DEBUG || '') &&
      (X = o(function () {
        var e = ve.format.apply(ve, arguments)
        ;((e =
          'GFS4: ' +
          e.split(/\n/).join(`
GFS4: `)),
          console.error(e))
      }, 'debug'))
  q[T] ||
    ((mt = global[T] || []),
    dt(q, mt),
    (q.close = (function (e) {
      function t(r, n) {
        return e.call(q, r, function (i) {
          ;(i || ht(), typeof n == 'function' && n.apply(this, arguments))
        })
      }
      return (o(t, 'close'), Object.defineProperty(t, Ee, { value: e }), t)
    })(q.close)),
    (q.closeSync = (function (e) {
      function t(r) {
        ;(e.apply(q, arguments), ht())
      }
      return (o(t, 'closeSync'), Object.defineProperty(t, Ee, { value: e }), t)
    })(q.closeSync)),
    /\bgfs4\b/i.test(process.env.NODE_DEBUG || '') &&
      process.on('exit', function () {
        ;(X(q[T]), require('assert').equal(q[T].length, 0))
      }))
  var mt
  global[T] || dt(global, q[T])
  Re.exports = Ie(En(q))
  process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !q.__patched && ((Re.exports = Ie(q)), (q.__patched = !0))
  function Ie(e) {
    ;(vn(e), (e.gracefulify = Ie), (e.createReadStream = Xe), (e.createWriteStream = ze))
    var t = e.readFile
    e.readFile = r
    function r(l, w, p) {
      return (typeof w == 'function' && ((p = w), (w = null)), N(l, w, p))
      function N(C, O, b, P) {
        return t(C, O, function (v) {
          v && (v.code === 'EMFILE' || v.code === 'ENFILE')
            ? te([N, [C, O, b], v, P || Date.now(), Date.now()])
            : typeof b == 'function' && b.apply(this, arguments)
        })
      }
      o(N, 'go$readFile')
    }
    o(r, 'readFile')
    var n = e.writeFile
    e.writeFile = i
    function i(l, w, p, N) {
      return (typeof p == 'function' && ((N = p), (p = null)), C(l, w, p, N))
      function C(O, b, P, v, j) {
        return n(O, b, P, function (E) {
          E && (E.code === 'EMFILE' || E.code === 'ENFILE')
            ? te([C, [O, b, P, v], E, j || Date.now(), Date.now()])
            : typeof v == 'function' && v.apply(this, arguments)
        })
      }
      o(C, 'go$writeFile')
    }
    o(i, 'writeFile')
    var c = e.appendFile
    c && (e.appendFile = a)
    function a(l, w, p, N) {
      return (typeof p == 'function' && ((N = p), (p = null)), C(l, w, p, N))
      function C(O, b, P, v, j) {
        return c(O, b, P, function (E) {
          E && (E.code === 'EMFILE' || E.code === 'ENFILE')
            ? te([C, [O, b, P, v], E, j || Date.now(), Date.now()])
            : typeof v == 'function' && v.apply(this, arguments)
        })
      }
      o(C, 'go$appendFile')
    }
    o(a, 'appendFile')
    var f = e.copyFile
    f && (e.copyFile = k)
    function k(l, w, p, N) {
      return (typeof p == 'function' && ((N = p), (p = 0)), C(l, w, p, N))
      function C(O, b, P, v, j) {
        return f(O, b, P, function (E) {
          E && (E.code === 'EMFILE' || E.code === 'ENFILE')
            ? te([C, [O, b, P, v], E, j || Date.now(), Date.now()])
            : typeof v == 'function' && v.apply(this, arguments)
        })
      }
      o(C, 'go$copyFile')
    }
    o(k, 'copyFile')
    var L = e.readdir
    e.readdir = h
    var u = /^v[0-5]\./
    function h(l, w, p) {
      typeof w == 'function' && ((p = w), (w = null))
      var N = u.test(process.version)
        ? o(function (b, P, v, j) {
            return L(b, C(b, P, v, j))
          }, 'go$readdir')
        : o(function (b, P, v, j) {
            return L(b, P, C(b, P, v, j))
          }, 'go$readdir')
      return N(l, w, p)
      function C(O, b, P, v) {
        return function (j, E) {
          j && (j.code === 'EMFILE' || j.code === 'ENFILE')
            ? te([N, [O, b, P], j, v || Date.now(), Date.now()])
            : (E && E.sort && E.sort(), typeof P == 'function' && P.call(this, j, E))
        }
      }
    }
    if ((o(h, 'readdir'), process.version.substr(0, 4) === 'v0.8')) {
      var y = gn(e)
      ;((F = y.ReadStream), (I = y.WriteStream))
    }
    var s = e.ReadStream
    s && ((F.prototype = Object.create(s.prototype)), (F.prototype.open = J))
    var m = e.WriteStream
    ;(m && ((I.prototype = Object.create(m.prototype)), (I.prototype.open = ce)),
      Object.defineProperty(e, 'ReadStream', {
        get: o(function () {
          return F
        }, 'get'),
        set: o(function (l) {
          F = l
        }, 'set'),
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e, 'WriteStream', {
        get: o(function () {
          return I
        }, 'get'),
        set: o(function (l) {
          I = l
        }, 'set'),
        enumerable: !0,
        configurable: !0,
      }))
    var g = F
    Object.defineProperty(e, 'FileReadStream', {
      get: o(function () {
        return g
      }, 'get'),
      set: o(function (l) {
        g = l
      }, 'set'),
      enumerable: !0,
      configurable: !0,
    })
    var S = I
    Object.defineProperty(e, 'FileWriteStream', {
      get: o(function () {
        return S
      }, 'get'),
      set: o(function (l) {
        S = l
      }, 'set'),
      enumerable: !0,
      configurable: !0,
    })
    function F(l, w) {
      return this instanceof F ? (s.apply(this, arguments), this) : F.apply(Object.create(F.prototype), arguments)
    }
    o(F, 'ReadStream')
    function J() {
      var l = this
      Ne(l.path, l.flags, l.mode, function (w, p) {
        w ? (l.autoClose && l.destroy(), l.emit('error', w)) : ((l.fd = p), l.emit('open', p), l.read())
      })
    }
    o(J, 'ReadStream$open')
    function I(l, w) {
      return this instanceof I ? (m.apply(this, arguments), this) : I.apply(Object.create(I.prototype), arguments)
    }
    o(I, 'WriteStream')
    function ce() {
      var l = this
      Ne(l.path, l.flags, l.mode, function (w, p) {
        w ? (l.destroy(), l.emit('error', w)) : ((l.fd = p), l.emit('open', p))
      })
    }
    o(ce, 'WriteStream$open')
    function Xe(l, w) {
      return new e.ReadStream(l, w)
    }
    o(Xe, 'createReadStream')
    function ze(l, w) {
      return new e.WriteStream(l, w)
    }
    o(ze, 'createWriteStream')
    var rn = e.open
    e.open = Ne
    function Ne(l, w, p, N) {
      return (typeof p == 'function' && ((N = p), (p = null)), C(l, w, p, N))
      function C(O, b, P, v, j) {
        return rn(O, b, P, function (E, bo) {
          E && (E.code === 'EMFILE' || E.code === 'ENFILE')
            ? te([C, [O, b, P, v], E, j || Date.now(), Date.now()])
            : typeof v == 'function' && v.apply(this, arguments)
        })
      }
      o(C, 'go$open')
    }
    return (o(Ne, 'open'), e)
  }
  o(Ie, 'patch')
  function te(e) {
    ;(X('ENQUEUE', e[0].name, e[1]), q[T].push(e), _e())
  }
  o(te, 'enqueue')
  var ge
  function ht() {
    for (var e = Date.now(), t = 0; t < q[T].length; ++t)
      q[T][t].length > 2 && ((q[T][t][3] = e), (q[T][t][4] = e))
    _e()
  }
  o(ht, 'resetQueue')
  function _e() {
    if ((clearTimeout(ge), (ge = void 0), q[T].length !== 0)) {
      var e = q[T].shift(),
        t = e[0],
        r = e[1],
        n = e[2],
        i = e[3],
        c = e[4]
      if (i === void 0) (X('RETRY', t.name, r), t.apply(null, r))
      else if (Date.now() - i >= 6e4) {
        X('TIMEOUT', t.name, r)
        var a = r.pop()
        typeof a == 'function' && a.call(null, n)
      } else {
        var f = Date.now() - c,
          k = Math.max(c - i, 1),
          L = Math.min(k * 1.2, 100)
        f >= L ? (X('RETRY', t.name, r), t.apply(null, r.concat([i]))) : q[T].push(e)
      }
      ge === void 0 && (ge = setTimeout(_e, 0))
    }
  }
  o(_e, 'retry')
})
var R = d((V) => {
  'use strict'
  var pt = x().fromCallback,
    _ = re(),
    Fn = [
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
    ].filter((e) => typeof _[e] == 'function')
  Object.assign(V, _)
  Fn.forEach((e) => {
    V[e] = pt(_[e])
  })
  V.exists = function (e, t) {
    return typeof t == 'function' ? _.exists(e, t) : new Promise((r) => _.exists(e, r))
  }
  V.read = function (e, t, r, n, i, c) {
    return typeof c == 'function'
      ? _.read(e, t, r, n, i, c)
      : new Promise((a, f) => {
          _.read(e, t, r, n, i, (k, L, u) => {
            if (k) return f(k)
            a({ bytesRead: L, buffer: u })
          })
        })
  }
  V.write = function (e, t, ...r) {
    return typeof r[r.length - 1] == 'function'
      ? _.write(e, t, ...r)
      : new Promise((n, i) => {
          _.write(e, t, ...r, (c, a, f) => {
            if (c) return i(c)
            n({ bytesWritten: a, buffer: f })
          })
        })
  }
  V.readv = function (e, t, ...r) {
    return typeof r[r.length - 1] == 'function'
      ? _.readv(e, t, ...r)
      : new Promise((n, i) => {
          _.readv(e, t, ...r, (c, a, f) => {
            if (c) return i(c)
            n({ bytesRead: a, buffers: f })
          })
        })
  }
  V.writev = function (e, t, ...r) {
    return typeof r[r.length - 1] == 'function'
      ? _.writev(e, t, ...r)
      : new Promise((n, i) => {
          _.writev(e, t, ...r, (c, a, f) => {
            if (c) return i(c)
            n({ bytesWritten: a, buffers: f })
          })
        })
  }
  typeof _.realpath.native == 'function'
    ? (V.realpath.native = pt(_.realpath.native))
    : process.emitWarning(
        'fs.realpath.native is not a function. Is fs being monkey-patched?',
        'Warning',
        'fs-extra-WARN0003',
      )
})
var St = d((_o, wt) => {
  'use strict'
  var bn = require('path')
  wt.exports.checkPath = o(function (t) {
    if (process.platform === 'win32' && /[<>:"|?*]/.test(t.replace(bn.parse(t).root, ''))) {
      let n = new Error(`Path contains invalid characters: ${t}`)
      throw ((n.code = 'EINVAL'), n)
    }
  }, 'checkPath')
})
var kt = d((Mo, Me) => {
  'use strict'
  var vt = R(),
    { checkPath: gt } = St(),
    Et = o((e) => {
      let t = { mode: 511 }
      return typeof e == 'number' ? e : { ...t, ...e }.mode
    }, 'getMode')
  Me.exports.makeDir = async (e, t) => (gt(e), vt.mkdir(e, { mode: Et(t), recursive: !0 }))
  Me.exports.makeDirSync = (e, t) => (gt(e), vt.mkdirSync(e, { mode: Et(t), recursive: !0 }))
})
var U = d((Jo, Ft) => {
  'use strict'
  var qn = x().fromPromise,
    { makeDir: Pn, makeDirSync: Ae } = kt(),
    Je = qn(Pn)
  Ft.exports = { mkdirs: Je, mkdirsSync: Ae, mkdirp: Je, mkdirpSync: Ae, ensureDir: Je, ensureDirSync: Ae }
})
var K = d((Uo, qt) => {
  'use strict'
  var On = x().fromPromise,
    bt = R()
  function xn(e) {
    return bt
      .access(e)
      .then(() => !0)
      .catch(() => !1)
  }
  o(xn, 'pathExists')
  qt.exports = { pathExists: On(xn), pathExistsSync: bt.existsSync }
})
var Ue = d((Vo, Pt) => {
  'use strict'
  var ne = R(),
    Dn = x().fromPromise
  async function Nn(e, t, r) {
    let n = await ne.open(e, 'r+'),
      i = null
    try {
      await ne.futimes(n, t, r)
    } finally {
      try {
        await ne.close(n)
      } catch (c) {
        i = c
      }
    }
    if (i) throw i
  }
  o(Nn, 'utimesMillis')
  function Cn(e, t, r) {
    let n = ne.openSync(e, 'r+')
    return (ne.futimesSync(n, t, r), ne.closeSync(n))
  }
  o(Cn, 'utimesMillisSync')
  Pt.exports = { utimesMillis: Dn(Nn), utimesMillisSync: Cn }
})
var z = d((Go, Nt) => {
  'use strict'
  var ie = R(),
    D = require('path'),
    Ot = x().fromPromise
  function jn(e, t, r) {
    let n = r.dereference ? (i) => ie.stat(i, { bigint: !0 }) : (i) => ie.lstat(i, { bigint: !0 })
    return Promise.all([
      n(e),
      n(t).catch((i) => {
        if (i.code === 'ENOENT') return null
        throw i
      }),
    ]).then(([i, c]) => ({ srcStat: i, destStat: c }))
  }
  o(jn, 'getStats')
  function Tn(e, t, r) {
    let n,
      i = r.dereference ? (a) => ie.statSync(a, { bigint: !0 }) : (a) => ie.lstatSync(a, { bigint: !0 }),
      c = i(e)
    try {
      n = i(t)
    } catch (a) {
      if (a.code === 'ENOENT') return { srcStat: c, destStat: null }
      throw a
    }
    return { srcStat: c, destStat: n }
  }
  o(Tn, 'getStatsSync')
  async function Ln(e, t, r, n) {
    let { srcStat: i, destStat: c } = await jn(e, t, n)
    if (c) {
      if (fe(i, c)) {
        let a = D.basename(e),
          f = D.basename(t)
        if (r === 'move' && a !== f && a.toLowerCase() === f.toLowerCase())
          return { srcStat: i, destStat: c, isChangingCase: !0 }
        throw new Error('Source and destination must not be the same.')
      }
      if (i.isDirectory() && !c.isDirectory())
        throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`)
      if (!i.isDirectory() && c.isDirectory())
        throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`)
    }
    if (i.isDirectory() && Be(e, t)) throw new Error(ke(e, t, r))
    return { srcStat: i, destStat: c }
  }
  o(Ln, 'checkPaths')
  function $n(e, t, r, n) {
    let { srcStat: i, destStat: c } = Tn(e, t, n)
    if (c) {
      if (fe(i, c)) {
        let a = D.basename(e),
          f = D.basename(t)
        if (r === 'move' && a !== f && a.toLowerCase() === f.toLowerCase())
          return { srcStat: i, destStat: c, isChangingCase: !0 }
        throw new Error('Source and destination must not be the same.')
      }
      if (i.isDirectory() && !c.isDirectory())
        throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`)
      if (!i.isDirectory() && c.isDirectory())
        throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`)
    }
    if (i.isDirectory() && Be(e, t)) throw new Error(ke(e, t, r))
    return { srcStat: i, destStat: c }
  }
  o($n, 'checkPathsSync')
  async function xt(e, t, r, n) {
    let i = D.resolve(D.dirname(e)),
      c = D.resolve(D.dirname(r))
    if (c === i || c === D.parse(c).root) return
    let a
    try {
      a = await ie.stat(c, { bigint: !0 })
    } catch (f) {
      if (f.code === 'ENOENT') return
      throw f
    }
    if (fe(t, a)) throw new Error(ke(e, r, n))
    return xt(e, t, c, n)
  }
  o(xt, 'checkParentPaths')
  function Dt(e, t, r, n) {
    let i = D.resolve(D.dirname(e)),
      c = D.resolve(D.dirname(r))
    if (c === i || c === D.parse(c).root) return
    let a
    try {
      a = ie.statSync(c, { bigint: !0 })
    } catch (f) {
      if (f.code === 'ENOENT') return
      throw f
    }
    if (fe(t, a)) throw new Error(ke(e, r, n))
    return Dt(e, t, c, n)
  }
  o(Dt, 'checkParentPathsSync')
  function fe(e, t) {
    return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev
  }
  o(fe, 'areIdentical')
  function Be(e, t) {
    let r = D.resolve(e)
        .split(D.sep)
        .filter((i) => i),
      n = D.resolve(t)
        .split(D.sep)
        .filter((i) => i)
    return r.every((i, c) => n[c] === i)
  }
  o(Be, 'isSrcSubdir')
  function ke(e, t, r) {
    return `Cannot ${r} '${e}' to a subdirectory of itself, '${t}'.`
  }
  o(ke, 'errMsg')
  Nt.exports = {
    checkPaths: Ot(Ln),
    checkPathsSync: $n,
    checkParentPaths: Ot(xt),
    checkParentPathsSync: Dt,
    isSrcSubdir: Be,
    areIdentical: fe,
  }
})
var $t = d((Qo, Lt) => {
  'use strict'
  var W = R(),
    le = require('path'),
    { mkdirs: Wn } = U(),
    { pathExists: In } = K(),
    { utimesMillis: _n } = Ue(),
    ye = z()
  async function Rn(e, t, r = {}) {
    ;(typeof r == 'function' && (r = { filter: r }),
      (r.clobber = 'clobber' in r ? !!r.clobber : !0),
      (r.overwrite = 'overwrite' in r ? !!r.overwrite : r.clobber),
      r.preserveTimestamps &&
        process.arch === 'ia32' &&
        process.emitWarning(
          `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
          'Warning',
          'fs-extra-WARN0001',
        ))
    let { srcStat: n, destStat: i } = await ye.checkPaths(e, t, 'copy', r)
    if ((await ye.checkParentPaths(e, n, t, 'copy'), !(await jt(e, t, r)))) return
    let a = le.dirname(t)
    ;((await In(a)) || (await Wn(a)), await Tt(i, e, t, r))
  }
  o(Rn, 'copy')
  async function jt(e, t, r) {
    return r.filter ? r.filter(e, t) : !0
  }
  o(jt, 'runFilter')
  async function Tt(e, t, r, n) {
    let c = await (n.dereference ? W.stat : W.lstat)(t)
    if (c.isDirectory()) return Un(c, e, t, r, n)
    if (c.isFile() || c.isCharacterDevice() || c.isBlockDevice()) return Mn(c, e, t, r, n)
    if (c.isSymbolicLink()) return Bn(e, t, r, n)
    throw c.isSocket()
      ? new Error(`Cannot copy a socket file: ${t}`)
      : c.isFIFO()
        ? new Error(`Cannot copy a FIFO pipe: ${t}`)
        : new Error(`Unknown file: ${t}`)
  }
  o(Tt, 'getStatsAndPerformCopy')
  async function Mn(e, t, r, n, i) {
    if (!t) return Ct(e, r, n, i)
    if (i.overwrite) return (await W.unlink(n), Ct(e, r, n, i))
    if (i.errorOnExist) throw new Error(`'${n}' already exists`)
  }
  o(Mn, 'onFile')
  async function Ct(e, t, r, n) {
    if ((await W.copyFile(t, r), n.preserveTimestamps)) {
      An(e.mode) && (await Jn(r, e.mode))
      let i = await W.stat(t)
      await _n(r, i.atime, i.mtime)
    }
    return W.chmod(r, e.mode)
  }
  o(Ct, 'copyFile')
  function An(e) {
    return (e & 128) === 0
  }
  o(An, 'fileIsNotWritable')
  function Jn(e, t) {
    return W.chmod(e, t | 128)
  }
  o(Jn, 'makeFileWritable')
  async function Un(e, t, r, n, i) {
    t || (await W.mkdir(n))
    let c = []
    for await (let a of await W.opendir(r)) {
      let f = le.join(r, a.name),
        k = le.join(n, a.name)
      c.push(
        jt(f, k, i).then((L) => {
          if (L) return ye.checkPaths(f, k, 'copy', i).then(({ destStat: u }) => Tt(u, f, k, i))
        }),
      )
    }
    ;(await Promise.all(c), t || (await W.chmod(n, e.mode)))
  }
  o(Un, 'onDir')
  async function Bn(e, t, r, n) {
    let i = await W.readlink(t)
    if ((n.dereference && (i = le.resolve(process.cwd(), i)), !e)) return W.symlink(i, r)
    let c = null
    try {
      c = await W.readlink(r)
    } catch (a) {
      if (a.code === 'EINVAL' || a.code === 'UNKNOWN') return W.symlink(i, r)
      throw a
    }
    if ((n.dereference && (c = le.resolve(process.cwd(), c)), ye.isSrcSubdir(i, c)))
      throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${c}'.`)
    if (ye.isSrcSubdir(c, i)) throw new Error(`Cannot overwrite '${c}' with '${i}'.`)
    return (await W.unlink(r), W.symlink(i, r))
  }
  o(Bn, 'onLink')
  Lt.exports = Rn
})
var Mt = d((Xo, Rt) => {
  'use strict'
  var M = re(),
    me = require('path'),
    Vn = U().mkdirsSync,
    Yn = Ue().utimesMillisSync,
    he = z()
  function Gn(e, t, r) {
    ;(typeof r == 'function' && (r = { filter: r }),
      (r = r || {}),
      (r.clobber = 'clobber' in r ? !!r.clobber : !0),
      (r.overwrite = 'overwrite' in r ? !!r.overwrite : r.clobber),
      r.preserveTimestamps &&
        process.arch === 'ia32' &&
        process.emitWarning(
          `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
          'Warning',
          'fs-extra-WARN0002',
        ))
    let { srcStat: n, destStat: i } = he.checkPathsSync(e, t, 'copy', r)
    if ((he.checkParentPathsSync(e, n, t, 'copy'), r.filter && !r.filter(e, t))) return
    let c = me.dirname(t)
    return (M.existsSync(c) || Vn(c), Wt(i, e, t, r))
  }
  o(Gn, 'copySync')
  function Wt(e, t, r, n) {
    let c = (n.dereference ? M.statSync : M.lstatSync)(t)
    if (c.isDirectory()) return ei(c, e, t, r, n)
    if (c.isFile() || c.isCharacterDevice() || c.isBlockDevice()) return Kn(c, e, t, r, n)
    if (c.isSymbolicLink()) return ni(e, t, r, n)
    throw c.isSocket()
      ? new Error(`Cannot copy a socket file: ${t}`)
      : c.isFIFO()
        ? new Error(`Cannot copy a FIFO pipe: ${t}`)
        : new Error(`Unknown file: ${t}`)
  }
  o(Wt, 'getStats')
  function Kn(e, t, r, n, i) {
    return t ? Qn(e, r, n, i) : It(e, r, n, i)
  }
  o(Kn, 'onFile')
  function Qn(e, t, r, n) {
    if (n.overwrite) return (M.unlinkSync(r), It(e, t, r, n))
    if (n.errorOnExist) throw new Error(`'${r}' already exists`)
  }
  o(Qn, 'mayCopyFile')
  function It(e, t, r, n) {
    return (M.copyFileSync(t, r), n.preserveTimestamps && Hn(e.mode, t, r), Ve(r, e.mode))
  }
  o(It, 'copyFile')
  function Hn(e, t, r) {
    return (Xn(e) && zn(r, e), Zn(t, r))
  }
  o(Hn, 'handleTimestamps')
  function Xn(e) {
    return (e & 128) === 0
  }
  o(Xn, 'fileIsNotWritable')
  function zn(e, t) {
    return Ve(e, t | 128)
  }
  o(zn, 'makeFileWritable')
  function Ve(e, t) {
    return M.chmodSync(e, t)
  }
  o(Ve, 'setDestMode')
  function Zn(e, t) {
    let r = M.statSync(e)
    return Yn(t, r.atime, r.mtime)
  }
  o(Zn, 'setDestTimestamps')
  function ei(e, t, r, n, i) {
    return t ? _t(r, n, i) : ti(e.mode, r, n, i)
  }
  o(ei, 'onDir')
  function ti(e, t, r, n) {
    return (M.mkdirSync(r), _t(t, r, n), Ve(r, e))
  }
  o(ti, 'mkDirAndCopy')
  function _t(e, t, r) {
    let n = M.opendirSync(e)
    try {
      let i
      for (; (i = n.readSync()) !== null; ) ri(i.name, e, t, r)
    } finally {
      n.closeSync()
    }
  }
  o(_t, 'copyDir')
  function ri(e, t, r, n) {
    let i = me.join(t, e),
      c = me.join(r, e)
    if (n.filter && !n.filter(i, c)) return
    let { destStat: a } = he.checkPathsSync(i, c, 'copy', n)
    return Wt(a, i, c, n)
  }
  o(ri, 'copyDirItem')
  function ni(e, t, r, n) {
    let i = M.readlinkSync(t)
    if ((n.dereference && (i = me.resolve(process.cwd(), i)), e)) {
      let c
      try {
        c = M.readlinkSync(r)
      } catch (a) {
        if (a.code === 'EINVAL' || a.code === 'UNKNOWN') return M.symlinkSync(i, r)
        throw a
      }
      if ((n.dereference && (c = me.resolve(process.cwd(), c)), he.isSrcSubdir(i, c)))
        throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${c}'.`)
      if (he.isSrcSubdir(c, i)) throw new Error(`Cannot overwrite '${c}' with '${i}'.`)
      return ii(i, r)
    } else return M.symlinkSync(i, r)
  }
  o(ni, 'onLink')
  function ii(e, t) {
    return (M.unlinkSync(t), M.symlinkSync(e, t))
  }
  o(ii, 'copyLink')
  Rt.exports = Gn
})
var Fe = d((Zo, At) => {
  'use strict'
  var oi = x().fromPromise
  At.exports = { copy: oi($t()), copySync: Mt() }
})
var de = d((ec, Ut) => {
  'use strict'
  var Jt = re(),
    ci = x().fromCallback
  function ai(e, t) {
    Jt.rm(e, { recursive: !0, force: !0 }, t)
  }
  o(ai, 'remove')
  function ui(e) {
    Jt.rmSync(e, { recursive: !0, force: !0 })
  }
  o(ui, 'removeSync')
  Ut.exports = { remove: ci(ai), removeSync: ui }
})
var Xt = d((rc, Ht) => {
  'use strict'
  var si = x().fromPromise,
    Yt = R(),
    Gt = require('path'),
    Kt = U(),
    Qt = de(),
    Bt = si(
      o(async function (t) {
        let r
        try {
          r = await Yt.readdir(t)
        } catch {
          return Kt.mkdirs(t)
        }
        return Promise.all(r.map((n) => Qt.remove(Gt.join(t, n))))
      }, 'emptyDir'),
    )
  function Vt(e) {
    let t
    try {
      t = Yt.readdirSync(e)
    } catch {
      return Kt.mkdirsSync(e)
    }
    t.forEach((r) => {
      ;((r = Gt.join(e, r)), Qt.removeSync(r))
    })
  }
  o(Vt, 'emptyDirSync')
  Ht.exports = { emptyDirSync: Vt, emptydirSync: Vt, emptyDir: Bt, emptydir: Bt }
})
var tr = d((ic, er) => {
  'use strict'
  var fi = x().fromPromise,
    zt = require('path'),
    Y = R(),
    Zt = U()
  async function li(e) {
    let t
    try {
      t = await Y.stat(e)
    } catch {}
    if (t && t.isFile()) return
    let r = zt.dirname(e),
      n = null
    try {
      n = await Y.stat(r)
    } catch (i) {
      if (i.code === 'ENOENT') {
        ;(await Zt.mkdirs(r), await Y.writeFile(e, ''))
        return
      } else throw i
    }
    n.isDirectory() ? await Y.writeFile(e, '') : await Y.readdir(r)
  }
  o(li, 'createFile')
  function yi(e) {
    let t
    try {
      t = Y.statSync(e)
    } catch {}
    if (t && t.isFile()) return
    let r = zt.dirname(e)
    try {
      Y.statSync(r).isDirectory() || Y.readdirSync(r)
    } catch (n) {
      if (n && n.code === 'ENOENT') Zt.mkdirsSync(r)
      else throw n
    }
    Y.writeFileSync(e, '')
  }
  o(yi, 'createFileSync')
  er.exports = { createFile: fi(li), createFileSync: yi }
})
var cr = d((cc, or) => {
  'use strict'
  var mi = x().fromPromise,
    rr = require('path'),
    Q = R(),
    nr = U(),
    { pathExists: hi } = K(),
    { areIdentical: ir } = z()
  async function di(e, t) {
    let r
    try {
      r = await Q.lstat(t)
    } catch {}
    let n
    try {
      n = await Q.lstat(e)
    } catch (a) {
      throw ((a.message = a.message.replace('lstat', 'ensureLink')), a)
    }
    if (r && ir(n, r)) return
    let i = rr.dirname(t)
    ;((await hi(i)) || (await nr.mkdirs(i)), await Q.link(e, t))
  }
  o(di, 'createLink')
  function pi(e, t) {
    let r
    try {
      r = Q.lstatSync(t)
    } catch {}
    try {
      let c = Q.lstatSync(e)
      if (r && ir(c, r)) return
    } catch (c) {
      throw ((c.message = c.message.replace('lstat', 'ensureLink')), c)
    }
    let n = rr.dirname(t)
    return (Q.existsSync(n) || nr.mkdirsSync(n), Q.linkSync(e, t))
  }
  o(pi, 'createLinkSync')
  or.exports = { createLink: mi(di), createLinkSync: pi }
})
var ur = d((uc, ar) => {
  'use strict'
  var H = require('path'),
    pe = R(),
    { pathExists: wi } = K(),
    Si = x().fromPromise
  async function vi(e, t) {
    if (H.isAbsolute(e)) {
      try {
        await pe.lstat(e)
      } catch (c) {
        throw ((c.message = c.message.replace('lstat', 'ensureSymlink')), c)
      }
      return { toCwd: e, toDst: e }
    }
    let r = H.dirname(t),
      n = H.join(r, e)
    if (await wi(n)) return { toCwd: n, toDst: e }
    try {
      await pe.lstat(e)
    } catch (c) {
      throw ((c.message = c.message.replace('lstat', 'ensureSymlink')), c)
    }
    return { toCwd: e, toDst: H.relative(r, e) }
  }
  o(vi, 'symlinkPaths')
  function gi(e, t) {
    if (H.isAbsolute(e)) {
      if (!pe.existsSync(e)) throw new Error('absolute srcpath does not exist')
      return { toCwd: e, toDst: e }
    }
    let r = H.dirname(t),
      n = H.join(r, e)
    if (pe.existsSync(n)) return { toCwd: n, toDst: e }
    if (!pe.existsSync(e)) throw new Error('relative srcpath does not exist')
    return { toCwd: e, toDst: H.relative(r, e) }
  }
  o(gi, 'symlinkPathsSync')
  ar.exports = { symlinkPaths: Si(vi), symlinkPathsSync: gi }
})
var lr = d((fc, fr) => {
  'use strict'
  var sr = R(),
    Ei = x().fromPromise
  async function ki(e, t) {
    if (t) return t
    let r
    try {
      r = await sr.lstat(e)
    } catch {
      return 'file'
    }
    return r && r.isDirectory() ? 'dir' : 'file'
  }
  o(ki, 'symlinkType')
  function Fi(e, t) {
    if (t) return t
    let r
    try {
      r = sr.lstatSync(e)
    } catch {
      return 'file'
    }
    return r && r.isDirectory() ? 'dir' : 'file'
  }
  o(Fi, 'symlinkTypeSync')
  fr.exports = { symlinkType: Ei(ki), symlinkTypeSync: Fi }
})
var dr = d((yc, hr) => {
  'use strict'
  var bi = x().fromPromise,
    yr = require('path'),
    B = R(),
    { mkdirs: qi, mkdirsSync: Pi } = U(),
    { symlinkPaths: Oi, symlinkPathsSync: xi } = ur(),
    { symlinkType: Di, symlinkTypeSync: Ni } = lr(),
    { pathExists: Ci } = K(),
    { areIdentical: mr } = z()
  async function ji(e, t, r) {
    let n
    try {
      n = await B.lstat(t)
    } catch {}
    if (n && n.isSymbolicLink()) {
      let [f, k] = await Promise.all([B.stat(e), B.stat(t)])
      if (mr(f, k)) return
    }
    let i = await Oi(e, t)
    e = i.toDst
    let c = await Di(i.toCwd, r),
      a = yr.dirname(t)
    return ((await Ci(a)) || (await qi(a)), B.symlink(e, t, c))
  }
  o(ji, 'createSymlink')
  function Ti(e, t, r) {
    let n
    try {
      n = B.lstatSync(t)
    } catch {}
    if (n && n.isSymbolicLink()) {
      let f = B.statSync(e),
        k = B.statSync(t)
      if (mr(f, k)) return
    }
    let i = xi(e, t)
    ;((e = i.toDst), (r = Ni(i.toCwd, r)))
    let c = yr.dirname(t)
    return (B.existsSync(c) || Pi(c), B.symlinkSync(e, t, r))
  }
  o(Ti, 'createSymlinkSync')
  hr.exports = { createSymlink: bi(ji), createSymlinkSync: Ti }
})
var Fr = d((hc, kr) => {
  'use strict'
  var { createFile: pr, createFileSync: wr } = tr(),
    { createLink: Sr, createLinkSync: vr } = cr(),
    { createSymlink: gr, createSymlinkSync: Er } = dr()
  kr.exports = {
    createFile: pr,
    createFileSync: wr,
    ensureFile: pr,
    ensureFileSync: wr,
    createLink: Sr,
    createLinkSync: vr,
    ensureLink: Sr,
    ensureLinkSync: vr,
    createSymlink: gr,
    createSymlinkSync: Er,
    ensureSymlink: gr,
    ensureSymlinkSync: Er,
  }
})
var be = d((dc, br) => {
  'use strict'
  function Li(
    e,
    {
      EOL: t = `
`,
      finalEOL: r = !0,
      replacer: n = null,
      spaces: i,
    } = {},
  ) {
    let c = r ? t : ''
    return JSON.stringify(e, n, i).replace(/\n/g, t) + c
  }
  o(Li, 'stringify')
  function $i(e) {
    return (Buffer.isBuffer(e) && (e = e.toString('utf8')), e.replace(/^\uFEFF/, ''))
  }
  o($i, 'stripBom')
  br.exports = { stringify: Li, stripBom: $i }
})
var xr = d((wc, Or) => {
  'use strict'
  var oe
  try {
    oe = re()
  } catch {
    oe = require('fs')
  }
  var qe = x(),
    { stringify: qr, stripBom: Pr } = be()
  async function Wi(e, t = {}) {
    typeof t == 'string' && (t = { encoding: t })
    let r = t.fs || oe,
      n = 'throws' in t ? t.throws : !0,
      i = await qe.fromCallback(r.readFile)(e, t)
    i = Pr(i)
    let c
    try {
      c = JSON.parse(i, t ? t.reviver : null)
    } catch (a) {
      if (n) throw ((a.message = `${e}: ${a.message}`), a)
      return null
    }
    return c
  }
  o(Wi, '_readFile')
  var Ii = qe.fromPromise(Wi)
  function _i(e, t = {}) {
    typeof t == 'string' && (t = { encoding: t })
    let r = t.fs || oe,
      n = 'throws' in t ? t.throws : !0
    try {
      let i = r.readFileSync(e, t)
      return ((i = Pr(i)), JSON.parse(i, t.reviver))
    } catch (i) {
      if (n) throw ((i.message = `${e}: ${i.message}`), i)
      return null
    }
  }
  o(_i, 'readFileSync')
  async function Ri(e, t, r = {}) {
    let n = r.fs || oe,
      i = qr(t, r)
    await qe.fromCallback(n.writeFile)(e, i, r)
  }
  o(Ri, '_writeFile')
  var Mi = qe.fromPromise(Ri)
  function Ai(e, t, r = {}) {
    let n = r.fs || oe,
      i = qr(t, r)
    return n.writeFileSync(e, i, r)
  }
  o(Ai, 'writeFileSync')
  var Ji = { readFile: Ii, readFileSync: _i, writeFile: Mi, writeFileSync: Ai }
  Or.exports = Ji
})
var Nr = d((vc, Dr) => {
  'use strict'
  var Pe = xr()
  Dr.exports = {
    readJson: Pe.readFile,
    readJsonSync: Pe.readFileSync,
    writeJson: Pe.writeFile,
    writeJsonSync: Pe.writeFileSync,
  }
})
var Oe = d((gc, Tr) => {
  'use strict'
  var Ui = x().fromPromise,
    Ye = R(),
    Cr = require('path'),
    jr = U(),
    Bi = K().pathExists
  async function Vi(e, t, r = 'utf-8') {
    let n = Cr.dirname(e)
    return ((await Bi(n)) || (await jr.mkdirs(n)), Ye.writeFile(e, t, r))
  }
  o(Vi, 'outputFile')
  function Yi(e, ...t) {
    let r = Cr.dirname(e)
    ;(Ye.existsSync(r) || jr.mkdirsSync(r), Ye.writeFileSync(e, ...t))
  }
  o(Yi, 'outputFileSync')
  Tr.exports = { outputFile: Ui(Vi), outputFileSync: Yi }
})
var $r = d((kc, Lr) => {
  'use strict'
  var { stringify: Gi } = be(),
    { outputFile: Ki } = Oe()
  async function Qi(e, t, r = {}) {
    let n = Gi(t, r)
    await Ki(e, n, r)
  }
  o(Qi, 'outputJson')
  Lr.exports = Qi
})
var Ir = d((bc, Wr) => {
  'use strict'
  var { stringify: Hi } = be(),
    { outputFileSync: Xi } = Oe()
  function zi(e, t, r) {
    let n = Hi(t, r)
    Xi(e, n, r)
  }
  o(zi, 'outputJsonSync')
  Wr.exports = zi
})
var Rr = d((Pc, _r) => {
  'use strict'
  var Zi = x().fromPromise,
    A = Nr()
  A.outputJson = Zi($r())
  A.outputJsonSync = Ir()
  A.outputJSON = A.outputJson
  A.outputJSONSync = A.outputJsonSync
  A.writeJSON = A.writeJson
  A.writeJSONSync = A.writeJsonSync
  A.readJSON = A.readJson
  A.readJSONSync = A.readJsonSync
  _r.exports = A
})
var Br = d((Oc, Ur) => {
  'use strict'
  var eo = R(),
    Mr = require('path'),
    { copy: to } = Fe(),
    { remove: Jr } = de(),
    { mkdirp: ro } = U(),
    { pathExists: no } = K(),
    Ar = z()
  async function io(e, t, r = {}) {
    let n = r.overwrite || r.clobber || !1,
      { srcStat: i, isChangingCase: c = !1 } = await Ar.checkPaths(e, t, 'move', r)
    await Ar.checkParentPaths(e, i, t, 'move')
    let a = Mr.dirname(t)
    return (Mr.parse(a).root !== a && (await ro(a)), oo(e, t, n, c))
  }
  o(io, 'move')
  async function oo(e, t, r, n) {
    if (!n) {
      if (r) await Jr(t)
      else if (await no(t)) throw new Error('dest already exists.')
    }
    try {
      await eo.rename(e, t)
    } catch (i) {
      if (i.code !== 'EXDEV') throw i
      await co(e, t, r)
    }
  }
  o(oo, 'doRename')
  async function co(e, t, r) {
    return (await to(e, t, { overwrite: r, errorOnExist: !0, preserveTimestamps: !0 }), Jr(e))
  }
  o(co, 'moveAcrossDevice')
  Ur.exports = io
})
var Qr = d((Dc, Kr) => {
  'use strict'
  var Yr = re(),
    Ke = require('path'),
    ao = Fe().copySync,
    Gr = de().removeSync,
    uo = U().mkdirpSync,
    Vr = z()
  function so(e, t, r) {
    r = r || {}
    let n = r.overwrite || r.clobber || !1,
      { srcStat: i, isChangingCase: c = !1 } = Vr.checkPathsSync(e, t, 'move', r)
    return (Vr.checkParentPathsSync(e, i, t, 'move'), fo(t) || uo(Ke.dirname(t)), lo(e, t, n, c))
  }
  o(so, 'moveSync')
  function fo(e) {
    let t = Ke.dirname(e)
    return Ke.parse(t).root === t
  }
  o(fo, 'isParentRoot')
  function lo(e, t, r, n) {
    if (n) return Ge(e, t, r)
    if (r) return (Gr(t), Ge(e, t, r))
    if (Yr.existsSync(t)) throw new Error('dest already exists.')
    return Ge(e, t, r)
  }
  o(lo, 'doRename')
  function Ge(e, t, r) {
    try {
      Yr.renameSync(e, t)
    } catch (n) {
      if (n.code !== 'EXDEV') throw n
      return yo(e, t, r)
    }
  }
  o(Ge, 'rename')
  function yo(e, t, r) {
    return (ao(e, t, { overwrite: r, errorOnExist: !0, preserveTimestamps: !0 }), Gr(e))
  }
  o(yo, 'moveAcrossDevice')
  Kr.exports = so
})
var Xr = d((Cc, Hr) => {
  'use strict'
  var mo = x().fromPromise
  Hr.exports = { move: mo(Br()), moveSync: Qr() }
})
var Zr = d((jc, zr) => {
  'use strict'
  zr.exports = { ...R(), ...Fe(), ...Xt(), ...Fr(), ...Rr(), ...U(), ...Xr(), ...Oe(), ...K(), ...de() }
})
var Fo = {}
sn(Fo, { getRepoRootDirpath: () => ko })
module.exports = fn(Fo)
var De = et(ot(), 1),
  He = et(Zr(), 1)
var ho = o((e, t, r, n) => {
    if (r === 'length' || r === 'prototype' || r === 'arguments' || r === 'caller') return
    let i = Object.getOwnPropertyDescriptor(e, r),
      c = Object.getOwnPropertyDescriptor(t, r)
    ;(!po(i, c) && n) || Object.defineProperty(e, r, c)
  }, 'copyProperty'),
  po = o(function (e, t) {
    return (
      e === void 0 ||
      e.configurable ||
      (e.writable === t.writable &&
        e.enumerable === t.enumerable &&
        e.configurable === t.configurable &&
        (e.writable || e.value === t.value))
    )
  }, 'canCopyProperty'),
  wo = o((e, t) => {
    let r = Object.getPrototypeOf(t)
    r !== Object.getPrototypeOf(e) && Object.setPrototypeOf(e, r)
  }, 'changePrototype'),
  So = o(
    (e, t) => `/* Wrapped ${e}*/
${t}`,
    'wrappedToString',
  ),
  vo = Object.getOwnPropertyDescriptor(Function.prototype, 'toString'),
  go = Object.getOwnPropertyDescriptor(Function.prototype.toString, 'name'),
  Eo = o((e, t, r) => {
    let n = r === '' ? '' : `with ${r.trim()}() `,
      i = So.bind(null, n, t.toString())
    Object.defineProperty(i, 'name', go)
    let { writable: c, enumerable: a, configurable: f } = vo
    Object.defineProperty(e, 'toString', { value: i, writable: c, enumerable: a, configurable: f })
  }, 'changeToString')
function Qe(e, t, { ignoreNonConfigurable: r = !1 } = {}) {
  let { name: n } = e
  for (let i of Reflect.ownKeys(t)) ho(e, t, i, r)
  return (wo(e, t), Eo(e, t, n), e)
}
o(Qe, 'mimicFunction')
var xe = new WeakMap(),
  en = o((e, t = {}) => {
    if (typeof e != 'function') throw new TypeError('Expected a function')
    let r,
      n = 0,
      i = e.displayName || e.name || '<anonymous>',
      c = o(function (...a) {
        if ((xe.set(c, ++n), n === 1)) ((r = e.apply(this, a)), (e = void 0))
        else if (t.throw === !0) throw new Error(`Function \`${i}\` can only be called once`)
        return r
      }, 'onetime')
    return (Qe(c, e), xe.set(c, n), c)
  }, 'onetime')
en.callCount = (e) => {
  if (!xe.has(e)) throw new Error(`The given function \`${e.name}\` is not wrapped by the \`onetime\` package`)
  return xe.get(e)
}
var tn = en
var ko = tn(
  o(function () {
    return o(function t(r = process.cwd()) {
      r = De.default.normalizeSafe(r)
      let n = De.default.joinSafe(r, 'package.json')
      if (He.default.existsSync(n) && He.default.readJsonSync(n)?.workspaces) return r
      let i = De.default.dirname(r)
      if (i !== r) return t(i)
      throw new Error('Could not find repo root from process.cwd(): ' + process.cwd())
    }, 'recurse')()
  }, 'getRepoRootDirpath'),
)
0 && (module.exports = { getRepoRootDirpath })

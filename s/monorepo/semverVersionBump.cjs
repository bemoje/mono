'use strict'
var m = Object.defineProperty
var p = Object.getOwnPropertyDescriptor
var a = Object.getOwnPropertyNames
var e = Object.prototype.hasOwnProperty
var s = (t, r) => m(t, 'name', { value: r, configurable: !0 })
var f = (t, r) => {
    for (var i in r) m(t, i, { get: r[i], enumerable: !0 })
  },
  u = (t, r, i, o) => {
    if ((r && typeof r == 'object') || typeof r == 'function')
      for (let n of a(r))
        !e.call(t, n) && n !== i && m(t, n, { get: () => r[n], enumerable: !(o = p(r, n)) || o.enumerable })
    return t
  }
var c = (t) => u(m({}, '__esModule', { value: !0 }), t)
var j = {}
f(j, { semverVersionBump: () => g })
module.exports = c(j)
function g(t, r) {
  let i = (typeof t == 'string' ? t.split('.') : t).map(Number)
  return (
    r === 'major'
      ? ((i[0] += 1), (i[1] = 0), (i[2] = 0))
      : r === 'minor'
        ? ((i[1] += 1), (i[2] = 0))
        : r === 'patch' && (i[2] += 1),
    i.join('.')
  )
}
s(g, 'semverVersionBump')
0 && (module.exports = { semverVersionBump })

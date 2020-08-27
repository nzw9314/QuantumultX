/*
 * qq相关
 */
function getPstk(t) {
    for (var e = 5381, i = 0, n = t.length; n > i; ++i)
        e += (e << 5) + t.charCodeAt(i);
    return 2147483647 & e
}

function getCSRFToken(skeyz) {
    var t = '5381';
    var n = 'tencentQQVIP123443safde&!%^%1282';
    var r = skeyz;
    var i = [],
        o;
    i.push(t << 5);
    for (var a = 0, s = r.length; a < s; ++a) {
        o = r.charAt(a).charCodeAt(0);
        i.push((t << 5) + o);
        t = o
    }
    return md5z(i.join("") + n)
}

function md5z(e) {
    var t = 0;
    var n = "";
    var r = 8;
    var i = 32;

    function o(e) {
        return T(f(x(e), e.length * r))
    }

    function a(e) {
        return j(f(x(e), e.length * r))
    }

    function s(e) {
        return w(f(x(e), e.length * r))
    }

    function l(e, t) {
        return T(y(e, t))
    }

    function u(e, t) {
        return j(y(e, t))
    }

    function c(e, t) {
        return w(y(e, t))
    }

    function f(e, t) {
        e[t >> 5] |= 128 << t % 32;
        e[(t + 64 >>> 9 << 4) + 14] = t;
        var n = 1732584193;
        var r = -271733879;
        var o = -1732584194;
        var a = 271733878;
        for (var s = 0; s < e.length; s += 16) {
            var l = n;
            var u = r;
            var c = o;
            var f = a;
            n = p(n, r, o, a, e[s + 0], 7, -680876936);
            a = p(a, n, r, o, e[s + 1], 12, -389564586);
            o = p(o, a, n, r, e[s + 2], 17, 606105819);
            r = p(r, o, a, n, e[s + 3], 22, -1044525330);
            n = p(n, r, o, a, e[s + 4], 7, -176418897);
            a = p(a, n, r, o, e[s + 5], 12, 1200080426);
            o = p(o, a, n, r, e[s + 6], 17, -1473231341);
            r = p(r, o, a, n, e[s + 7], 22, -45705983);
            n = p(n, r, o, a, e[s + 8], 7, 1770035416);
            a = p(a, n, r, o, e[s + 9], 12, -1958414417);
            o = p(o, a, n, r, e[s + 10], 17, -42063);
            r = p(r, o, a, n, e[s + 11], 22, -1990404162);
            n = p(n, r, o, a, e[s + 12], 7, 1804603682);
            a = p(a, n, r, o, e[s + 13], 12, -40341101);
            o = p(o, a, n, r, e[s + 14], 17, -1502002290);
            r = p(r, o, a, n, e[s + 15], 22, 1236535329);
            n = h(n, r, o, a, e[s + 1], 5, -165796510);
            a = h(a, n, r, o, e[s + 6], 9, -1069501632);
            o = h(o, a, n, r, e[s + 11], 14, 643717713);
            r = h(r, o, a, n, e[s + 0], 20, -373897302);
            n = h(n, r, o, a, e[s + 5], 5, -701558691);
            a = h(a, n, r, o, e[s + 10], 9, 38016083);
            o = h(o, a, n, r, e[s + 15], 14, -660478335);
            r = h(r, o, a, n, e[s + 4], 20, -405537848);
            n = h(n, r, o, a, e[s + 9], 5, 568446438);
            a = h(a, n, r, o, e[s + 14], 9, -1019803690);
            o = h(o, a, n, r, e[s + 3], 14, -187363961);
            r = h(r, o, a, n, e[s + 8], 20, 1163531501);
            n = h(n, r, o, a, e[s + 13], 5, -1444681467);
            a = h(a, n, r, o, e[s + 2], 9, -51403784);
            o = h(o, a, n, r, e[s + 7], 14, 1735328473);
            r = h(r, o, a, n, e[s + 12], 20, -1926607734);
            n = g(n, r, o, a, e[s + 5], 4, -378558);
            a = g(a, n, r, o, e[s + 8], 11, -2022574463);
            o = g(o, a, n, r, e[s + 11], 16, 1839030562);
            r = g(r, o, a, n, e[s + 14], 23, -35309556);
            n = g(n, r, o, a, e[s + 1], 4, -1530992060);
            a = g(a, n, r, o, e[s + 4], 11, 1272893353);
            o = g(o, a, n, r, e[s + 7], 16, -155497632);
            r = g(r, o, a, n, e[s + 10], 23, -1094730640);
            n = g(n, r, o, a, e[s + 13], 4, 681279174);
            a = g(a, n, r, o, e[s + 0], 11, -358537222);
            o = g(o, a, n, r, e[s + 3], 16, -722521979);
            r = g(r, o, a, n, e[s + 6], 23, 76029189);
            n = g(n, r, o, a, e[s + 9], 4, -640364487);
            a = g(a, n, r, o, e[s + 12], 11, -421815835);
            o = g(o, a, n, r, e[s + 15], 16, 530742520);
            r = g(r, o, a, n, e[s + 2], 23, -995338651);
            n = m(n, r, o, a, e[s + 0], 6, -198630844);
            a = m(a, n, r, o, e[s + 7], 10, 1126891415);
            o = m(o, a, n, r, e[s + 14], 15, -1416354905);
            r = m(r, o, a, n, e[s + 5], 21, -57434055);
            n = m(n, r, o, a, e[s + 12], 6, 1700485571);
            a = m(a, n, r, o, e[s + 3], 10, -1894986606);
            o = m(o, a, n, r, e[s + 10], 15, -1051523);
            r = m(r, o, a, n, e[s + 1], 21, -2054922799);
            n = m(n, r, o, a, e[s + 8], 6, 1873313359);
            a = m(a, n, r, o, e[s + 15], 10, -30611744);
            o = m(o, a, n, r, e[s + 6], 15, -1560198380);
            r = m(r, o, a, n, e[s + 13], 21, 1309151649);
            n = m(n, r, o, a, e[s + 4], 6, -145523070);
            a = m(a, n, r, o, e[s + 11], 10, -1120210379);
            o = m(o, a, n, r, e[s + 2], 15, 718787259);
            r = m(r, o, a, n, e[s + 9], 21, -343485551);
            n = v(n, l);
            r = v(r, u);
            o = v(o, c);
            a = v(a, f)
        }
        if (i == 16) {
            return Array(r, o)
        } else {
            return Array(n, r, o, a)
        }
    }

    function d(e, t, n, r, i, o) {
        return v(b(v(v(t, e), v(r, o)), i), n)
    }

    function p(e, t, n, r, i, o, a) {
        return d(t & n | ~t & r, e, t, i, o, a)
    }

    function h(e, t, n, r, i, o, a) {
        return d(t & r | n & ~r, e, t, i, o, a)
    }

    function g(e, t, n, r, i, o, a) {
        return d(t ^ n ^ r, e, t, i, o, a)
    }

    function m(e, t, n, r, i, o, a) {
        return d(n ^ (t | ~r), e, t, i, o, a)
    }

    function y(e, t) {
        var n = x(e);
        if (n.length > 16)
            n = f(n, e.length * r);
        var i = Array(16),
            o = Array(16);
        for (var a = 0; a < 16; a++) {
            i[a] = n[a] ^ 909522486;
            o[a] = n[a] ^ 1549556828
        }
        var s = f(i.concat(x(t)), 512 + t.length * r);
        return f(o.concat(s), 512 + 128)
    }

    function v(e, t) {
        var n = (e & 65535) + (t & 65535);
        var r = (e >> 16) + (t >> 16) + (n >> 16);
        return r << 16 | n & 65535
    }

    function b(e, t) {
        return e << t | e >>> 32 - t
    }

    function x(e) {
        var t = Array();
        var n = (1 << r) - 1;
        for (var i = 0; i < e.length * r; i += r)
            t[i >> 5] |= (e.charCodeAt(i / r) & n) << i % 32;
        return t
    }

    function w(e) {
        var t = "";
        var n = (1 << r) - 1;
        for (var i = 0; i < e.length * 32; i += r)
            t += String.fromCharCode(e[i >> 5] >>> i % 32 & n);
        return t
    }

    function T(e) {
        var n = t ? "0123456789ABCDEF" : "0123456789abcdef";
        var r = "";
        for (var i = 0; i < e.length * 4; i++) {
            r += n.charAt(e[i >> 2] >> i % 4 * 8 + 4 & 15) + n.charAt(e[i >> 2] >> i % 4 * 8 & 15)
        }
        return r
    }

    function j(e) {
        var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var r = "";
        for (var i = 0; i < e.length * 4; i += 3) {
            var o = (e[i >> 2] >> 8 * (i % 4) & 255) << 16 | (e[i + 1 >> 2] >> 8 * ((i + 1) % 4) & 255) << 8 | e[i + 2 >> 2] >> 8 * ((i + 2) % 4) & 255;
            for (var a = 0; a < 4; a++) {
                if (i * 8 + a * 6 > e.length * 32)
                    r += n;
                else
                    r += t.charAt(o >> 6 * (3 - a) & 63)
            }
        }
        return r
    }

    return o(e)
}
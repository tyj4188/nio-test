!function (t) {
    if ('object' == typeof exports && 'undefined' != typeof module) module.exports = t();
    else if ('function' == typeof define && define.amd) define([], t);
    else {
        var e;
        'undefined' != typeof window ? e = window : 'undefined' != typeof global ? e = global : 'undefined' != typeof self && (e = self), e.io = t()
    }
}(function () {
    return function t(e, n, r) {
        function o(s, a) {
            if (!n[s]) {
                if (!e[s]) {
                    var c = 'function' == typeof require && require;
                    if (!a && c) return c(s, !0);
                    if (i) return i(s, !0);
                    throw new Error('Cannot find module \'' + s + '\'')
                }
                var p = n[s] = {
                    exports: {}
                };
                e[s][0].call(p.exports, function (t) {
                    var n = e[s][1][t];
                    return o(n || t)
                }, p, p.exports, t, e, n, r)
            }
            return n[s].exports
        }

        for (var i = 'function' == typeof require && require, s = 0; s < r.length; s++) o(r[s]);
        return o
    }({
        1: [function (t, e, n) {
            e.exports = t('./lib/')
        }, {
            './lib/': 2
        }],
        2: [function (t, e, n) {
            function r(t, e) {
                'object' == typeof t && (e = t, t = void 0), e = e || {};
                var n, r = o(t),
                    i = r.source,
                    p = r.id;
                return e.forceNew || e['force new connection'] || !1 === e.multiplex ? (a('ignoring socket cache for %s', i), n = s(i, e)) : (c[p] || (a('new io instance for %s', i), c[p] = s(i, e)), n = c[p]), n.socket(r.path)
            }

            var o = t('./url'),
                i = t('socket.io-parser'),
                s = t('./manager'),
                a = t('debug')('socket.io-client');
            e.exports = n = r;
            var c = n.managers = {};
            n.protocol = i.protocol, n.connect = r, n.Manager = t('./manager'), n.Socket = t('./socket')
        }, {
            './manager': 3,
            './socket': 5,
            './url': 6,
            debug: 10,
            'socket.io-parser': 44
        }],
        3: [function (t, e, n) {
            function r(t, e) {
                if (!(this instanceof r)) return new r(t, e);
                t && 'object' == typeof t && (e = t, t = void 0), (e = e || {}).path = e.path || '/socket.io', this.nsps = {}, this.subs = [], this.opts = e, this.reconnection(!1 !== e.reconnection), this.reconnectionAttempts(e.reconnectionAttempts || 1 / 0), this.reconnectionDelay(e.reconnectionDelay || 1e3), this.reconnectionDelayMax(e.reconnectionDelayMax || 5e3), this.randomizationFactor(e.randomizationFactor || .5), this.backoff = new f({
                    min: this.reconnectionDelay(),
                    max: this.reconnectionDelayMax(),
                    jitter: this.randomizationFactor()
                }), this.timeout(null == e.timeout ? 2e4 : e.timeout), this.readyState = 'closed', this.uri = t, this.connected = [], this.encoding = !1, this.packetBuffer = [], this.encoder = new a.Encoder, this.decoder = new a.Decoder, this.autoConnect = !1 !== e.autoConnect, this.autoConnect && this.open()
            }

            t('./url');
            var o = t('engine.io-client'),
                i = t('./socket'),
                s = t('component-emitter'),
                a = t('socket.io-parser'),
                c = t('./on'),
                p = t('component-bind'),
                u = (t('object-component'), t('debug')('socket.io-client:manager')),
                h = t('indexof'),
                f = t('backo2');
            e.exports = r, r.prototype.emitAll = function () {
                this.emit.apply(this, arguments);
                for (var t in this.nsps) this.nsps[t].emit.apply(this.nsps[t], arguments)
            }, r.prototype.updateSocketIds = function () {
                for (var t in this.nsps) this.nsps[t].id = this.engine.id
            }, s(r.prototype), r.prototype.reconnection = function (t) {
                return arguments.length ? (this._reconnection = !!t, this) : this._reconnection
            }, r.prototype.reconnectionAttempts = function (t) {
                return arguments.length ? (this._reconnectionAttempts = t, this) : this._reconnectionAttempts
            }, r.prototype.reconnectionDelay = function (t) {
                return arguments.length ? (this._reconnectionDelay = t, this.backoff && this.backoff.setMin(t), this) : this._reconnectionDelay
            }, r.prototype.randomizationFactor = function (t) {
                return arguments.length ? (this._randomizationFactor = t, this.backoff && this.backoff.setJitter(t), this) : this._randomizationFactor
            }, r.prototype.reconnectionDelayMax = function (t) {
                return arguments.length ? (this._reconnectionDelayMax = t, this.backoff && this.backoff.setMax(t), this) : this._reconnectionDelayMax
            }, r.prototype.timeout = function (t) {
                return arguments.length ? (this._timeout = t, this) : this._timeout
            }, r.prototype.maybeReconnectOnOpen = function () {
                !this.reconnecting && this._reconnection && 0 === this.backoff.attempts && this.reconnect()
            }, r.prototype.open = r.prototype.connect = function (t) {
                if (u('readyState %s', this.readyState), ~this.readyState.indexOf('open')) return this;
                u('opening %s', this.uri), this.engine = o(this.uri, this.opts);
                var e = this.engine,
                    n = this;
                this.readyState = 'opening', this.skipReconnect = !1;
                var r = c(e, 'open', function () {
                        n.onopen(), t && t()
                    }),
                    i = c(e, 'error', function (e) {
                        if (u('connect_error'), n.cleanup(), n.readyState = 'closed', n.emitAll('connect_error', e), t) {
                            var r = new Error('Connection error');
                            r.data = e, t(r)
                        } else n.maybeReconnectOnOpen()
                    });
                if (!1 !== this._timeout) {
                    var s = this._timeout;
                    u('connect attempt will timeout after %d', s);
                    var a = setTimeout(function () {
                        u('connect attempt timed out after %d', s), r.destroy(), e.close(), e.emit('error', 'timeout'), n.emitAll('connect_timeout', s)
                    }, s);
                    this.subs.push({
                        destroy: function () {
                            clearTimeout(a)
                        }
                    })
                }
                return this.subs.push(r), this.subs.push(i), this
            }, r.prototype.onopen = function () {
                u('open'), this.cleanup(), this.readyState = 'open', this.emit('open');
                var t = this.engine;
                this.subs.push(c(t, 'data', p(this, 'ondata'))), this.subs.push(c(this.decoder, 'decoded', p(this, 'ondecoded'))), this.subs.push(c(t, 'error', p(this, 'onerror'))), this.subs.push(c(t, 'close', p(this, 'onclose')))
            }, r.prototype.ondata = function (t) {
                this.decoder.add(t)
            }, r.prototype.ondecoded = function (t) {
                this.emit('packet', t)
            }, r.prototype.onerror = function (t) {
                u('error', t), this.emitAll('error', t)
            }, r.prototype.socket = function (t) {
                var e = this.nsps[t];
                if (!e) {
                    e = new i(this, t), this.nsps[t] = e;
                    var n = this;
                    e.on('connect', function () {
                        e.id = n.engine.id, ~h(n.connected, e) || n.connected.push(e)
                    })
                }
                return e
            }, r.prototype.destroy = function (t) {
                var e = h(this.connected, t);
                ~e && this.connected.splice(e, 1), this.connected.length || this.close()
            }, r.prototype.packet = function (t) {
                u('writing packet %j', t);
                var e = this;
                e.encoding ? e.packetBuffer.push(t) : (e.encoding = !0, this.encoder.encode(t, function (t) {
                    for (var n = 0; n < t.length; n++) e.engine.write(t[n]);
                    e.encoding = !1, e.processPacketQueue()
                }))
            }, r.prototype.processPacketQueue = function () {
                if (this.packetBuffer.length > 0 && !this.encoding) {
                    var t = this.packetBuffer.shift();
                    this.packet(t)
                }
            }, r.prototype.cleanup = function () {
                for (var t; t = this.subs.shift();) t.destroy();
                this.packetBuffer = [], this.encoding = !1, this.decoder.destroy()
            }, r.prototype.close = r.prototype.disconnect = function () {
                this.skipReconnect = !0, this.backoff.reset(), this.readyState = 'closed', this.engine && this.engine.close()
            }, r.prototype.onclose = function (t) {
                u('close'), this.cleanup(), this.backoff.reset(), this.readyState = 'closed', this.emit('close', t), this._reconnection && !this.skipReconnect && this.reconnect()
            }, r.prototype.reconnect = function () {
                if (this.reconnecting || this.skipReconnect) return this;
                var t = this;
                if (this.backoff.attempts >= this._reconnectionAttempts) u('reconnect failed'), this.backoff.reset(), this.emitAll('reconnect_failed'), this.reconnecting = !1;
                else {
                    var e = this.backoff.duration();
                    u('will wait %dms before reconnect attempt', e), this.reconnecting = !0;
                    var n = setTimeout(function () {
                        t.skipReconnect || (u('attempting reconnect'), t.emitAll('reconnect_attempt', t.backoff.attempts), t.emitAll('reconnecting', t.backoff.attempts), t.skipReconnect || t.open(function (e) {
                            e ? (u('reconnect attempt error'), t.reconnecting = !1, t.reconnect(), t.emitAll('reconnect_error', e.data)) : (u('reconnect success'), t.onreconnect())
                        }))
                    }, e);
                    this.subs.push({
                        destroy: function () {
                            clearTimeout(n)
                        }
                    })
                }
            }, r.prototype.onreconnect = function () {
                var t = this.backoff.attempts;
                this.reconnecting = !1, this.backoff.reset(), this.updateSocketIds(), this.emitAll('reconnect', t)
            }
        }, {
            './on': 4,
            './socket': 5,
            './url': 6,
            backo2: 7,
            'component-bind': 8,
            'component-emitter': 9,
            debug: 10,
            'engine.io-client': 11,
            indexof: 40,
            'object-component': 41,
            'socket.io-parser': 44
        }],
        4: [function (t, e, n) {
            e.exports = function (t, e, n) {
                return t.on(e, n), {
                    destroy: function () {
                        t.removeListener(e, n)
                    }
                }
            }
        }, {}],
        5: [function (t, e, n) {
            function r(t, e) {
                this.io = t, this.nsp = e, this.json = this, this.ids = 0, this.acks = {}, this.io.autoConnect && this.open(), this.receiveBuffer = [], this.sendBuffer = [], this.connected = !1, this.disconnected = !0
            }

            var o = t('socket.io-parser'),
                i = t('component-emitter'),
                s = t('to-array'),
                a = t('./on'),
                c = t('component-bind'),
                p = t('debug')('socket.io-client:socket'),
                u = t('has-binary');
            e.exports = r;
            var h = {
                    connect: 1,
                    connect_error: 1,
                    connect_timeout: 1,
                    disconnect: 1,
                    error: 1,
                    reconnect: 1,
                    reconnect_attempt: 1,
                    reconnect_failed: 1,
                    reconnect_error: 1,
                    reconnecting: 1
                },
                f = i.prototype.emit;
            i(r.prototype), r.prototype.subEvents = function () {
                if (!this.subs) {
                    var t = this.io;
                    this.subs = [a(t, 'open', c(this, 'onopen')), a(t, 'packet', c(this, 'onpacket')), a(t, 'close', c(this, 'onclose'))]
                }
            }, r.prototype.open = r.prototype.connect = function () {
                return this.connected ? this : (this.subEvents(), this.io.open(), 'open' == this.io.readyState && this.onopen(), this)
            }, r.prototype.send = function () {
                var t = s(arguments);
                return t.unshift('message'), this.emit.apply(this, t), this
            }, r.prototype.emit = function (t) {
                if (h.hasOwnProperty(t)) return f.apply(this, arguments), this;
                var e = s(arguments),
                    n = o.EVENT;
                u(e) && (n = o.BINARY_EVENT);
                var r = {
                    type: n,
                    data: e
                };
                return 'function' == typeof e[e.length - 1] && (p('emitting packet with ack id %d', this.ids), this.acks[this.ids] = e.pop(), r.id = this.ids++), this.connected ? this.packet(r) : this.sendBuffer.push(r), this
            }, r.prototype.packet = function (t) {
                t.nsp = this.nsp, this.io.packet(t)
            }, r.prototype.onopen = function () {
                p('transport is open - connecting'), '/' != this.nsp && this.packet({
                    type: o.CONNECT
                })
            }, r.prototype.onclose = function (t) {
                p('close (%s)', t), this.connected = !1, this.disconnected = !0, delete this.id, this.emit('disconnect', t)
            }, r.prototype.onpacket = function (t) {
                if (t.nsp == this.nsp) switch (t.type) {
                    case o.CONNECT:
                        this.onconnect();
                        break;
                    case o.EVENT:
                    case o.BINARY_EVENT:
                        this.onevent(t);
                        break;
                    case o.ACK:
                    case o.BINARY_ACK:
                        this.onack(t);
                        break;
                    case o.DISCONNECT:
                        this.ondisconnect();
                        break;
                    case o.ERROR:
                        this.emit('error', t.data)
                }
            }, r.prototype.onevent = function (t) {
                var e = t.data || [];
                p('emitting event %j', e), null != t.id && (p('attaching ack callback to event'), e.push(this.ack(t.id))), this.connected ? f.apply(this, e) : this.receiveBuffer.push(e)
            }, r.prototype.ack = function (t) {
                var e = this,
                    n = !1;
                return function () {
                    if (!n) {
                        n = !0;
                        var r = s(arguments);
                        p('sending ack %j', r);
                        var i = u(r) ? o.BINARY_ACK : o.ACK;
                        e.packet({
                            type: i,
                            id: t,
                            data: r
                        })
                    }
                }
            }, r.prototype.onack = function (t) {
                p('calling ack %s with %j', t.id, t.data);
                this.acks[t.id].apply(this, t.data), delete this.acks[t.id]
            }, r.prototype.onconnect = function () {
                this.connected = !0, this.disconnected = !1, this.emit('connect'), this.emitBuffered()
            }, r.prototype.emitBuffered = function () {
                var t;
                for (t = 0; t < this.receiveBuffer.length; t++) f.apply(this, this.receiveBuffer[t]);
                for (this.receiveBuffer = [], t = 0; t < this.sendBuffer.length; t++) this.packet(this.sendBuffer[t]);
                this.sendBuffer = []
            }, r.prototype.ondisconnect = function () {
                p('server disconnect (%s)', this.nsp), this.destroy(), this.onclose('io server disconnect')
            }, r.prototype.destroy = function () {
                if (this.subs) {
                    for (var t = 0; t < this.subs.length; t++) this.subs[t].destroy();
                    this.subs = null
                }
                this.io.destroy(this)
            }, r.prototype.close = r.prototype.disconnect = function () {
                return this.connected && (p('performing disconnect (%s)', this.nsp), this.packet({
                    type: o.DISCONNECT
                })), this.destroy(), this.connected && this.onclose('io client disconnect'), this
            }
        }, {
            './on': 4,
            'component-bind': 8,
            'component-emitter': 9,
            debug: 10,
            'has-binary': 36,
            'socket.io-parser': 44,
            'to-array': 48
        }],
        6: [function (t, e, n) {
            (function (n) {
                var r = t('parseuri'),
                    o = t('debug')('socket.io-client:url');
                e.exports = function (t, e) {
                    var i = t,
                        e = e || n.location;
                    return null == t && (t = e.protocol + '//' + e.host), 'string' == typeof t && ('/' == t.charAt(0) && (t = '/' == t.charAt(1) ? e.protocol + t : e.hostname + t), /^(https?|wss?):\/\//.test(t) || (o('protocol-less url %s', t), t = void 0 !== e ? e.protocol + '//' + t : 'https://' + t), o('parse %s', t), i = r(t)), i.port || (/^(http|ws)$/.test(i.protocol) ? i.port = '80' : /^(http|ws)s$/.test(i.protocol) && (i.port = '443')), i.path = i.path || '/', i.id = i.protocol + '://' + i.host + ':' + i.port, i.href = i.protocol + '://' + i.host + (e && e.port == i.port ? '' : ':' + i.port), i
                }
            }).call(this, 'undefined' != typeof self ? self : 'undefined' != typeof window ? window : {})
        }, {
            debug: 10,
            parseuri: 42
        }],
        7: [function (t, e, n) {
            function r(t) {
                t = t || {}, this.ms = t.min || 100, this.max = t.max || 1e4, this.factor = t.factor || 2, this.jitter = t.jitter > 0 && t.jitter <= 1 ? t.jitter : 0, this.attempts = 0
            }

            e.exports = r, r.prototype.duration = function () {
                var t = this.ms * Math.pow(this.factor, this.attempts++);
                if (this.jitter) {
                    var e = Math.random(),
                        n = Math.floor(e * this.jitter * t);
                    t = 0 == (1 & Math.floor(10 * e)) ? t - n : t + n
                }
                return 0 | Math.min(t, this.max)
            }, r.prototype.reset = function () {
                this.attempts = 0
            }, r.prototype.setMin = function (t) {
                this.ms = t
            }, r.prototype.setMax = function (t) {
                this.max = t
            }, r.prototype.setJitter = function (t) {
                this.jitter = t
            }
        }, {}],
        8: [function (t, e, n) {
            var r = [].slice;
            e.exports = function (t, e) {
                if ('string' == typeof e && (e = t[e]), 'function' != typeof e) throw new Error('bind() requires a function');
                var n = r.call(arguments, 2);
                return function () {
                    return e.apply(t, n.concat(r.call(arguments)))
                }
            }
        }, {}],
        9: [function (t, e, n) {
            function r(t) {
                if (t) return function (t) {
                    for (var e in r.prototype) t[e] = r.prototype[e];
                    return t
                }(t)
            }

            e.exports = r, r.prototype.on = r.prototype.addEventListener = function (t, e) {
                return this._callbacks = this._callbacks || {}, (this._callbacks[t] = this._callbacks[t] || []).push(e), this
            }, r.prototype.once = function (t, e) {
                function n() {
                    r.off(t, n), e.apply(this, arguments)
                }

                var r = this;
                return this._callbacks = this._callbacks || {}, n.fn = e, this.on(t, n), this
            }, r.prototype.off = r.prototype.removeListener = r.prototype.removeAllListeners = r.prototype.removeEventListener = function (t, e) {
                if (this._callbacks = this._callbacks || {}, 0 == arguments.length) return this._callbacks = {}, this;
                var n = this._callbacks[t];
                if (!n) return this;
                if (1 == arguments.length) return delete this._callbacks[t], this;
                for (var r, o = 0; o < n.length; o++) if ((r = n[o]) === e || r.fn === e) {
                    n.splice(o, 1);
                    break
                }
                return this
            }, r.prototype.emit = function (t) {
                this._callbacks = this._callbacks || {};
                var e = [].slice.call(arguments, 1),
                    n = this._callbacks[t];
                if (n) for (var r = 0, o = (n = n.slice(0)).length; r < o; ++r) n[r].apply(this, e);
                return this
            }, r.prototype.listeners = function (t) {
                return this._callbacks = this._callbacks || {}, this._callbacks[t] || []
            }, r.prototype.hasListeners = function (t) {
                return !!this.listeners(t).length
            }
        }, {}],
        10: [function (t, e, n) {
            function r(t) {
                return r.enabled(t) ?
                    function (e) {
                        e = function (t) {
                            return t instanceof Error ? t.stack || t.message : t
                        }(e);
                        var n = new Date,
                            o = n - (r[t] || n);
                        r[t] = n, e = t + ' ' + e + ' +' + r.humanize(o), window.console && console.log && Function.prototype.apply.call(console.log, console, arguments)
                    } : function () {
                    }
            }

            e.exports = r, r.names = [], r.skips = [], r.enable = function (t) {
                try {
                    localStorage.debug = t
                } catch (t) {
                }
                for (var e = (t || '').split(/[\s,]+/), n = e.length, o = 0; o < n; o++) '-' === (t = e[o].replace('*', '.*?'))[0] ? r.skips.push(new RegExp('^' + t.substr(1) + '$')) : r.names.push(new RegExp('^' + t + '$'))
            }, r.disable = function () {
                r.enable('')
            }, r.humanize = function (t) {
                return t >= 36e5 ? (t / 36e5).toFixed(1) + 'h' : t >= 6e4 ? (t / 6e4).toFixed(1) + 'm' : t >= 1e3 ? (t / 1e3 | 0) + 's' : t + 'ms'
            }, r.enabled = function (t) {
                for (var e = 0, n = r.skips.length; e < n; e++) if (r.skips[e].test(t)) return !1;
                for (var e = 0, n = r.names.length; e < n; e++) if (r.names[e].test(t)) return !0;
                return !1
            };
            try {
                window.localStorage && r.enable(localStorage.debug)
            } catch (t) {
            }
        }, {}],
        11: [function (t, e, n) {
            e.exports = t('./lib/')
        }, {
            './lib/': 12
        }],
        12: [function (t, e, n) {
            e.exports = t('./socket'), e.exports.parser = t('engine.io-parser')
        }, {
            './socket': 13,
            'engine.io-parser': 25
        }],
        13: [function (t, e, n) {
            (function (n) {
                function r(t, e) {
                    if (!(this instanceof r)) return new r(t, e);
                    if (e = e || {}, t && 'object' == typeof t && (e = t, t = null), t && (t = p(t), e.host = t.host, e.secure = 'https' == t.protocol || 'wss' == t.protocol, e.port = t.port, t.query && (e.query = t.query)), this.secure = null != e.secure ? e.secure : n.location && 'https:' == location.protocol, e.host) {
                        var o = e.host.split(':');
                        e.hostname = o.shift(), o.length ? e.port = o.pop() : e.port || (e.port = this.secure ? '443' : '80')
                    }
                    this.agent = e.agent || !1, this.hostname = e.hostname || (n.location ? location.hostname : 'localhost'), this.port = e.port || (n.location && location.port ? location.port : this.secure ? 443 : 80), this.query = e.query || {}, 'string' == typeof this.query && (this.query = h.decode(this.query)), this.upgrade = !1 !== e.upgrade, this.path = (e.path || '/engine.io').replace(/\/$/, '') + '/', this.forceJSONP = !!e.forceJSONP, this.jsonp = !1 !== e.jsonp, this.forceBase64 = !!e.forceBase64, this.enablesXDR = !!e.enablesXDR, this.timestampParam = e.timestampParam || 't', this.timestampRequests = e.timestampRequests, this.transports = e.transports || ['polling', 'websocket'], this.readyState = '', this.writeBuffer = [], this.callbackBuffer = [], this.policyPort = e.policyPort || 843, this.rememberUpgrade = e.rememberUpgrade || !1, this.binaryType = null, this.onlyBinaryUpgrades = e.onlyBinaryUpgrades, this.pfx = e.pfx || null, this.key = e.key || null, this.passphrase = e.passphrase || null, this.cert = e.cert || null, this.ca = e.ca || null, this.ciphers = e.ciphers || null, this.rejectUnauthorized = e.rejectUnauthorized || null, this.open()
                }

                var o = t('./transports'),
                    i = t('component-emitter'),
                    s = t('debug')('engine.io-client:socket'),
                    a = t('indexof'),
                    c = t('engine.io-parser'),
                    p = t('parseuri'),
                    u = t('parsejson'),
                    h = t('parseqs');
                e.exports = r, r.priorWebsocketSuccess = !1, i(r.prototype), r.protocol = c.protocol, r.Socket = r, r.Transport = t('./transport'), r.transports = t('./transports'), r.parser = t('engine.io-parser'), r.prototype.createTransport = function (t) {
                    s('creating transport "%s"', t);
                    var e = function (t) {
                        var e = {};
                        for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
                        return e
                    }(this.query);
                    e.EIO = c.protocol, e.transport = t, this.id && (e.sid = this.id);
                    return new o[t]({
                        agent: this.agent,
                        hostname: this.hostname,
                        port: this.port,
                        secure: this.secure,
                        path: this.path,
                        query: e,
                        forceJSONP: this.forceJSONP,
                        jsonp: this.jsonp,
                        forceBase64: this.forceBase64,
                        enablesXDR: this.enablesXDR,
                        timestampRequests: this.timestampRequests,
                        timestampParam: this.timestampParam,
                        policyPort: this.policyPort,
                        socket: this,
                        pfx: this.pfx,
                        key: this.key,
                        passphrase: this.passphrase,
                        cert: this.cert,
                        ca: this.ca,
                        ciphers: this.ciphers,
                        rejectUnauthorized: this.rejectUnauthorized
                    })
                }, r.prototype.open = function () {
                    if (this.rememberUpgrade && r.priorWebsocketSuccess && -1 != this.transports.indexOf('websocket')) e = 'websocket';
                    else {
                        if (0 == this.transports.length) {
                            var t = this;
                            return void setTimeout(function () {
                                t.emit('error', 'No transports available')
                            }, 0)
                        }
                        e = this.transports[0]
                    }
                    this.readyState = 'opening';
                    var e;
                    try {
                        e = this.createTransport(e)
                    } catch (t) {
                        return this.transports.shift(), void this.open()
                    }
                    e.open(), this.setTransport(e)
                }, r.prototype.setTransport = function (t) {
                    s('setting transport %s', t.name);
                    var e = this;
                    this.transport && (s('clearing existing transport %s', this.transport.name), this.transport.removeAllListeners()), this.transport = t, t.on('drain', function () {
                        e.onDrain()
                    }).on('packet', function (t) {
                        e.onPacket(t)
                    }).on('error', function (t) {
                        e.onError(t)
                    }).on('close', function () {
                        e.onClose('transport close')
                    })
                }, r.prototype.probe = function (t) {
                    function e() {
                        if (f.onlyBinaryUpgrades) {
                            var e = !this.supportsBinary && f.transport.supportsBinary;
                            h = h || e
                        }
                        h || (s('probe transport "%s" opened', t), u.send([{
                            type: 'ping',
                            data: 'probe'
                        }]), u.once('packet', function (e) {
                            if (!h) if ('pong' == e.type && 'probe' == e.data) {
                                if (s('probe transport "%s" pong', t), f.upgrading = !0, f.emit('upgrading', u), !u) return;
                                r.priorWebsocketSuccess = 'websocket' == u.name, s('pausing current transport "%s"', f.transport.name), f.transport.pause(function () {
                                    h || 'closed' != f.readyState && (s('changing transport and sending upgrade packet'), p(), f.setTransport(u), u.send([{
                                        type: 'upgrade'
                                    }]), f.emit('upgrade', u), u = null, f.upgrading = !1, f.flush())
                                })
                            } else {
                                s('probe transport "%s" failed', t);
                                var n = new Error('probe error');
                                n.transport = u.name, f.emit('upgradeError', n)
                            }
                        }))
                    }

                    function n() {
                        h || (h = !0, p(), u.close(), u = null)
                    }

                    function o(e) {
                        var r = new Error('probe error: ' + e);
                        r.transport = u.name, n(), s('probe transport "%s" failed because of error: %s', t, e), f.emit('upgradeError', r)
                    }

                    function i() {
                        o('transport closed')
                    }

                    function a() {
                        o('socket closed')
                    }

                    function c(t) {
                        u && t.name != u.name && (s('"%s" works - aborting "%s"', t.name, u.name), n())
                    }

                    function p() {
                        u.removeListener('open', e), u.removeListener('error', o), u.removeListener('close', i), f.removeListener('close', a), f.removeListener('upgrading', c)
                    }

                    s('probing transport "%s"', t);
                    var u = this.createTransport(t, {
                            probe: 1
                        }),
                        h = !1,
                        f = this;
                    r.priorWebsocketSuccess = !1, u.once('open', e), u.once('error', o), u.once('close', i), this.once('close', a), this.once('upgrading', c), u.open()
                }, r.prototype.onOpen = function () {
                    if (s('socket open'), this.readyState = 'open', r.priorWebsocketSuccess = 'websocket' == this.transport.name, this.emit('open'), this.flush(), 'open' == this.readyState && this.upgrade && this.transport.pause) {
                        s('starting upgrade probes');
                        for (var t = 0, e = this.upgrades.length; t < e; t++) this.probe(this.upgrades[t])
                    }
                }, r.prototype.onPacket = function (t) {
                    if ('opening' == this.readyState || 'open' == this.readyState) switch (s('socket receive: type "%s", data "%s"', t.type, t.data), this.emit('packet', t), this.emit('heartbeat'), t.type) {
                        case 'open':
                            this.onHandshake(u(t.data));
                            break;
                        case 'pong':
                            this.setPing();
                            break;
                        case 'error':
                            var e = new Error('server error');
                            e.code = t.data, this.emit('error', e);
                            break;
                        case 'message':
                            this.emit('data', t.data), this.emit('message', t.data)
                    } else s('packet received with socket readyState "%s"', this.readyState)
                }, r.prototype.onHandshake = function (t) {
                    this.emit('handshake', t), this.id = t.sid, this.transport.query.sid = t.sid, this.upgrades = this.filterUpgrades(t.upgrades), this.pingInterval = t.pingInterval, this.pingTimeout = t.pingTimeout, this.onOpen(), 'closed' != this.readyState && (this.setPing(), this.removeListener('heartbeat', this.onHeartbeat), this.on('heartbeat', this.onHeartbeat))
                }, r.prototype.onHeartbeat = function (t) {
                    clearTimeout(this.pingTimeoutTimer);
                    var e = this;
                    e.pingTimeoutTimer = setTimeout(function () {
                        'closed' != e.readyState && e.onClose('ping timeout')
                    }, t || e.pingInterval + e.pingTimeout)
                }, r.prototype.setPing = function () {
                    var t = this;
                    clearTimeout(t.pingIntervalTimer), t.pingIntervalTimer = setTimeout(function () {
                        s('writing ping packet - expecting pong within %sms', t.pingTimeout), t.ping(), t.onHeartbeat(t.pingTimeout)
                    }, t.pingInterval)
                }, r.prototype.ping = function () {
                    this.sendPacket('ping')
                }, r.prototype.onDrain = function () {
                    for (var t = 0; t < this.prevBufferLen; t++) this.callbackBuffer[t] && this.callbackBuffer[t]();
                    this.writeBuffer.splice(0, this.prevBufferLen), this.callbackBuffer.splice(0, this.prevBufferLen), this.prevBufferLen = 0, 0 == this.writeBuffer.length ? this.emit('drain') : this.flush()
                }, r.prototype.flush = function () {
                    'closed' != this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length && (s('flushing %d packets in socket', this.writeBuffer.length), this.transport.send(this.writeBuffer), this.prevBufferLen = this.writeBuffer.length, this.emit('flush'))
                }, r.prototype.write = r.prototype.send = function (t, e) {
                    return this.sendPacket('message', t, e), this
                }, r.prototype.sendPacket = function (t, e, n) {
                    if ('closing' != this.readyState && 'closed' != this.readyState) {
                        var r = {
                            type: t,
                            data: e
                        };
                        this.emit('packetCreate', r), this.writeBuffer.push(r), this.callbackBuffer.push(n), this.flush()
                    }
                }, r.prototype.close = function () {
                    function t() {
                        r.onClose('forced close'), s('socket closing - telling transport to close'), r.transport.close()
                    }

                    function e() {
                        r.removeListener('upgrade', e), r.removeListener('upgradeError', e), t()
                    }

                    function n() {
                        r.once('upgrade', e), r.once('upgradeError', e)
                    }

                    if ('opening' == this.readyState || 'open' == this.readyState) {
                        this.readyState = 'closing';
                        var r = this;
                        this.writeBuffer.length ? this.once('drain', function () {
                            this.upgrading ? n() : t()
                        }) : this.upgrading ? n() : t()
                    }
                    return this
                }, r.prototype.onError = function (t) {
                    s('socket error %j', t), r.priorWebsocketSuccess = !1, this.emit('error', t), this.onClose('transport error', t)
                }, r.prototype.onClose = function (t, e) {
                    if ('opening' == this.readyState || 'open' == this.readyState || 'closing' == this.readyState) {
                        s('socket close with reason: "%s"', t);
                        var n = this;
                        clearTimeout(this.pingIntervalTimer), clearTimeout(this.pingTimeoutTimer), setTimeout(function () {
                            n.writeBuffer = [], n.callbackBuffer = [], n.prevBufferLen = 0
                        }, 0), this.transport.removeAllListeners('close'), this.transport.close(), this.transport.removeAllListeners(), this.readyState = 'closed', this.id = null, this.emit('close', t, e)
                    }
                }, r.prototype.filterUpgrades = function (t) {
                    for (var e = [], n = 0, r = t.length; n < r; n++) ~a(this.transports, t[n]) && e.push(t[n]);
                    return e
                }
            }).call(this, 'undefined' != typeof self ? self : 'undefined' != typeof window ? window : {})
        }, {
            './transport': 14,
            './transports': 15,
            'component-emitter': 9,
            debug: 22,
            'engine.io-parser': 25,
            indexof: 40,
            parsejson: 32,
            parseqs: 33,
            parseuri: 34
        }],
        14: [function (t, e, n) {
            function r(t) {
                this.path = t.path, this.hostname = t.hostname, this.port = t.port, this.secure = t.secure, this.query = t.query, this.timestampParam = t.timestampParam, this.timestampRequests = t.timestampRequests, this.readyState = '', this.agent = t.agent || !1, this.socket = t.socket, this.enablesXDR = t.enablesXDR, this.pfx = t.pfx, this.key = t.key, this.passphrase = t.passphrase, this.cert = t.cert, this.ca = t.ca, this.ciphers = t.ciphers, this.rejectUnauthorized = t.rejectUnauthorized
            }

            var o = t('engine.io-parser'),
                i = t('component-emitter');
            e.exports = r, i(r.prototype), r.timestamps = 0, r.prototype.onError = function (t, e) {
                var n = new Error(t);
                return n.type = 'TransportError', n.description = e, this.emit('error', n), this
            }, r.prototype.open = function () {
                return 'closed' != this.readyState && '' != this.readyState || (this.readyState = 'opening', this.doOpen()), this
            }, r.prototype.close = function () {
                return 'opening' != this.readyState && 'open' != this.readyState || (this.doClose(), this.onClose()), this
            }, r.prototype.send = function (t) {
                if ('open' != this.readyState) throw new Error('Transport not open');
                this.write(t)
            }, r.prototype.onOpen = function () {
                this.readyState = 'open', this.writable = !0, this.emit('open')
            }, r.prototype.onData = function (t) {
                var e = o.decodePacket(t, this.socket.binaryType);
                this.onPacket(e)
            }, r.prototype.onPacket = function (t) {
                this.emit('packet', t)
            }, r.prototype.onClose = function () {
                this.readyState = 'closed', this.emit('close')
            }
        }, {
            'component-emitter': 9,
            'engine.io-parser': 25
        }],
        15: [function (t, e, n) {
            (function (e) {
                var r = t('xmlhttprequest'),
                    o = t('./polling-xhr'),
                    i = t('./polling-jsonp'),
                    s = t('./websocket');
                n.polling = function (t) {
                    var n = !1,
                        s = !1,
                        a = !1 !== t.jsonp;
                    if (e.location) {
                        var c = 'https:' == location.protocol,
                            p = location.port;
                        p || (p = c ? 443 : 80), n = t.hostname != location.hostname || p != t.port, s = t.secure != c
                    }
                    if (t.xdomain = n, t.xscheme = s, 'open' in new r(t) && !t.forceJSONP) return new o(t);
                    if (!a) throw new Error('JSONP disabled');
                    return new i(t)
                }, n.websocket = s
            }).call(this, 'undefined' != typeof self ? self : 'undefined' != typeof window ? window : {})
        }, {
            './polling-jsonp': 16,
            './polling-xhr': 17,
            './websocket': 19,
            xmlhttprequest: 20
        }],
        16: [function (t, e, n) {
            (function (n) {
                function r() {
                }

                function o(t) {
                    i.call(this, t), this.query = this.query || {}, a || (n.___eio || (n.___eio = []), a = n.___eio), this.index = a.length;
                    var e = this;
                    a.push(function (t) {
                        e.onData(t)
                    }), this.query.j = this.index, n.document && n.addEventListener && n.addEventListener('beforeunload', function () {
                        e.script && (e.script.onerror = r)
                    }, !1)
                }

                var i = t('./polling'),
                    s = t('component-inherit');
                e.exports = o;
                var a, c = /\n/g,
                    p = /\\n/g;
                s(o, i), o.prototype.supportsBinary = !1, o.prototype.doClose = function () {
                    this.script && (this.script.parentNode.removeChild(this.script), this.script = null), this.form && (this.form.parentNode.removeChild(this.form), this.form = null, this.iframe = null), i.prototype.doClose.call(this)
                }, o.prototype.doPoll = function () {
                    var t = this,
                        e = document.createElement('script');
                    this.script && (this.script.parentNode.removeChild(this.script), this.script = null), e.async = !0, e.src = this.uri(), e.onerror = function (e) {
                        t.onError('jsonp poll error', e)
                    };
                    var n = document.getElementsByTagName('script')[0];
                    n.parentNode.insertBefore(e, n), this.script = e;
                    'undefined' != typeof navigator && /gecko/i.test(navigator.userAgent) && setTimeout(function () {
                        var t = document.createElement('iframe');
                        document.body.appendChild(t), document.body.removeChild(t)
                    }, 100)
                }, o.prototype.doWrite = function (t, e) {
                    function n() {
                        r(), e()
                    }

                    function r() {
                        if (o.iframe) try {
                            o.form.removeChild(o.iframe)
                        } catch (t) {
                            o.onError('jsonp polling iframe removal error', t)
                        }
                        try {
                            var t = '<iframe src="javascript:0" name="' + o.iframeId + '">';
                            i = document.createElement(t)
                        } catch (t) {
                            (i = document.createElement('iframe')).name = o.iframeId, i.src = 'javascript:0'
                        }
                        i.id = o.iframeId, o.form.appendChild(i), o.iframe = i
                    }

                    var o = this;
                    if (!this.form) {
                        var i, s = document.createElement('form'),
                            a = document.createElement('textarea'),
                            u = this.iframeId = 'eio_iframe_' + this.index;
                        s.className = 'socketio', s.style.position = 'absolute', s.style.top = '-1000px', s.style.left = '-1000px', s.target = u, s.method = 'POST', s.setAttribute('accept-charset', 'utf-8'), a.name = 'd', s.appendChild(a), document.body.appendChild(s), this.form = s, this.area = a
                    }
                    this.form.action = this.uri(), r(), t = t.replace(p, '\\\n'), this.area.value = t.replace(c, '\\n');
                    try {
                        this.form.submit()
                    } catch (t) {
                    }
                    this.iframe.attachEvent ? this.iframe.onreadystatechange = function () {
                        'complete' == o.iframe.readyState && n()
                    } : this.iframe.onload = n
                }
            }).call(this, 'undefined' != typeof self ? self : 'undefined' != typeof window ? window : {})
        }, {
            './polling': 18,
            'component-inherit': 21
        }],
        17: [function (t, e, n) {
            (function (n) {
                function r() {
                }

                function o(t) {
                    if (c.call(this, t), n.location) {
                        var e = 'https:' == location.protocol,
                            r = location.port;
                        r || (r = e ? 443 : 80), this.xd = t.hostname != n.location.hostname || r != t.port, this.xs = t.secure != e
                    }
                }

                function i(t) {
                    this.method = t.method || 'GET', this.uri = t.uri, this.xd = !!t.xd, this.xs = !!t.xs, this.async = !1 !== t.async, this.data = void 0 != t.data ? t.data : null, this.agent = t.agent, this.isBinary = t.isBinary, this.supportsBinary = t.supportsBinary, this.enablesXDR = t.enablesXDR, this.pfx = t.pfx, this.key = t.key, this.passphrase = t.passphrase, this.cert = t.cert, this.ca = t.ca, this.ciphers = t.ciphers, this.rejectUnauthorized = t.rejectUnauthorized, this.create()
                }

                function s() {
                    for (var t in i.requests) i.requests.hasOwnProperty(t) && i.requests[t].abort()
                }

                var a = t('xmlhttprequest'),
                    c = t('./polling'),
                    p = t('component-emitter'),
                    u = t('component-inherit'),
                    h = t('debug')('engine.io-client:polling-xhr');
                e.exports = o, e.exports.Request = i, u(o, c), o.prototype.supportsBinary = !0, o.prototype.request = function (t) {
                    return t = t || {}, t.uri = this.uri(), t.xd = this.xd, t.xs = this.xs, t.agent = this.agent || !1, t.supportsBinary = this.supportsBinary, t.enablesXDR = this.enablesXDR, t.pfx = this.pfx, t.key = this.key, t.passphrase = this.passphrase, t.cert = this.cert, t.ca = this.ca, t.ciphers = this.ciphers, t.rejectUnauthorized = this.rejectUnauthorized, new i(t)
                }, o.prototype.doWrite = function (t, e) {
                    var n = 'string' != typeof t && void 0 !== t,
                        r = this.request({
                            method: 'POST',
                            data: t,
                            isBinary: n
                        }),
                        o = this;
                    r.on('success', e), r.on('error', function (t) {
                        o.onError('xhr post error', t)
                    }), this.sendXhr = r
                }, o.prototype.doPoll = function () {
                    h('xhr poll');
                    var t = this.request(),
                        e = this;
                    t.on('data', function (t) {
                        e.onData(t)
                    }), t.on('error', function (t) {
                        e.onError('xhr poll error', t)
                    }), this.pollXhr = t
                }, p(i.prototype), i.prototype.create = function () {
                    var t = {
                        agent: this.agent,
                        xdomain: this.xd,
                        xscheme: this.xs,
                        enablesXDR: this.enablesXDR
                    };
                    t.pfx = this.pfx, t.key = this.key, t.passphrase = this.passphrase, t.cert = this.cert, t.ca = this.ca, t.ciphers = this.ciphers, t.rejectUnauthorized = this.rejectUnauthorized;
                    var e = this.xhr = new a(t),
                        r = this;
                    try {
                        if (h('xhr open %s: %s', this.method, this.uri), e.open(this.method, this.uri, this.async), this.supportsBinary && (e.responseType = 'arraybuffer'), 'POST' == this.method) try {
                            this.isBinary ? e.setRequestHeader('Content-type', 'application/octet-stream') : e.setRequestHeader('Content-type', 'text/plain;charset=UTF-8')
                        } catch (t) {
                        }
                        'withCredentials' in e && (e.withCredentials = !0), this.hasXDR() ? (e.onload = function () {
                            r.onLoad()
                        }, e.onerror = function () {
                            r.onError(e.responseText)
                        }) : e.onreadystatechange = function () {
                            4 == e.readyState && (200 == e.status || 1223 == e.status ? r.onLoad() : setTimeout(function () {
                                r.onError(e.status)
                            }, 0))
                        }, h('xhr data %s', this.data), e.send(this.data)
                    } catch (t) {
                        return void setTimeout(function () {
                            r.onError(t)
                        }, 0)
                    }
                    n.document && (this.index = i.requestsCount++, i.requests[this.index] = this)
                }, i.prototype.onSuccess = function () {
                    this.emit('success'), this.cleanup()
                }, i.prototype.onData = function (t) {
                    this.emit('data', t), this.onSuccess()
                }, i.prototype.onError = function (t) {
                    this.emit('error', t), this.cleanup(!0)
                }, i.prototype.cleanup = function (t) {
                    if (void 0 !== this.xhr && null !== this.xhr) {
                        if (this.hasXDR() ? this.xhr.onload = this.xhr.onerror = r : this.xhr.onreadystatechange = r, t) try {
                            this.xhr.abort()
                        } catch (t) {
                        }
                        n.document && delete i.requests[this.index], this.xhr = null
                    }
                }, i.prototype.onLoad = function () {
                    var t;
                    try {
                        var e;
                        try {
                            e = this.xhr.getResponseHeader('Content-Type').split(';')[0]
                        } catch (t) {
                        }
                        t = 'application/octet-stream' === e ? this.xhr.response : this.supportsBinary ? 'ok' : this.xhr.responseText
                    } catch (t) {
                        this.onError(t)
                    }
                    null != t && this.onData(t)
                }, i.prototype.hasXDR = function () {
                    return void 0 !== n.XDomainRequest && !this.xs && this.enablesXDR
                }, i.prototype.abort = function () {
                    this.cleanup()
                }, n.document && (i.requestsCount = 0, i.requests = {}, n.attachEvent ? n.attachEvent('onunload', s) : n.addEventListener && n.addEventListener('beforeunload', s, !1))
            }).call(this, 'undefined' != typeof self ? self : 'undefined' != typeof window ? window : {})
        }, {
            './polling': 18,
            'component-emitter': 9,
            'component-inherit': 21,
            debug: 22,
            xmlhttprequest: 20
        }],
        18: [function (t, e, n) {
            function r(t) {
                var e = t && t.forceBase64;
                p && !e || (this.supportsBinary = !1), o.call(this, t)
            }

            var o = t('../transport'),
                i = t('parseqs'),
                s = t('engine.io-parser'),
                a = t('component-inherit'),
                c = t('debug')('engine.io-client:polling');
            e.exports = r;
            var p = null != new (t('xmlhttprequest'))({
                xdomain: !1
            }).responseType;
            a(r, o), r.prototype.name = 'polling', r.prototype.doOpen = function () {
                this.poll()
            }, r.prototype.pause = function (t) {
                function e() {
                    c('paused'), n.readyState = 'paused', t()
                }

                var n = this;
                if (this.readyState = 'pausing', this.polling || !this.writable) {
                    var r = 0;
                    this.polling && (c('we are currently polling - waiting to pause'), r++, this.once('pollComplete', function () {
                        c('pre-pause polling complete'), --r || e()
                    })), this.writable || (c('we are currently writing - waiting to pause'), r++, this.once('drain', function () {
                        c('pre-pause writing complete'), --r || e()
                    }))
                } else e()
            }, r.prototype.poll = function () {
                c('polling'), this.polling = !0, this.doPoll(), this.emit('poll')
            }, r.prototype.onData = function (t) {
                var e = this;
                c('polling got data %s', t);
                s.decodePayload(t, this.socket.binaryType, function (t, n, r) {
                    if ('opening' == e.readyState && e.onOpen(), 'close' == t.type) return e.onClose(), !1;
                    e.onPacket(t)
                }), 'closed' != this.readyState && (this.polling = !1, this.emit('pollComplete'), 'open' == this.readyState ? this.poll() : c('ignoring poll - transport state "%s"', this.readyState))
            }, r.prototype.doClose = function () {
                function t() {
                    c('writing close packet'), e.write([{
                        type: 'close'
                    }])
                }

                var e = this;
                'open' == this.readyState ? (c('transport open - closing'), t()) : (c('transport not open - deferring close'), this.once('open', t))
            }, r.prototype.write = function (t) {
                n = this;
                this.writable = !1;
                var e = function () {
                        n.writable = !0, n.emit('drain')
                    },
                    n = this;
                s.encodePayload(t, this.supportsBinary, function (t) {
                    n.doWrite(t, e)
                })
            }, r.prototype.uri = function () {
                var t = this.query || {},
                    e = this.secure ? 'https' : 'http',
                    n = '';
                return !1 !== this.timestampRequests && (t[this.timestampParam] = +new Date + '-' + o.timestamps++), this.supportsBinary || t.sid || (t.b64 = 1), t = i.encode(t), this.port && ('https' == e && 443 != this.port || 'http' == e && 80 != this.port) && (n = ':' + this.port), t.length && (t = '?' + t), e + '://' + this.hostname + n + this.path + t
            }
        }, {
            '../transport': 14,
            'component-inherit': 21,
            debug: 22,
            'engine.io-parser': 25,
            parseqs: 33,
            xmlhttprequest: 20
        }],
        19: [function (t, e, n) {
            function r(t) {
                t && t.forceBase64 && (this.supportsBinary = !1), o.call(this, t)
            }

            var o = t('../transport'),
                i = t('engine.io-parser'),
                s = t('parseqs'),
                a = t('component-inherit'),
                c = t('debug')('engine.io-client:websocket'),
                p = t('ws');
            e.exports = r, a(r, o), r.prototype.name = 'websocket', r.prototype.supportsBinary = !0, r.prototype.doOpen = function () {
                if (this.check()) {
                    var t = this.uri(),
                        e = {
                            agent: this.agent
                        };
                    e.pfx = this.pfx, e.key = this.key, e.passphrase = this.passphrase, e.cert = this.cert, e.ca = this.ca, e.ciphers = this.ciphers, e.rejectUnauthorized = this.rejectUnauthorized, this.ws = new p(t, void 0, e), void 0 === this.ws.binaryType && (this.supportsBinary = !1), this.ws.binaryType = 'arraybuffer', this.addEventListeners()
                }
            }, r.prototype.addEventListeners = function () {
                var t = this;
                this.ws.onopen = function () {
                    t.onOpen()
                }, this.ws.onclose = function () {
                    t.onClose()
                }, this.ws.onmessage = function (e) {
                    t.onData(e.data)
                }, this.ws.onerror = function (e) {
                    t.onError('websocket error', e)
                }
            }, 'undefined' != typeof navigator && /iPad|iPhone|iPod/i.test(navigator.userAgent) && (r.prototype.onData = function (t) {
                var e = this;
                setTimeout(function () {
                    o.prototype.onData.call(e, t)
                }, 0)
            }), r.prototype.write = function (t) {
                var e = this;
                this.writable = !1;
                for (var n = 0, r = t.length; n < r; n++) i.encodePacket(t[n], this.supportsBinary, function (t) {
                    try {
                        e.ws.send(t)
                    } catch (t) {
                        c('websocket closed before onclose event')
                    }
                });
                setTimeout(function () {
                    e.writable = !0, e.emit('drain')
                }, 0)
            }, r.prototype.onClose = function () {
                o.prototype.onClose.call(this)
            }, r.prototype.doClose = function () {
                void 0 !== this.ws && this.ws.close()
            }, r.prototype.uri = function () {
                var t = this.query || {},
                    e = this.secure ? 'wss' : 'ws',
                    n = '';
                return this.port && ('wss' == e && 443 != this.port || 'ws' == e && 80 != this.port) && (n = ':' + this.port), this.timestampRequests && (t[this.timestampParam] = +new Date), this.supportsBinary || (t.b64 = 1), (t = s.encode(t)).length && (t = '?' + t), e + '://' + this.hostname + n + this.path + t
            }, r.prototype.check = function () {
                return !(!p || '__initialize' in p && this.name === r.prototype.name)
            }
        }, {
            '../transport': 14,
            'component-inherit': 21,
            debug: 22,
            'engine.io-parser': 25,
            parseqs: 33,
            ws: 35
        }],
        20: [function (t, e, n) {
            var r = t('has-cors');
            e.exports = function (t) {
                var e = t.xdomain,
                    n = t.xscheme,
                    o = t.enablesXDR;
                try {
                    if ('undefined' != typeof XMLHttpRequest && (!e || r)) return new XMLHttpRequest
                } catch (t) {
                }
                try {
                    if ('undefined' != typeof XDomainRequest && !n && o) return new XDomainRequest
                } catch (t) {
                }
                if (!e) try {
                    return new ActiveXObject('Microsoft.XMLHTTP')
                } catch (t) {
                }
            }
        }, {
            'has-cors': 38
        }],
        21: [function (t, e, n) {
            e.exports = function (t, e) {
                var n = function () {
                };
                n.prototype = e.prototype, t.prototype = new n, t.prototype.constructor = t
            }
        }, {}],
        22: [function (t, e, n) {
            function r() {
                var t;
                try {
                    t = localStorage.debug
                } catch (t) {
                }
                return t
            }

            (n = e.exports = t('./debug')).log = function () {
                return 'object' == typeof console && 'function' == typeof console.log && Function.prototype.apply.call(console.log, console, arguments)
            }, n.formatArgs = function () {
                var t = arguments,
                    e = this.useColors;
                if (t[0] = (e ? '%c' : '') + this.namespace + (e ? ' %c' : ' ') + t[0] + (e ? '%c ' : ' ') + '+' + n.humanize(this.diff), !e) return t;
                var r = 'color: ' + this.color,
                    o = 0,
                    i = 0;
                return (t = [t[0], r, 'color: inherit'].concat(Array.prototype.slice.call(t, 1)))[0].replace(/%[a-z%]/g, function (t) {
                    '%%' !== t && (o++, '%c' === t && (i = o))
                }), t.splice(i, 0, r), t
            }, n.save = function (t) {
                try {
                    null == t ? localStorage.removeItem('debug') : localStorage.debug = t
                } catch (t) {
                }
            }, n.load = r, n.useColors = function () {
                return 'WebkitAppearance' in document.documentElement.style || window.console && (console.firebug || console.exception && console.table) || navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31
            }, n.colors = ['lightseagreen', 'forestgreen', 'goldenrod', 'dodgerblue', 'darkorchid', 'crimson'], n.formatters.j = function (t) {
                return JSON.stringify(t)
            }, n.enable(r())
        }, {
            './debug': 23
        }],
        23: [function (t, e, n) {
            (n = e.exports = function (t) {
                function e() {
                }

                function i() {
                    var t = i,
                        e = +new Date,
                        s = e - (r || e);
                    t.diff = s, t.prev = r, t.curr = e, r = e, null == t.useColors && (t.useColors = n.useColors()), null == t.color && t.useColors && (t.color = n.colors[o++ % n.colors.length]);
                    var a = Array.prototype.slice.call(arguments);
                    a[0] = n.coerce(a[0]), 'string' != typeof a[0] && (a = ['%o'].concat(a));
                    var c = 0;
                    a[0] = a[0].replace(/%([a-z%])/g, function (e, r) {
                        if ('%%' === e) return e;
                        c++;
                        var o = n.formatters[r];
                        if ('function' == typeof o) {
                            var i = a[c];
                            e = o.call(t, i), a.splice(c, 1), c--
                        }
                        return e
                    }), 'function' == typeof n.formatArgs && (a = n.formatArgs.apply(t, a)), (i.log || n.log || console.log.bind(console)).apply(t, a)
                }

                e.enabled = !1, i.enabled = !0;
                var s = n.enabled(t) ? i : e;
                return s.namespace = t, s
            }).coerce = function (t) {
                return t instanceof Error ? t.stack || t.message : t
            }, n.disable = function () {
                n.enable('')
            }, n.enable = function (t) {
                n.save(t);
                for (var e = (t || '').split(/[\s,]+/), r = e.length, o = 0; o < r; o++) e[o] && ('-' === (t = e[o].replace(/\*/g, '.*?'))[0] ? n.skips.push(new RegExp('^' + t.substr(1) + '$')) : n.names.push(new RegExp('^' + t + '$')))
            }, n.enabled = function (t) {
                var e, r;
                for (e = 0, r = n.skips.length; e < r; e++) if (n.skips[e].test(t)) return !1;
                for (e = 0, r = n.names.length; e < r; e++) if (n.names[e].test(t)) return !0;
                return !1
            }, n.humanize = t('ms'), n.names = [], n.skips = [], n.formatters = {};
            var r, o = 0
        }, {
            ms: 24
        }],
        24: [function (t, e, n) {
            function r(t, e, n) {
                if (!(t < e)) return t < 1.5 * e ? Math.floor(t / e) + ' ' + n : Math.ceil(t / e) + ' ' + n + 's'
            }

            var o = 1e3,
                i = 60 * o,
                s = 60 * i,
                a = 24 * s,
                c = 365.25 * a;
            e.exports = function (t, e) {
                return e = e || {}, 'string' == typeof t ?
                    function (t) {
                        var e = /^((?:\d+)?\.?\d+) *(ms|seconds?|s|minutes?|m|hours?|h|days?|d|years?|y)?$/i.exec(t);
                        if (e) {
                            var n = parseFloat(e[1]);
                            switch ((e[2] || 'ms').toLowerCase()) {
                                case 'years':
                                case 'year':
                                case 'y':
                                    return n * c;
                                case 'days':
                                case 'day':
                                case 'd':
                                    return n * a;
                                case 'hours':
                                case 'hour':
                                case 'h':
                                    return n * s;
                                case 'minutes':
                                case 'minute':
                                case 'm':
                                    return n * i;
                                case 'seconds':
                                case 'second':
                                case 's':
                                    return n * o;
                                case 'ms':
                                    return n
                            }
                        }
                    }(t) : e.long ?
                        function (t) {
                            return r(t, a, 'day') || r(t, s, 'hour') || r(t, i, 'minute') || r(t, o, 'second') || t + ' ms'
                        }(t) : function (t) {
                            return t >= a ? Math.round(t / a) + 'd' : t >= s ? Math.round(t / s) + 'h' : t >= i ? Math.round(t / i) + 'm' : t >= o ? Math.round(t / o) + 's' : t + 'ms'
                        }(t)
            }
        }, {}],
        25: [function (t, e, n) {
            (function (e) {
                function r(t, e, r) {
                    if (!e) return n.encodeBase64Packet(t, r);
                    if (l) return function (t, e, r) {
                        if (!e) return n.encodeBase64Packet(t, r);
                        var o = new FileReader;
                        return o.onload = function () {
                            t.data = o.result, n.encodePacket(t, e, !0, r)
                        }, o.readAsArrayBuffer(t.data)
                    }(t, e, r);
                    var o = new Uint8Array(1);
                    o[0] = d[t.type];
                    return r(new m([o.buffer, t.data]))
                }

                function o(t, e, n) {
                    for (var r = new Array(t.length), o = p(t.length, n), i = function (t, n, o) {
                        e(n, function (e, n) {
                            r[t] = n, o(e, r)
                        })
                    }, s = 0; s < t.length; s++) i(s, t[s], o)
                }

                var i = t('./keys'),
                    s = t('has-binary'),
                    a = t('arraybuffer.slice'),
                    c = t('base64-arraybuffer'),
                    p = t('after'),
                    u = t('utf8'),
                    h = navigator.userAgent.match(/Android/i),
                    f = /PhantomJS/i.test(navigator.userAgent),
                    l = h || f;
                n.protocol = 3;
                var d = n.packets = {
                        open: 0,
                        close: 1,
                        ping: 2,
                        pong: 3,
                        message: 4,
                        upgrade: 5,
                        noop: 6
                    },
                    y = i(d),
                    g = {
                        type: 'error',
                        data: 'parser error'
                    },
                    m = t('blob');
                n.encodePacket = function (t, o, i, s) {
                    'function' == typeof o && (s = o, o = !1), 'function' == typeof i && (s = i, i = null);
                    var a = void 0 === t.data ? void 0 : t.data.buffer || t.data;
                    if (e.ArrayBuffer && a instanceof ArrayBuffer) return function (t, e, r) {
                        if (!e) return n.encodeBase64Packet(t, r);
                        var o = t.data,
                            i = new Uint8Array(o),
                            s = new Uint8Array(1 + o.byteLength);
                        s[0] = d[t.type];
                        for (var a = 0; a < i.length; a++) s[a + 1] = i[a];
                        return r(s.buffer)
                    }(t, o, s);
                    if (m && a instanceof e.Blob) return r(t, o, s);
                    if (a && a.base64) return function (t, e) {
                        return e('b' + n.packets[t.type] + t.data.data)
                    }(t, s);
                    var c = d[t.type];
                    return void 0 !== t.data && (c += i ? u.encode(String(t.data)) : String(t.data)), s('' + c)
                }, n.encodeBase64Packet = function (t, r) {
                    var o = 'b' + n.packets[t.type];
                    if (m && t.data instanceof m) {
                        var i = new FileReader;
                        return i.onload = function () {
                            var t = i.result.split(',')[1];
                            r(o + t)
                        }, i.readAsDataURL(t.data)
                    }
                    var s;
                    try {
                        s = String.fromCharCode.apply(null, new Uint8Array(t.data))
                    } catch (e) {
                        for (var a = new Uint8Array(t.data), c = new Array(a.length), p = 0; p < a.length; p++) c[p] = a[p];
                        s = String.fromCharCode.apply(null, c)
                    }
                    return o += e.btoa(s), r(o)
                }, n.decodePacket = function (t, e, r) {
                    if ('string' == typeof t || void 0 === t) {
                        if ('b' == t.charAt(0)) return n.decodeBase64Packet(t.substr(1), e);
                        if (r) try {
                            t = u.decode(t)
                        } catch (t) {
                            return g
                        }
                        o = t.charAt(0);
                        return Number(o) == o && y[o] ? t.length > 1 ? {
                            type: y[o],
                            data: t.substring(1)
                        } : {
                            type: y[o]
                        } : g
                    }
                    var o = new Uint8Array(t)[0],
                        i = a(t, 1);
                    return m && 'blob' === e && (i = new m([i])), {
                        type: y[o],
                        data: i
                    }
                }, n.decodeBase64Packet = function (t, n) {
                    var r = y[t.charAt(0)];
                    if (!e.ArrayBuffer) return {
                        type: r,
                        data: {
                            base64: !0,
                            data: t.substr(1)
                        }
                    };
                    var o = c.decode(t.substr(1));
                    return 'blob' === n && m && (o = new m([o])), {
                        type: r,
                        data: o
                    }
                }, n.encodePayload = function (t, e, r) {
                    'function' == typeof e && (r = e, e = null);
                    var i = s(t);
                    return e && i ? m && !l ? n.encodePayloadAsBlob(t, r) : n.encodePayloadAsArrayBuffer(t, r) : t.length ? void o(t, function (t, r) {
                        n.encodePacket(t, !!i && e, !0, function (t) {
                            r(null, function (t) {
                                return t.length + ':' + t
                            }(t))
                        })
                    }, function (t, e) {
                        return r(e.join(''))
                    }) : r('0:')
                }, n.decodePayload = function (t, e, r) {
                    if ('string' != typeof t) return n.decodePayloadAsBinary(t, e, r);
                    'function' == typeof e && (r = e, e = null);
                    var o;
                    if ('' == t) return r(g, 0, 1);
                    for (var i, s, a = '', c = 0, p = t.length; c < p; c++) {
                        var u = t.charAt(c);
                        if (':' != u) a += u;
                        else {
                            if ('' == a || a != (i = Number(a))) return r(g, 0, 1);
                            if (s = t.substr(c + 1, i), a != s.length) return r(g, 0, 1);
                            if (s.length) {
                                if (o = n.decodePacket(s, e, !0), g.type == o.type && g.data == o.data) return r(g, 0, 1);
                                if (!1 === r(o, c + i, p)) return
                            }
                            c += i, a = ''
                        }
                    }
                    return '' != a ? r(g, 0, 1) : void 0
                }, n.encodePayloadAsArrayBuffer = function (t, e) {
                    if (!t.length) return e(new ArrayBuffer(0));
                    o(t, function (t, e) {
                        n.encodePacket(t, !0, !0, function (t) {
                            return e(null, t)
                        })
                    }, function (t, n) {
                        var r = n.reduce(function (t, e) {
                                var n;
                                return n = 'string' == typeof e ? e.length : e.byteLength, t + n.toString().length + n + 2
                            }, 0),
                            o = new Uint8Array(r),
                            i = 0;
                        return n.forEach(function (t) {
                            var e = 'string' == typeof t,
                                n = t;
                            if (e) {
                                for (var r = new Uint8Array(t.length), s = 0; s < t.length; s++) r[s] = t.charCodeAt(s);
                                n = r.buffer
                            }
                            o[i++] = e ? 0 : 1;
                            for (var a = n.byteLength.toString(), s = 0; s < a.length; s++) o[i++] = parseInt(a[s]);
                            o[i++] = 255;
                            for (var r = new Uint8Array(n), s = 0; s < r.length; s++) o[i++] = r[s]
                        }), e(o.buffer)
                    })
                }, n.encodePayloadAsBlob = function (t, e) {
                    o(t, function (t, e) {
                        n.encodePacket(t, !0, !0, function (t) {
                            var n = new Uint8Array(1);
                            if (n[0] = 1, 'string' == typeof t) {
                                for (var r = new Uint8Array(t.length), o = 0; o < t.length; o++) r[o] = t.charCodeAt(o);
                                t = r.buffer, n[0] = 0
                            }
                            for (var i = (t instanceof ArrayBuffer ? t.byteLength : t.size).toString(), s = new Uint8Array(i.length + 1), o = 0; o < i.length; o++) s[o] = parseInt(i[o]);
                            if (s[i.length] = 255, m) {
                                var a = new m([n.buffer, s.buffer, t]);
                                e(null, a)
                            }
                        })
                    }, function (t, n) {
                        return e(new m(n))
                    })
                }, n.decodePayloadAsBinary = function (t, e, r) {
                    'function' == typeof e && (r = e, e = null);
                    for (var o = t, i = [], s = !1; o.byteLength > 0;) {
                        for (var c = new Uint8Array(o), p = 0 === c[0], u = '', h = 1; 255 != c[h]; h++) {
                            if (u.length > 310) {
                                s = !0;
                                break
                            }
                            u += c[h]
                        }
                        if (s) return r(g, 0, 1);
                        o = a(o, 2 + u.length), u = parseInt(u);
                        var f = a(o, 0, u);
                        if (p) try {
                            f = String.fromCharCode.apply(null, new Uint8Array(f))
                        } catch (t) {
                            var l = new Uint8Array(f);
                            f = '';
                            for (h = 0; h < l.length; h++) f += String.fromCharCode(l[h])
                        }
                        i.push(f), o = a(o, u)
                    }
                    var d = i.length;
                    i.forEach(function (t, o) {
                        r(n.decodePacket(t, e, !0), o, d)
                    })
                }
            }).call(this, 'undefined' != typeof self ? self : 'undefined' != typeof window ? window : {})
        }, {
            './keys': 26,
            after: 27,
            'arraybuffer.slice': 28,
            'base64-arraybuffer': 29,
            blob: 30,
            'has-binary': 36,
            utf8: 31
        }],
        26: [function (t, e, n) {
            e.exports = Object.keys ||
                function (t) {
                    var e = [],
                        n = Object.prototype.hasOwnProperty;
                    for (var r in t) n.call(t, r) && e.push(r);
                    return e
                }
        }, {}],
        27: [function (t, e, n) {
            e.exports = function (t, e, n) {
                function r(t, i) {
                    if (r.count <= 0) throw new Error('after called too many times');
                    --r.count, t ? (o = !0, e(t), e = n) : 0 !== r.count || o || e(null, i)
                }

                var o = !1;
                return n = n ||
                    function () {
                    }, r.count = t, 0 === t ? e() : r
            }
        }, {}],
        28: [function (t, e, n) {
            e.exports = function (t, e, n) {
                var r = t.byteLength;
                if (e = e || 0, n = n || r, t.slice) return t.slice(e, n);
                if (e < 0 && (e += r), n < 0 && (n += r), n > r && (n = r), e >= r || e >= n || 0 === r) return new ArrayBuffer(0);
                for (var o = new Uint8Array(t), i = new Uint8Array(n - e), s = e, a = 0; s < n; s++, a++) i[a] = o[s];
                return i.buffer
            }
        }, {}],
        29: [function (t, e, n) {
            !
                function (t) {
                    'use strict';
                    n.encode = function (e) {
                        var n, r = new Uint8Array(e),
                            o = r.length,
                            i = '';
                        for (n = 0; n < o; n += 3) i += t[r[n] >> 2], i += t[(3 & r[n]) << 4 | r[n + 1] >> 4], i += t[(15 & r[n + 1]) << 2 | r[n + 2] >> 6], i += t[63 & r[n + 2]];
                        return o % 3 == 2 ? i = i.substring(0, i.length - 1) + '=' : o % 3 == 1 && (i = i.substring(0, i.length - 2) + '=='), i
                    }, n.decode = function (e) {
                        var n, r, o, i, s, a = .75 * e.length,
                            c = e.length,
                            p = 0;
                        '=' === e[e.length - 1] && (a--, '=' === e[e.length - 2] && a--);
                        var u = new ArrayBuffer(a),
                            h = new Uint8Array(u);
                        for (n = 0; n < c; n += 4) r = t.indexOf(e[n]), o = t.indexOf(e[n + 1]), i = t.indexOf(e[n + 2]), s = t.indexOf(e[n + 3]), h[p++] = r << 2 | o >> 4, h[p++] = (15 & o) << 4 | i >> 2, h[p++] = (3 & i) << 6 | 63 & s;
                        return u
                    }
                }('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/')
        }, {}],
        30: [function (t, e, n) {
            (function (t) {
                function n(t) {
                    for (var e = 0; e < t.length; e++) {
                        var n = t[e];
                        if (n.buffer instanceof ArrayBuffer) {
                            var r = n.buffer;
                            if (n.byteLength !== r.byteLength) {
                                var o = new Uint8Array(n.byteLength);
                                o.set(new Uint8Array(r, n.byteOffset, n.byteLength)), r = o.buffer
                            }
                            t[e] = r
                        }
                    }
                }

                function r(t, e) {
                    e = e || {};
                    var r = new o;
                    n(t);
                    for (var i = 0; i < t.length; i++) r.append(t[i]);
                    return e.type ? r.getBlob(e.type) : r.getBlob()
                }

                var o = t.BlobBuilder || t.WebKitBlobBuilder || t.MSBlobBuilder || t.MozBlobBuilder,
                    i = function () {
                        try {
                            return 2 === new Blob(['hi']).size
                        } catch (t) {
                            return !1
                        }
                    }(),
                    s = i &&
                        function () {
                            try {
                                return 2 === new Blob([new Uint8Array([1, 2])]).size
                            } catch (t) {
                                return !1
                            }
                        }(), a = o && o.prototype.append && o.prototype.getBlob;
                e.exports = i ? s ? t.Blob : function (t, e) {
                    return n(t), new Blob(t, e || {})
                } : a ? r : void 0
            }).call(this, 'undefined' != typeof self ? self : 'undefined' != typeof window ? window : {})
        }, {}],
        31: [function (t, e, n) {
            (function (t) {
                !
                    function (r) {
                        function o(t) {
                            for (var e, n, r = [], o = 0, i = t.length; o < i;) (e = t.charCodeAt(o++)) >= 55296 && e <= 56319 && o < i ? 56320 == (64512 & (n = t.charCodeAt(o++))) ? r.push(((1023 & e) << 10) + (1023 & n) + 65536) : (r.push(e), o--) : r.push(e);
                            return r
                        }

                        function i(t) {
                            if (t >= 55296 && t <= 57343) throw Error('Lone surrogate U+' + t.toString(16).toUpperCase() + ' is not a scalar value')
                        }

                        function s(t, e) {
                            return g(t >> e & 63 | 128)
                        }

                        function a(t) {
                            if (0 == (4294967168 & t)) return g(t);
                            var e = '';
                            return 0 == (4294965248 & t) ? e = g(t >> 6 & 31 | 192) : 0 == (4294901760 & t) ? (i(t), e = g(t >> 12 & 15 | 224), e += s(t, 6)) : 0 == (4292870144 & t) && (e = g(t >> 18 & 7 | 240), e += s(t, 12), e += s(t, 6)), e += g(63 & t | 128)
                        }

                        function c() {
                            if (y >= d) throw Error('Invalid byte index');
                            var t = 255 & l[y];
                            if (y++, 128 == (192 & t)) return 63 & t;
                            throw Error('Invalid continuation byte')
                        }

                        function p() {
                            var t, e, n, r;
                            if (y > d) throw Error('Invalid byte index');
                            if (y == d) return !1;
                            if (t = 255 & l[y], y++, 0 == (128 & t)) return t;
                            if (192 == (224 & t)) {
                                var o;
                                if ((r = (31 & t) << 6 | (o = c())) >= 128) return r;
                                throw Error('Invalid continuation byte')
                            }
                            if (224 == (240 & t)) {
                                if (o = c(), e = c(), (r = (15 & t) << 12 | o << 6 | e) >= 2048) return i(r), r;
                                throw Error('Invalid continuation byte')
                            }
                            if (240 == (248 & t) && (o = c(), e = c(), n = c(), (r = (15 & t) << 18 | o << 12 | e << 6 | n) >= 65536 && r <= 1114111)) return r;
                            throw Error('Invalid UTF-8 detected')
                        }

                        var u = 'object' == typeof n && n,
                            h = 'object' == typeof e && e && e.exports == u && e,
                            f = 'object' == typeof t && t;
                        f.global !== f && f.window !== f || (r = f);
                        var l, d, y, g = String.fromCharCode,
                            m = {
                                version: '2.0.0',
                                encode: function (t) {
                                    for (var e = o(t), n = e.length, r = -1, i = ''; ++r < n;) i += a(e[r]);
                                    return i
                                },
                                decode: function (t) {
                                    l = o(t), d = l.length, y = 0;
                                    for (var e, n = []; !1 !== (e = p());) n.push(e);
                                    return function (t) {
                                        for (var e, n = t.length, r = -1, o = ''; ++r < n;) (e = t[r]) > 65535 && (o += g((e -= 65536) >>> 10 & 1023 | 55296), e = 56320 | 1023 & e), o += g(e);
                                        return o
                                    }(n)
                                }
                            };
                        if (u && !u.nodeType) if (h) h.exports = m;
                        else {
                            var b = {}.hasOwnProperty;
                            for (var v in m) b.call(m, v) && (u[v] = m[v])
                        } else r.utf8 = m
                    }(this)
            }).call(this, 'undefined' != typeof self ? self : 'undefined' != typeof window ? window : {})
        }, {}],
        32: [function (t, e, n) {
            (function (t) {
                var n = /^[\],:{}\s]*$/,
                    r = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
                    o = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                    i = /(?:^|:|,)(?:\s*\[)+/g,
                    s = /^\s+/,
                    a = /\s+$/;
                e.exports = function (e) {
                    return 'string' == typeof e && e ? (e = e.replace(s, '').replace(a, ''), t.JSON && JSON.parse ? JSON.parse(e) : n.test(e.replace(r, '@').replace(o, ']').replace(i, '')) ? new Function('return ' + e)() : void 0) : null
                }
            }).call(this, 'undefined' != typeof self ? self : 'undefined' != typeof window ? window : {})
        }, {}],
        33: [function (t, e, n) {
            n.encode = function (t) {
                var e = '';
                for (var n in t) t.hasOwnProperty(n) && (e.length && (e += '&'), e += encodeURIComponent(n) + '=' + encodeURIComponent(t[n]));
                return e
            }, n.decode = function (t) {
                for (var e = {}, n = t.split('&'), r = 0, o = n.length; r < o; r++) {
                    var i = n[r].split('=');
                    e[decodeURIComponent(i[0])] = decodeURIComponent(i[1])
                }
                return e
            }
        }, {}],
        34: [function (t, e, n) {
            var r = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
                o = ['source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'];
            e.exports = function (t) {
                var e = t,
                    n = t.indexOf('['),
                    i = t.indexOf(']');
                -1 != n && -1 != i && (t = t.substring(0, n) + t.substring(n, i).replace(/:/g, ';') + t.substring(i, t.length));
                for (var s = r.exec(t || ''), a = {}, c = 14; c--;) a[o[c]] = s[c] || '';
                return -1 != n && -1 != i && (a.source = e, a.host = a.host.substring(1, a.host.length - 1).replace(/;/g, ':'), a.authority = a.authority.replace('[', '').replace(']', '').replace(/;/g, ':'), a.ipv6uri = !0), a
            }
        }, {}],
        35: [function (t, e, n) {
            function r(t, e, n) {
                return e ? new i(t, e) : new i(t)
            }

            var o = function () {
                    return this
                }(),
                i = o.WebSocket || o.MozWebSocket;
            e.exports = i ? r : null, i && (r.prototype = i.prototype)
        }, {}],
        36: [function (t, e, n) {
            (function (n) {
                var r = t('isarray');
                e.exports = function (t) {
                    function e(t) {
                        if (!t) return !1;
                        if (n.Buffer && n.Buffer.isBuffer(t) || n.ArrayBuffer && t instanceof ArrayBuffer || n.Blob && t instanceof Blob || n.File && t instanceof File) return !0;
                        if (r(t)) {
                            for (var o = 0; o < t.length; o++) if (e(t[o])) return !0
                        } else if (t && 'object' == typeof t) {
                            t.toJSON && (t = t.toJSON());
                            for (var i in t) if (Object.prototype.hasOwnProperty.call(t, i) && e(t[i])) return !0
                        }
                        return !1
                    }

                    return e(t)
                }
            }).call(this, 'undefined' != typeof self ? self : 'undefined' != typeof window ? window : {})
        }, {
            isarray: 37
        }],
        37: [function (t, e, n) {
            e.exports = Array.isArray ||
                function (t) {
                    return '[object Array]' == Object.prototype.toString.call(t)
                }
        }, {}],
        38: [function (t, e, n) {
            var r = t('global');
            try {
                e.exports = 'XMLHttpRequest' in r && 'withCredentials' in new r.XMLHttpRequest
            } catch (t) {
                e.exports = !1
            }
        }, {
            global: 39
        }],
        39: [function (t, e, n) {
            e.exports = function () {
                return this
            }()
        }, {}],
        40: [function (t, e, n) {
            var r = [].indexOf;
            e.exports = function (t, e) {
                if (r) return t.indexOf(e);
                for (var n = 0; n < t.length; ++n) if (t[n] === e) return n;
                return -1
            }
        }, {}],
        41: [function (t, e, n) {
            var r = Object.prototype.hasOwnProperty;
            n.keys = Object.keys ||
                function (t) {
                    var e = [];
                    for (var n in t) r.call(t, n) && e.push(n);
                    return e
                }, n.values = function (t) {
                var e = [];
                for (var n in t) r.call(t, n) && e.push(t[n]);
                return e
            }, n.merge = function (t, e) {
                for (var n in e) r.call(e, n) && (t[n] = e[n]);
                return t
            }, n.length = function (t) {
                return n.keys(t).length
            }, n.isEmpty = function (t) {
                return 0 == n.length(t)
            }
        }, {}],
        42: [function (t, e, n) {
            var r = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
                o = ['source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'];
            e.exports = function (t) {
                for (var e = r.exec(t || ''), n = {}, i = 14; i--;) n[o[i]] = e[i] || '';
                return n
            }
        }, {}],
        43: [function (t, e, n) {
            (function (e) {
                var r = t('isarray'),
                    o = t('./is-buffer');
                n.deconstructPacket = function (t) {
                    function e(t) {
                        if (!t) return t;
                        if (o(t)) {
                            var i = {
                                _placeholder: !0,
                                num: n.length
                            };
                            return n.push(t), i
                        }
                        if (r(t)) {
                            for (var s = new Array(t.length), a = 0; a < t.length; a++) s[a] = e(t[a]);
                            return s
                        }
                        if ('object' == typeof t && !(t instanceof Date)) {
                            s = {};
                            for (var c in t) s[c] = e(t[c]);
                            return s
                        }
                        return t
                    }

                    var n = [],
                        i = t.data,
                        s = t;
                    return s.data = e(i), s.attachments = n.length, {
                        packet: s,
                        buffers: n
                    }
                }, n.reconstructPacket = function (t, e) {
                    function n(t) {
                        if (t && t._placeholder) {
                            return e[t.num]
                        }
                        if (r(t)) {
                            for (var o = 0; o < t.length; o++) t[o] = n(t[o]);
                            return t
                        }
                        if (t && 'object' == typeof t) {
                            for (var i in t) t[i] = n(t[i]);
                            return t
                        }
                        return t
                    }

                    return t.data = n(t.data), t.attachments = void 0, t
                }, n.removeBlobs = function (t, n) {
                    function i(t, c, p) {
                        if (!t) return t;
                        if (e.Blob && t instanceof Blob || e.File && t instanceof File) {
                            s++;
                            var u = new FileReader;
                            u.onload = function () {
                                p ? p[c] = this.result : a = this.result, --s || n(a)
                            }, u.readAsArrayBuffer(t)
                        } else if (r(t)) for (var h = 0; h < t.length; h++) i(t[h], h, t);
                        else if (t && 'object' == typeof t && !o(t)) for (var f in t) i(t[f], f, t)
                    }

                    var s = 0,
                        a = t;
                    i(a), s || n(a)
                }
            }).call(this, 'undefined' != typeof self ? self : 'undefined' != typeof window ? window : {})
        }, {
            './is-buffer': 45,
            isarray: 46
        }],
        44: [function (t, e, n) {
            function r() {
            }

            function o(t) {
                var e = '',
                    r = !1;
                return e += t.type, n.BINARY_EVENT != t.type && n.BINARY_ACK != t.type || (e += t.attachments, e += '-'), t.nsp && '/' != t.nsp && (r = !0, e += t.nsp), null != t.id && (r && (e += ',', r = !1), e += t.id), null != t.data && (r && (e += ','), e += u.stringify(t.data)), p('encoded %j as %s', t, e), e
            }

            function i() {
                this.reconstructor = null
            }

            function s(t) {
                var e = {},
                    r = 0;
                if (e.type = Number(t.charAt(0)), null == n.types[e.type]) return c();
                if (n.BINARY_EVENT == e.type || n.BINARY_ACK == e.type) {
                    for (var o = '';
                         "-" != t.charAt(++r) && (o += t.charAt(r), r != t.length);) ;
                    if (o != Number(o) || '-' != t.charAt(r)) throw new Error('Illegal attachments');
                    e.attachments = Number(o)
                }
                if ('/' == t.charAt(r + 1)) for (e.nsp = ''; ++r;) {
                    if (',' == (s = t.charAt(r))) break;
                    if (e.nsp += s, r == t.length) break
                } else e.nsp = '/';
                var i = t.charAt(r + 1);
                if ('' !== i && Number(i) == i) {
                    for (e.id = ''; ++r;) {
                        var s = t.charAt(r);
                        if (null == s || Number(s) != s) {
                            --r;
                            break
                        }
                        if (e.id += t.charAt(r), r == t.length) break
                    }
                    e.id = Number(e.id)
                }
                if (t.charAt(++r)) try {
                    e.data = u.parse(t.substr(r))
                } catch (t) {
                    return c()
                }
                return p('decoded %s as %j', t, e), e
            }

            function a(t) {
                this.reconPack = t, this.buffers = []
            }

            function c(t) {
                return {
                    type: n.ERROR,
                    data: 'parser error'
                }
            }

            var p = t('debug')('socket.io-parser'),
                u = t('json3'),
                h = (t('isarray'), t('component-emitter')),
                f = t('./binary'),
                l = t('./is-buffer');
            n.protocol = 4, n.types = ['CONNECT', 'DISCONNECT', 'EVENT', 'BINARY_EVENT', 'ACK', 'BINARY_ACK', 'ERROR'], n.CONNECT = 0, n.DISCONNECT = 1, n.EVENT = 2, n.ACK = 3, n.ERROR = 4, n.BINARY_EVENT = 5, n.BINARY_ACK = 6, n.Encoder = r, n.Decoder = i, r.prototype.encode = function (t, e) {
                if (p('encoding packet %j', t), n.BINARY_EVENT == t.type || n.BINARY_ACK == t.type) !
                    function (t, e) {
                        f.removeBlobs(t, function (t) {
                            var n = f.deconstructPacket(t),
                                r = o(n.packet),
                                i = n.buffers;
                            i.unshift(r), e(i)
                        })
                    }(t, e);
                else {
                    e([o(t)])
                }
            }, h(i.prototype), i.prototype.add = function (t) {
                var e;
                if ('string' == typeof t) e = s(t), n.BINARY_EVENT == e.type || n.BINARY_ACK == e.type ? (this.reconstructor = new a(e), 0 === this.reconstructor.reconPack.attachments && this.emit('decoded', e)) : this.emit('decoded', e);
                else {
                    if (!l(t) && !t.base64) throw new Error('Unknown type: ' + t);
                    if (!this.reconstructor) throw new Error('got binary data when not reconstructing a packet');
                    (e = this.reconstructor.takeBinaryData(t)) && (this.reconstructor = null, this.emit('decoded', e))
                }
            }, i.prototype.destroy = function () {
                this.reconstructor && this.reconstructor.finishedReconstruction()
            }, a.prototype.takeBinaryData = function (t) {
                if (this.buffers.push(t), this.buffers.length == this.reconPack.attachments) {
                    var e = f.reconstructPacket(this.reconPack, this.buffers);
                    return this.finishedReconstruction(), e
                }
                return null
            }, a.prototype.finishedReconstruction = function () {
                this.reconPack = null, this.buffers = []
            }
        }, {
            './binary': 43,
            './is-buffer': 45,
            'component-emitter': 9,
            debug: 10,
            isarray: 46,
            json3: 47
        }],
        45: [function (t, e, n) {
            (function (t) {
                e.exports = function (e) {
                    return t.Buffer && t.Buffer.isBuffer(e) || t.ArrayBuffer && e instanceof ArrayBuffer
                }
            }).call(this, 'undefined' != typeof self ? self : 'undefined' != typeof window ? window : {})
        }, {}],
        46: [function (t, e, n) {
            e.exports = t(37)
        }, {}],
        47: [function (t, e, n) {
            !
                function (t) {
                    function e(t) {
                        if (e[t] !== i) return e[t];
                        var n;
                        if ('bug-string-char-index' == t) n = 'a' != 'a' [0];
                        else if ('json' == t) n = e('json-stringify') && e('json-parse');
                        else {
                            var r, o = '{"a":[1,true,false,null,"\\\b\\n\\f\\r\\t"]}';
                            if ('json-stringify' == t) {
                                var a = c.stringify,
                                    u = 'function' == typeof a && p;
                                if (u) {
                                    (r = function () {
                                        return 1
                                    }).toJSON = r;
                                    try {
                                        u = '0' === a(0) && '0' === a(new Number) && '""' == a(new String) && a(s) === i && a(i) === i && a() === i && '1' === a(r) && '[1]' == a([r]) && '[null]' == a([i]) && 'null' == a(null) && '[null,null,null]' == a([i, s, null]) && a({
                                            a: [r, !0, !1, null, '\0\b\n\f\r\t']
                                        }) == o && '1' === a(null, r) && '[\n 1,\n 2\n]' == a([1, 2], null, 1) && '"-271821-04-20T00:00:00.000Z"' == a(new Date(-864e13)) && '"+275760-09-13T00:00:00.000Z"' == a(new Date(864e13)) && '"-000001-01-01T00:00:00.000Z"' == a(new Date(-621987552e5)) && '"1969-12-31T23:59:59.999Z"' == a(new Date(-1))
                                    } catch (t) {
                                        u = !1
                                    }
                                }
                                n = u
                            }
                            if ('json-parse' == t) {
                                var h = c.parse;
                                if ('function' == typeof h) try {
                                    if (0 === h('0') && !h(!1)) {
                                        var f = 5 == (r = h(o)).a.length && 1 === r.a[0];
                                        if (f) {
                                            try {
                                                f = !h('"\t"')
                                            } catch (t) {
                                            }
                                            if (f) try {
                                                f = 1 !== h('01')
                                            } catch (t) {
                                            }
                                            if (f) try {
                                                f = 1 !== h('1.')
                                            } catch (t) {
                                            }
                                        }
                                    }
                                } catch (t) {
                                    f = !1
                                }
                                n = f
                            }
                        }
                        return e[t] = !!n
                    }

                    var r, o, i, s = {}.toString,
                        a = 'object' == typeof JSON && JSON,
                        c = 'object' == typeof n && n && !n.nodeType && n;
                    c && a ? (c.stringify = a.stringify, c.parse = a.parse) : c = t.JSON = a || {};
                    var p = new Date(-0xc782b5b800cec);
                    try {
                        p = -109252 == p.getUTCFullYear() && 0 === p.getUTCMonth() && 1 === p.getUTCDate() && 10 == p.getUTCHours() && 37 == p.getUTCMinutes() && 6 == p.getUTCSeconds() && 708 == p.getUTCMilliseconds()
                    } catch (t) {
                    }
                    if (!e('json')) {
                        var u = '[object Function]',
                            h = '[object Number]',
                            f = '[object String]',
                            l = '[object Array]',
                            d = e('bug-string-char-index');
                        if (!p) var y = Math.floor,
                            g = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
                            m = function (t, e) {
                                return g[e] + 365 * (t - 1970) + y((t - 1969 + (e = +(e > 1))) / 4) - y((t - 1901 + e) / 100) + y((t - 1601 + e) / 400)
                            };
                        (r = {}.hasOwnProperty) || (r = function (t) {
                            var e, n = {};
                            return (n.__proto__ = null, n.__proto__ = {
                                toString: 1
                            }, n).toString != s ? r = function (t) {
                                var e = this.__proto__,
                                    n = t in (this.__proto__ = null, this);
                                return this.__proto__ = e, n
                            } : (e = n.constructor, r = function (t) {
                                var n = (this.constructor || e).prototype;
                                return t in this && !(t in n && this[t] === n[t])
                            }), n = null, r.call(this, t)
                        });
                        var b = {
                            boolean: 1,
                            number: 1,
                            string: 1,
                            undefined: 1
                        };
                        if (o = function (t, e) {
                                var n, i, a, c = 0;
                                (n = function () {
                                    this.valueOf = 0
                                }).prototype.valueOf = 0, i = new n;
                                for (a in i) r.call(i, a) && c++;
                                return n = i = null, c ? o = 2 == c ?
                                    function (t, e) {
                                        var n, o = {},
                                            i = s.call(t) == u;
                                        for (n in t) i && 'prototype' == n || r.call(o, n) || !(o[n] = 1) || !r.call(t, n) || e(n)
                                    } : function (t, e) {
                                        var n, o, i = s.call(t) == u;
                                        for (n in t) i && 'prototype' == n || !r.call(t, n) || (o = 'constructor' === n) || e(n);
                                        (o || r.call(t, n = 'constructor')) && e(n)
                                    } : (i = ['valueOf', 'toString', 'toLocaleString', 'propertyIsEnumerable', 'isPrototypeOf', 'hasOwnProperty', 'constructor'], o = function (t, e) {
                                    var n, o, a = s.call(t) == u,
                                        c = !a && 'function' != typeof t.constructor &&
                                        function (t, e) {
                                            var n = typeof t[e];
                                            return 'object' == n ? !!t[e] : !b[n]
                                        }(t, 'hasOwnProperty') ? t.hasOwnProperty : r;
                                    for (n in t) a && 'prototype' == n || !c.call(t, n) || e(n);
                                    for (o = i.length; n = i[--o]; c.call(t, n) && e(n))
                                        }), o(t, e)
                            }, !e('json-stringify')) {
                            var v = {
                                    92: '\\\\',
                                    34: '\\"',
                                    8: '\\b',
                                    12: '\\f',
                                    10: '\\n',
                                    13: '\\r',
                                    9: '\\t'
                                },
                                w = function (t, e) {
                                    return ('000000' + (e || 0)).slice(-t)
                                },
                                k = function (t) {
                                    var e, n = '"',
                                        r = 0,
                                        o = t.length,
                                        i = o > 10 && d;
                                    for (i && (e = t.split('')); r < o; r++) {
                                        var s = t.charCodeAt(r);
                                        switch (s) {
                                            case 8:
                                            case 9:
                                            case 10:
                                            case 12:
                                            case 13:
                                            case 34:
                                            case 92:
                                                n += v[s];
                                                break;
                                            default:
                                                if (s < 32) {
                                                    n += '\\u00' + w(2, s.toString(16));
                                                    break
                                                }
                                                n += i ? e[r] : d ? t.charAt(r) : t[r]
                                        }
                                    }
                                    return n + '"'
                                },
                                x = function (t, e, n, a, c, p, u) {
                                    var d, g, b, v, A, B, C, S, E, T, j, _, P, R, N, O;
                                    try {
                                        d = e[t]
                                    } catch (t) {
                                    }
                                    if ('object' == typeof d && d) if ('[object Date]' != (g = s.call(d)) || r.call(d, 'toJSON')) 'function' == typeof d.toJSON && (g != h && g != f && g != l || r.call(d, 'toJSON')) && (d = d.toJSON(t));
                                    else if (d > -1 / 0 && d < 1 / 0) {
                                        if (m) {
                                            for (A = y(d / 864e5), b = y(A / 365.2425) + 1970 - 1; m(b + 1, 0) <= A; b++) ;
                                            for (v = y((A - m(b, 0)) / 30.42); m(b, v + 1) <= A; v++) ;
                                            A = 1 + A - m(b, v), C = y((B = (d % 864e5 + 864e5) % 864e5) / 36e5) % 24, S = y(B / 6e4) % 60, E = y(B / 1e3) % 60, T = B % 1e3
                                        } else b = d.getUTCFullYear(), v = d.getUTCMonth(), A = d.getUTCDate(), C = d.getUTCHours(), S = d.getUTCMinutes(), E = d.getUTCSeconds(), T = d.getUTCMilliseconds();
                                        d = (b <= 0 || b >= 1e4 ? (b < 0 ? '-' : '+') + w(6, b < 0 ? -b : b) : w(4, b)) + '-' + w(2, v + 1) + '-' + w(2, A) + 'T' + w(2, C) + ':' + w(2, S) + ':' + w(2, E) + '.' + w(3, T) + 'Z'
                                    } else d = null;
                                    if (n && (d = n.call(e, t, d)), null === d) return 'null';
                                    if ('[object Boolean]' == (g = s.call(d))) return '' + d;
                                    if (g == h) return d > -1 / 0 && d < 1 / 0 ? '' + d : 'null';
                                    if (g == f) return k('' + d);
                                    if ('object' == typeof d) {
                                        for (R = u.length; R--;) if (u[R] === d) throw TypeError();
                                        if (u.push(d), j = [], N = p, p += c, g == l) {
                                            for (P = 0, R = d.length; P < R; P++) _ = x(P, d, n, a, c, p, u), j.push(_ === i ? 'null' : _);
                                            O = j.length ? c ? '[\n' + p + j.join(',\n' + p) + '\n' + N + ']' : '[' + j.join(',') + ']' : '[]'
                                        } else o(a || d, function (t) {
                                            var e = x(t, d, n, a, c, p, u);
                                            e !== i && j.push(k(t) + ':' + (c ? ' ' : '') + e)
                                        }), O = j.length ? c ? '{\n' + p + j.join(',\n' + p) + '\n' + N + '}' : '{' + j.join(',') + '}' : '{}';
                                        return u.pop(), O
                                    }
                                };
                            c.stringify = function (t, e, n) {
                                var r, o, i, a;
                                if ('function' == typeof e || 'object' == typeof e && e) if ((a = s.call(e)) == u) o = e;
                                else if (a == l) {
                                    i = {};
                                    for (var c, p = 0, d = e.length; p < d; c = e[p++], ((a = s.call(c)) == f || a == h) && (i[c] = 1))
                                        }
                                if (n) if ((a = s.call(n)) == h) {
                                    if ((n -= n % 1) > 0) for (r = '', n > 10 && (n = 10); r.length < n; r += ' ')
                                        } else a == f && (r = n.length <= 10 ? n : n.slice(0, 10));
                                return x('', (c = {}, c[''] = t, c), o, i, r, '', [])
                            }
                        }
                        if (!e('json-parse')) {
                            var A, B, C = String.fromCharCode,
                                S = {
                                    92: '\\',
                                    34: '"',
                                    47: '/',
                                    98: '\b',
                                    116: '\t',
                                    110: '\n',
                                    102: '\f',
                                    114: '\r'
                                },
                                E = function () {
                                    throw A = B = null, SyntaxError()
                                },
                                T = function () {
                                    for (var t, e, n, r, o, i = B, s = i.length; A < s;) switch (o = i.charCodeAt(A)) {
                                        case 9:
                                        case 10:
                                        case 13:
                                        case 32:
                                            A++;
                                            break;
                                        case 123:
                                        case 125:
                                        case 91:
                                        case 93:
                                        case 58:
                                        case 44:
                                            return t = d ? i.charAt(A) : i[A], A++, t;
                                        case 34:
                                            for (t = '@', A++; A < s;) if ((o = i.charCodeAt(A)) < 32) E();
                                            else if (92 == o) switch (o = i.charCodeAt(++A)) {
                                                case 92:
                                                case 34:
                                                case 47:
                                                case 98:
                                                case 116:
                                                case 110:
                                                case 102:
                                                case 114:
                                                    t += S[o], A++;
                                                    break;
                                                case 117:
                                                    for (e = ++A, n = A + 4; A < n; A++) (o = i.charCodeAt(A)) >= 48 && o <= 57 || o >= 97 && o <= 102 || o >= 65 && o <= 70 || E();
                                                    t += C('0x' + i.slice(e, A));
                                                    break;
                                                default:
                                                    E()
                                            } else {
                                                if (34 == o) break;
                                                for (o = i.charCodeAt(A), e = A; o >= 32 && 92 != o && 34 != o;) o = i.charCodeAt(++A);
                                                t += i.slice(e, A)
                                            }
                                            if (34 == i.charCodeAt(A)) return A++, t;
                                            E();
                                        default:
                                            if (e = A, 45 == o && (r = !0, o = i.charCodeAt(++A)), o >= 48 && o <= 57) {
                                                for (48 == o && (o = i.charCodeAt(A + 1)) >= 48 && o <= 57 && E(), r = !1; A < s && (o = i.charCodeAt(A)) >= 48 && o <= 57; A++) ;
                                                if (46 == i.charCodeAt(A)) {
                                                    for (n = ++A; n < s && (o = i.charCodeAt(n)) >= 48 && o <= 57; n++) ;
                                                    n == A && E(), A = n
                                                }
                                                if (101 == (o = i.charCodeAt(A)) || 69 == o) {
                                                    for (43 != (o = i.charCodeAt(++A)) && 45 != o || A++, n = A; n < s && (o = i.charCodeAt(n)) >= 48 && o <= 57; n++) ;
                                                    n == A && E(), A = n
                                                }
                                                return +i.slice(e, A)
                                            }
                                            if (r && E(), 'true' == i.slice(A, A + 4)) return A += 4, !0;
                                            if ('false' == i.slice(A, A + 5)) return A += 5, !1;
                                            if ('null' == i.slice(A, A + 4)) return A += 4, null;
                                            E()
                                    }
                                    return '$'
                                },
                                j = function (t) {
                                    var e, n;
                                    if ('$' == t && E(), 'string' == typeof t) {
                                        if ('@' == (d ? t.charAt(0) : t[0])) return t.slice(1);
                                        if ('[' == t) {
                                            for (e = [];
                                                 "]" != (t = T()); n || (n = !0)) n && (',' == t ? ']' == (t = T()) && E() : E()), ',' == t && E(), e.push(j(t));
                                            return e
                                        }
                                        if ('{' == t) {
                                            for (e = {};
                                                 "}" != (t = T()); n || (n = !0)) n && (',' == t ? '}' == (t = T()) && E() : E()), ',' != t && 'string' == typeof t && '@' == (d ? t.charAt(0) : t[0]) && ':' == T() || E(), e[t.slice(1)] = j(T());
                                            return e
                                        }
                                        E()
                                    }
                                    return t
                                },
                                _ = function (t, e, n) {
                                    var r = P(t, e, n);
                                    r === i ? delete t[e] : t[e] = r
                                },
                                P = function (t, e, n) {
                                    var r, i = t[e];
                                    if ('object' == typeof i && i) if (s.call(i) == l) for (r = i.length; r--;) _(i, r, n);
                                    else o(i, function (t) {
                                            _(i, t, n)
                                        });
                                    return n.call(t, e, i)
                                };
                            c.parse = function (t, e) {
                                var n, r;
                                return A = 0, B = '' + t, n = j(T()), '$' != T() && E(), A = B = null, e && s.call(e) == u ? P((r = {}, r[''] = n, r), '', e) : n
                            }
                        }
                    }
                }(this)
        }, {}],
        48: [function (t, e, n) {
            e.exports = function (t, e) {
                for (var n = [], r = (e = e || 0) || 0; r < t.length; r++) n[r - e] = t[r];
                return n
            }
        }, {}]
    }, {}, [1])(1)
});
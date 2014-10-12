/**
 * @constructor
 */
window['chime'] = new (function chime() {
  this.looper = new AudioLooper(1024);
  this.master = new MasterChannel();
  this.master.setVolume(1.0);
  this.looper.setChannel(this.master);
  this.player = [];
  this.effects = 1;
  this.effectId = 0;
  this.setupChannel = function (n) {
    this.player[n] = new TsdPlayer();
    this.player[n].device = new TssChannel();
    this.player[n].device.setPlayer(this.player[n]);
    this.master.addChannel(this.player[n].device);
  }
  for (var i = 0; i <= this.effects; ++i) this.setupChannel(i);
})();

window['chime']['setMaxEffect'] = function(n) {
  if (window['chime'].effects < n) {
    for (var i = window['chime'].effects + 1; i <= n; ++i) {
      window['chime'].setupChannel(i);
    }
  } else {
    for (var i = n + 1; i <= window['chime'].effects; ++i) {
      window['chime'].master.removeChannel(window['chime'].player[i].device);
      window['chime'].player[i] = null;
    }
  }
  window['chime'].effects = n;
}

window['chime']['maxEffect'] = function() {
  return window['chime'].effects;
}

window['chime']['bgm'] = function(data) {
  return window['chime']['play'](0, data);
}

window['chime']['effect'] = function(data) {
  return window['chime']['play'](-1, data);
}

window['chime']['play'] = function(id, data) {
  if (id > window['chime'].effects)
    return false;
  if (!data) {
    // TODO: Implement stop
  } else if (data.loading) {
    data.willPlay = true;
    data.playerId = id;
  }
  if (id < 0) {
    window['chime'].effectId =
        (window['chime'].effectId + 1) % window['chime'].effects;
    id = window['chime'].effectId + 1;
  }
  window['chime'].player[id].play(data['tsd']);
  return true;
}

/**
 * @constructor
 */
window['chime']['Sound'] = function(data) {
  this.loading = true;
  this.willPlay = false;
  this.playerId = -1;
  this.log = '';
  this.success = false;

  if (typeof data === 'string' && data.indexOf('http') == 0) {
    // URL fetch.
    var xhr = new XMLHttpRequest();
    xhr.owner = this;
    xhr.open('get', data, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function() {
      this.owner.set(this.response);
    }
    xhr.send();
    return;
  }
  if (data.constructor == Array) {
    // MML generation.
    var mml = [
      '#TITLE <>',
      '#CHANNEL ' + data.length
    ];
    var atoz = 'Z'.charCodeAt(0) - 'A'.charCodeAt(0);
    var unit = atoz + 1;
    var maxChannel = unit * unit + atoz;
    if (data.length > maxChannel) {
      this.log('too many channels: ' + data.length);
      return;
    }
    for (var i = 0; i < data.length; ++i) {
      var ch;
      if (i < unit) {
        ch = String.fromCharCode('A'.charCodeAt(0) + i);
      } else {
        var prefix = ~~(i / unit) - 1;
        ch = String.fromCharCode('A'.charCodeAt(0) + prefix) +
            String.fromCharCode('A'.charCodeAt(0) + (i % unit));
      }
      mml.push('#' + ch + ' ' + data[i]);
    }
    this.set(mml.join('\n'));
  }

  // Data.
  this.set(data);
}

window['chime']['Sound'].prototype.set = function(data) {
  this.loading = false;

  if (typeof data === 'string') {
    // Handle data as TSS.
    var compiler = new TssCompiler();
    Log.on();
    this['tsd'] = compiler.compile(data);
    Log.off();
    this.log = Log.flush();
    this.success = this['tsd'] != null;
  } else if (data.constructor == ArrayBuffer) {
    var view = new DataView(data);
    if (view.getUint8(0) == 'T'.charCodeAt(0)) {
      // Handle data as TSD.
      this['tsd'] = data;
      this.success = true;  // TODO: Should be checked.
    } else {
      // Handle data as TSS.
      var compiler = new TssCompiler();
      Log.on();
      this['tsd'] = compiler.compile(data);
      Log.off();
      this.log = Log.flush();
      this.success = this['tsd'] != null;
    }
  } else {
    // TODO: Support other cases.
    return;
  }
  if (this.willPlay)
    window['chime']['play'](this.playerId, this);
}

window['chime']['createSound'] = function(data) {
  return new window['chime']['Sound'](data);
}

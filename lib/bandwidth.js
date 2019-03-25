'use strict';

const os = require('os');
//const exec = require('child_process').exec;
const fs = require('fs');
const Readable = require('stream');
const util = require('./util');

let _platform = process.platform;

const _linux = (_platform === 'linux');

const {
  spawn
} = require('child_process');


function networkBandwidth(interval){
  if (_linux) {
  const nethogs = spawn('nethogs', ['-t', '-d', interval, '-v', '1']);

  nethogs.stdout.on('data', function (data) {
    let value = data.toString('utf8');
    const lines = value.split("\n");
    let bandwidth = [];
    for (const line of lines) {
      let info = "";
      try {

        info = line.split("\t");
      } catch (e) {

        console.log(e);
        continue;
      }
      if (info.length <= 1) {
        continue;
      }
      const re = /\/([0-9]+)/g;
      let process_info = info[0];
      const sent_KB = info[1];
      const received_KB = info[2];
      let [pid, unknown] = process_info.match(re);
      process_info = process_info.replace(re, '');
      pid = pid.replace('/', '');
      unknown = unknown.replace('/', '');
      

      let network_bandwidth = {
        pid: 0,
        unknown: 0,
        sent_KB: 0,
        recieved_KB: 0,
        connection: 0
      };

      network_bandwidth.pid = pid;
      network_bandwidth.sent_KB = sent_KB;
      network_bandwidth.recieved_KB = received_KB;
      network_bandwidth.connection = process_info;
      network_bandwidth.unknown = unknown;

      bandwidth.push(network_bandwidth);
    }
    return bandwidth;
  });



  nethogs.stderr.on('data', (data) => {
    return data;
  
  });

  nethogs.on('close', (code) => {
    
  return code;
  });
}
}

module.exports.networkBandwidth = networkBandwidth
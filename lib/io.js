// file for diskIo stats per Process
// this is monitored through iotop fo linux!

'use strict';

const os = require('os');
const exec = require('child_process').exec
const fs = require('fs');
const util = require('./util');


let _platform = process.platform;

const _linux = (_platform === 'linux');

async function all_pids(callback) {

  const ps_cmd = 'ps -eo pid,user';

  try {
    var result = await util.executeCommand(ps_cmd);
    return result;
  } catch (err) {
    throw err;
  }

}

async function io_stats(data) {
  let io_stats = {
    pid: 0,
    user: 0,
    rchar: 0,
    wchar: 0,
    syscr: 0,
    syscw: 0,
    read_bytes: 0,
    write_bytes: 0,
    cancelled_write_bytes: 0
  };
  let processes_io_data = [];

  for(let record of data) {
    let pid_user = record.split(' ');
    const pid = pid_user[0];
    const user = pid_user[1];
    try {
      let cmd = `cat /proc/${pid}/io`;
      // util.executeCommand  return a promise 
      var stdout = await util.executeCommand(cmd);
    } catch (err) {
      continue;
    }
    let lines = stdout.toString().split('\n');
    io_stats.pid = pid;
    io_stats.user = user;
    io_stats.rchar = parseInt(util.getValue(lines, 'rchar'), 10) || 0;
    io_stats.wchar = parseInt(util.getValue(lines, 'wchar'), 10) || 0;
    io_stats.syscr = parseInt(util.getValue(lines, 'syscr'), 10) || 0;
    io_stats.syscw = parseInt(util.getValue(lines, 'syscw'), 10) || 0;
    io_stats.read_bytes = parseInt(util.getValue(lines, 'read_bytes'), 10) || 0;
    io_stats.write_bytes = parseInt(util.getValue(lines, 'write_bytes'), 10) || 0;
    io_stats.cancelled_write_bytes = parseInt(util.getValue(lines, 'cancelled_write_bytes'), 10) || 0;
    processes_io_data.push(io_stats);
  }
  return processes_io_data;
}

async function processIOData() {
  try {
    console.log();

    var pids_users = await all_pids();
    pids_users = pids_users.toString().split('\n').splice(2);
    //pids_users= pids_users.map(e => e.split('\t'));
    //console.log("result",pids_users);

    var result = await io_stats(pids_users.map(e => e.trim()));

    //console.log("result!");

  } catch (err) {
    throw err;
  }
}

exports.all_pids = all_pids;
exports.processIOData = processIOData;

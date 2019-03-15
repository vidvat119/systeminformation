// file for diskIo stats per Process
// this is monitored through iotop fo linux!

'use strict';

const os = require('os');
const exec = require('child_process').exec
const fs = require('fs');
const util = require('./util');

let _platform = process.platform;

const _linux = (_platform === 'linux');

function executeCommand(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout) => {
            if (!error) {
                resolve(stdout);
            }
            else {
                reject(error);
            }
        });
    })
}

async function all_pids(callback) {
    const ps_cmd = 'ps -eo pid';
    try {
        var result = await executeCommand(ps_cmd);
        return result;
    } catch (err) {
        throw err;
    }

}

async function io_stats(data) {
    let io_stats = {
        pid: 0,
        rchar: 0,
        wchar: 0,
        syscr: 0,
        syscw: 0,
        read_bytes: 0,
        write_bytes: 0,
        cancelled_write_bytes: 0
    };
    let processes_io_data = [];

    for (var i = 0; i < data.length; i++) {
        let pid = data[i];
        try {
            let cmd = `cat /proc/${pid}/io`;
            var stdout = await executeCommand(cmd);
        }
        catch (err) {
            continue;
        }
        let lines = stdout.toString().split('\n');
        io_stats.pid = pid;
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
        var pids = await all_pids();
        pids = pids.toString().split('\n').splice(1);
        var result = await io_stats(pids.map(e => e.trim()));
        console.log("result",result);
    } catch (err) {
        throw err;
    }
}


process_io_data = processData()

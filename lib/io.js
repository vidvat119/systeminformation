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
    return new Promise((resolve,reject)=>{
    exec(cmd,(error , stdout) =>{
            if(!error){ 
                resolve(stdout);
            }
            else {
                reject(error);
            }
        });
    })
}
async function all_pids(callback){
        const ps_cmd = 'ps -eo pid';
        try{
            var result = await executeCommand(ps_cmd);
            return result;
        }catch(err){
            throw err;
        }
           
}

function io_stats(data){
    //console.log("check ",data);
    let processes_io_data = [];

    let io_stats = {
        pid:0,
        rchar: 0,
        wchar: 0,
        syscr: 0,
        syscw: 0,
        read_bytes: 0,
        write_bytes: 0,
        };

    data.forEach( async (pid) => {
       try{
        let cmd = `cat /proc/${pid}/io`;
        //console.log(cmd);
        var stdout = await executeCommand(cmd);
        }
        catch(err){ throw err;}
        let lines = stdout.toString().split('\n');
        io_stats.pid = pid;
        io_stats.rchar = parseInt(util.getValue(lines, 'rchar'),10); 
        io_stats.wchar = parseInt(util.getValue(lines, 'wchar'),10);
        io_stats.syscr = parseInt(util.getValue(lines, 'syscr'),10);
        io_stats.syscw = parseInt(util.getValue(lines, 'syscw'),10);
        io_stats.read_bytes = parseInt(util.getValue(lines, 'read_bytes'),10);    
        io_stats.write_bytes = parseInt(util.getValue(lines, 'write_bytes'),10);             
        processes_io_data.push(io_stats);
       
    });
return processes_io_data;
}

all_pids().then(data=>{
                let pids = [];
                //console.log(" excuted ps command linux!..");
                // 0 th element id 'PID' string so rest of the array is returned...
                pids = data.toString().split('\n').splice(1);
                // removing trailing spaces..
                pids = pids.map( e => e.trim());
                var d =  io_stats(pids);
                console.log(d);
}).catch(error => console.log(error));
// console.log(results)
// 
/*
        .then(function(data) {
            data = 'i am exuted!';
            console.log(data);
        const values = io_stats(data);
          console.log(values);
        })
        .catch(error => console.log(error));

*/

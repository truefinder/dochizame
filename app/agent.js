

var debug = true
function debug_log(log){
    if ( debug === true ){
        console.log(log);
    }

}

console_append("Dochizame's frida agent started")

/* frida doesn't support require/import, use frida-compile
require ('./util.js');
util_test();

*/

/*
// hook by address //
// to get a function address, please /bin/nm a.out
const func_ptr = memAddress(membase, '0x0', '0x0000000001DE1C78');
console.log("func_ptr addr: " + func_ptr);
// check bytes with ida hexbin
dump( func_ptr, 48);
Interceptor.attach(func_ptr, {
    onEnter: function (args) {
        console.log('[+] secript.js : ' + Memory.readUtf8String(args[2]));
    }
});

// hook by exported function name, .so or .dll //
var send_ptr = Module.findExportByName("libc.so", "connect");
Interceptor.attach(send_ptr, {
    onEnter: function (args) {
        console.log('[+] secript.js : ' + Memory.readUtf8String(args[2]));
    }
});

var aes_enc_ptr = Module.findExportByName("libapp.so", "AES_Ecrypt");
Interceptor.attach(aes_enc_ptr, {
    onEnter: function (args) {
        console.log('[+] secript.js : ' + Memory.readUtf8String(args[2]));
    }
});

*/

/* hook by address */

function memAddress(memBase, idaBase, idaAddr) {
    var offset = ptr(idaAddr).sub(idaBase);
    var result = ptr(memBase).add(offset);
    return result;
}

function idaAddress(memBase, idaBase, memAddr) {
    var offset = ptr(memAddr).sub(memBase);
    var result = ptr(idaBase).add(offset);
    return result;
}

function dump(pointer, length) {
    var buf = Memory.readByteArray(pointer, length);
    debug_log(hexdump(buf, {
      offset: 0,
      length: length,
      header: true,
      ansi: true
    }));
  }

function sdump(pointer, length) {
    var buf = Memory.readByteArray(pointer, length);
    var res = hexdump(buf, {
      offset: 0,
      length: length,
      header: false,
      ansi: false
    });
    return res ;
  }

function addOffset(pointer, offset) {
    var address = parseInt(pointer) + offset;
    var addressHex = "0x" + address.toString(16);
    return new NativePointer(addressHex);
}


function console_append(data){
    send({
             to:"console",
             data:data
         });
}

function editor_append(data){
    send({
             to:"editor",
             data:data
         });
}


////////////////////////////////////////////////////////////////
// communication protocol
// type
// * hook : ui -> js
// * editor : ui -> js , js -> ui
// * console : js -> ui
////////////////////////////////////////////////////////////////


var setting_module = "" // "native"
var setting_address = '' // '0x00000000000008b4'
var setting_args = '' // '0'

/*
var op = recv('hook', function(value) {

    console.log('value.payload = ' + JSON.stringify(value));
    setting_module = value.payload.module ;
    setting_address = value.payload.address ;
    setting_args = value.payload.args ;

    console.log("setting complete : " + setting_module + ",  " + setting_address + ", " + setting_args );


    var membase = Module.findBaseAddress(setting_module);
    var func_ptr = memAddress(membase, '0x0', setting_address);
    console.log("membase addr:" + membase + "func_ptr addr: " + func_ptr);
    var arg_num = Number(setting_args) ;

    var arg_string ;
    // var arg_string = Memory.allocUtf8String('hello world');

    Interceptor.attach(func_ptr, {

            onEnter: function (args) {
                console.log('args[0] : ' + Memory.readUtf8String(args[arg_num]));
                var data = Memory.readUtf8String(args[arg_num]) ;
                send({
                     to: "console",
                     name: "args",
                     data : data
                     });
                send({
                     to: "editor",
                     name: "args",
                     data : data
                     });

                var op = recv('editor', function(value) {
                    console.log('value.payload = ' + value.payload);
                    arg_string = Memory.allocUtf8String(value.payload);
                    console.log('arg_string = ' + Memory.readUtf8String(arg_string));
                    args[arg_num] = arg_string ;

                }).wait();


            },
            onLeave: function(retval) {
                console.log('leave');

            }
    });
});


var op = recv('unhook', function(value) {
   Interceptor.detachAll();
   console.log("unhook");
});
*/

////////////////////////////////////////////////////////////
var modified ;
function reciever(mode, param, option) {

        var op = recv('editor', function(value) {
            // {"action":"modify","data":"{ data1 : Baron of Hell , data2 : Cyberdemon, data3 : Moloch }"}
            debug_log('recv : value.payload = ' + JSON.stringify(value.payload));
            var action = value.payload.action ;

            if ( action === "modify") {
                modified = Memory.allocUtf8String(value.payload.data);
                debug_log('modified = ' + Memory.readUtf8String(modified));
                console_append('modified = ' + Memory.readUtf8String(modified));

                if ( mode === "return") {
                    // param = retval
                    param.replace(modified) ;
                }
                if ( mode === "argument"){
                    // param = args , option = arg_num
                    param[option] = modified ;
                }
            }
            if ( action === "pass") {
                debug_log('passed = ' + data );
                console_append('passed = ' + data );
            }

            if (action ==="flush"){
                editor_append("");
                debug_log("flushed"  );
                console_append("flushed");
            }

        }).wait();
}


function onControl(value) {

    // v0.2 {"command":"intercept","payload":{"address":"0x00000000000008b4","args":"1","module":"native"}}
    // v0.3 {"command":"intercept","payload":{"module":"native", "address":"0x00000000000008b4", "position":"argument", "args":"1"}}
    //      {"command":"intercept","payload":{"module":"native", "address":"0x00000000000008b4", "position":"return"}}

    if (value.command === "intercept") {

        debug_log('control : value.payload = ' + JSON.stringify(value));
        setting_module = value.payload.module ;
        setting_address = value.payload.address ;
        setting_args = value.payload.args ;

        debug_log("setting complete : " + setting_module + ",  " + setting_address + ", " + setting_args );


        var membase = Module.findBaseAddress(setting_module);
        var func_ptr = memAddress(membase, '0x0', setting_address);
        var arg_num = Number(setting_args) ;


        debug_log("membase addr : " + membase + ", func_ptr addr : " + func_ptr);
        console_append("setting : module addr : " + membase + ",  offset : " + setting_address + ", args num : " + setting_args );

        console_append("try intercepting ... func_ptr addr : " + func_ptr);
        console_append("function bytes : " + sdump(func_ptr, 16));


        var modified ;
        // var modified = Memory.allocUtf8String('hello world');

        Interceptor.attach(func_ptr, {

                onEnter: function (args) {
                    if (value.payload.position === "argument"){

                        console_append('args[' + arg_num + '] : ' + Memory.readUtf8String(args[arg_num]));
                        var data = Memory.readUtf8String(args[arg_num]) ;
                        /*
                        send({
                             to: "console",
                             name: "args",
                             data : data
                             });
                        send({
                             to: "editor",
                             name: "args",
                             data : data
                             });
                             */
                        console_append("before =  "+ data);
                        editor_append(data);

                        /*
                        var op = recv('editor', function(value) {
                            // {"action":"modify","data":"{ data1 : Baron of Hell , data2 : Cyberdemon, data3 : Moloch }"}
                            debug_log('recv : value.payload = ' + JSON.stringify(value.payload));
                            var action = value.payload.action ;


                            if ( action === "modify") {
                                modified = Memory.allocUtf8String(value.payload.data);
                                debug_log('modified = ' + Memory.readUtf8String(modified));
                                console_append('modified = ' + Memory.readUtf8String(modified));
                                args[arg_num] = modified ;
                            }
                            if ( action === "pass") {
                                debug_log('passed = ' + data );
                                console_append('passed = ' + data );
                            }

                            if (action ==="flush"){
                                editor_append("");
                                debug_log("flushed"  );
                                console_append("flushed");
                            }

                        }).wait();
                        */
                        reciever("argument", args, arg_num );

                    } // if

                },

                onLeave: function(retval) {

                    if (value.payload.position==="return"){

                        debug_log("hooked...." + retval ) ;
                        var data = retval.readUtf8String();
                        debug_log(data) ;

                        console_append("before =  "+ data);
                        editor_append(data);

                        reciever("return", retval, 0 );

                        debug_log( retval.readUtf8String());
                        debug_log('leave');
                    } // if
                    // '0x0000000000000904'

                }
        });
        debug_log("intercept succeeded");
        console_append("intercept succeeded");
    }
    if (value.command === "release") {
        Interceptor.detachAll();

        debug_log("release succeeded");
        console_append("release succeeded");
    }
    recv(onControl);
}
recv(onControl);

send({
    to: "console",
    data: "control handler work... ok",
    payload: {
        threadId: Process.getCurrentThreadId()
    }
});


function onStanza(stanza) {
    if (stanza.name === "request-status") {
        var threads = [];
        Process.enumerateThreads({
            onMatch: function (thread) {
                threads.push(thread);
            },
            onComplete: function () {
                send({
                    to:"console",
                    name: "status",
                    payload: threads
                });
            }
        });
    }
    recv(onStanza);
}
recv(onStanza);


send({
    to: "console",
    data: "stanza handler works... ok",
    payload: {
        threadId: Process.getCurrentThreadId()
    }
});







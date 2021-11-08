
console.log("LibC Socket hooker");

function onStanza(stanza) {
    if (stanza.name === "request-status") {
        var threads = [];
        Process.enumerateThreads({
            onMatch: function (thread) {
                threads.push(thread);
            },
            onComplete: function () {
                send({
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
    name: "hello",
    payload: {
        threadId: Process.getCurrentThreadId()
    }
});

var socketModule = {
    "windows": "ws2_32.dll",
    "darwin": "libSystem.B.dylib",
    "linux": "libc.so" // for android
    // android regards as linux, but real linux needs version suffix
    // "linux": "libc-2.19.so",

};

var socketFunctionPrefixes = [
    // "connect",
    // "recv",
    "send",
    // "read",
    // "write"
];

function isSocketFunction(name) {
    return socketFunctionPrefixes.some(function (prefix) {
        return name.indexOf(prefix) === 0;
    });
}
Module.enumerateExports(socketModule[Process.platform], {
    onMatch: function (exp) {
        if (exp.type === "function"
                && isSocketFunction(exp.name)) {

            Interceptor.attach(exp.address, {
                onEnter: function (args) {
                    this.fd = args[0].toInt32();
                    this.len = args[2].toInt32();
                    this.data = Memory.readCString(args[1],this.len);
                    //this.address = Socket.peerAddress(fd);

                    // TODO : exp.name == recv, send, connect, write, read ...
                    send({
                        name: "socket-activity",

                        // only for send()
                        sock_buf: {
                            fd: this.fd,
                            func: exp.name,
                            address: this.address,
                            data : this.data,
                            len : this.len
                        }
                    });

                },

                onLeave: function (retval) {
                    var fd = this.fd;
                    if (Socket.type(fd) !== "tcp")
                        return;
                    var address = Socket.peerAddress(fd);
                    if (address === null)
                        return;

                    send({
                        name: "socket-activity",
                        payload: {
                            fd: fd,
                            func: exp.name,
                            address: address

                        }
                    });

                }
            });
        }
    },
    onComplete: function () {
    }
});



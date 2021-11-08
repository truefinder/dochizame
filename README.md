# Dochizame

Dochizame is frida based GUI inspector suite for pentester 

 - Intercept almost every C/C++ based function from your smartphone 
 - Also Modify argument values and return value
 - Modify values synchronusly with GUI editor 
 - Dynamically intercept and release 

# Prerequisite 

Below open source projects are used for dochizame working properly : 

* [frida] - Hooking tool 
* [frida-qml] - Frida's Qt wrapper
* [Qt5] - Multiplatform Qt GUI library 
* [Qt Creator] - Qt IDE for user interface design 
* [xcode] - Apple's developer tool
* [node.js] - Javascript runtime 

# Build 

Open project on Qt Creator and just compile it
 
# How to run 
(on Android )
```bash
$gcc -o native target/native.c 
$adb put native /data/local/tmp/
$adb shell
android$ cd /data/local/tmp
android$ chmod 755 native 
android $./native 
```
(on your PC) 
* Open Dochizame.app (if on Mac) 
* Select process (native)
* Select module (native)
* Write function address (0x00000000000904)  
* Intercept
* Modify values in Editor 








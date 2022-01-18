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

* Choose process (select device & process ) 

![Screen Shot 2022-01-18 at 14 52 13](https://user-images.githubusercontent.com/4240789/149881336-0479f93d-c133-4350-94c9-73b66c758c83.png)

* Choose module (select module & write function address) 

![Screen Shot 2022-01-18 at 14 52 40](https://user-images.githubusercontent.com/4240789/149881344-b5cfbfa3-03e3-488d-ade4-5f1e68bdfce6.png)

* Modify values

![Screen Shot 2022-01-18 at 14 53 02](https://user-images.githubusercontent.com/4240789/149881348-f5d8a26d-45f2-434d-b105-0dd2dd53b880.png)

* Check result

![Screen Shot 2022-01-18 at 14 52 53](https://user-images.githubusercontent.com/4240789/149881346-f9c4e6c1-336e-4982-8e3b-ccf56fa9a441.png)


# Contacts 
Seunghyun Seo 













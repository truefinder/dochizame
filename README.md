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

![Screen Shot 2022-01-18 at 14 52 13](https://user-images.githubusercontent.com/4240789/149878895-9d547262-6bd6-4793-ba25-630dd84f7f7a.png)

* Select module (native)

![Screen Shot 2022-01-18 at 14 52 40](https://user-images.githubusercontent.com/4240789/149878900-7a5a2622-252e-4c6f-894b-749aff997d58.png)

* Write function address (0x00000000000904)  

![Screen Shot 2022-01-18 at 14 52 53](https://user-images.githubusercontent.com/4240789/149878907-5aa56ec9-2bf6-47b5-beeb-efe5d51251c1.png)

* Intercept
* Modify values in Editor 

![Screen Shot 2022-01-18 at 14 53 02](https://user-images.githubusercontent.com/4240789/149878915-78effea4-ab54-42a8-80b9-65ace62f4b3b.png)

# Contacts 
Seunghyun Seo 













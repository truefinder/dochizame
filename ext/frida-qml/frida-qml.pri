QMLPATHS += $$top_builddir/qml

win32 {
    LIBS_PRIVATE += "$${FRIDA_CORE_DEVKIT}/frida-core.lib"
}
unix {
    LIBS_PRIVATE += "-L$${FRIDA_CORE_DEVKIT}" -lfrida-core
}

win32 {
    QMAKE_LFLAGS += /INCLUDE:?qml_register_types_Frida@@YAXXZ
}
macx {
    QMAKE_LFLAGS += -Wl,-u,__Z24qml_register_types_Fridav
    LIBS_PRIVATE += -Wl,-framework,AppKit -lbsm -lresolv
}
linux {
    QMAKE_LFLAGS += -Wl,--require-defined=_Z24qml_register_types_Fridav
    LIBS_PRIVATE += -ldl -lresolv -lrt -pthread
}

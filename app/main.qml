import QtQuick 2.15
import QtQuick 2.0
import QtQuick.Window 2.15
import QtQuick.Controls 1.4
import QtQuick.Layouts 1.1
import QtQuick.Dialogs 1.2
//import QtQml.Models 2.15
// textarea doesn't look good with controls 2.15
import Frida 1.0
// qmlimportscanner needs to see this one for static linking:
import QtQuick.PrivateWidgets 1.1



ApplicationWindow {
    id : app
    title: qsTr("NullShark - Android Security Pentesting Tool")
    width: 1080
    height: 720
    visible: true

    menuBar: MenuBar {
        Menu {
            title: "File"
            MenuItem { text: "Open..." }
            MenuItem { text: "Close" }
        }

        Menu {
            title: "Edit"
            MenuItem { text: "Cut" }
            MenuItem { text: "Copy" }
            MenuItem { text: "Paste" }
        }
    }

    statusBar: StatusBar {
            RowLayout {
                anchors.fill: parent
                Label { text: "created by Seunghyun Seo" }
            }
        }


/*
    TabView{
        width:parent.width
        height: parent.height

        Tab{
            Layout.fillHeight: true
            Layout.fillWidth: true
            title: "Main"
*/ // TabView dosen't work with frida-qml

            ColumnLayout{
                x: 0
                y: 0
                width: parent.width
                height: parent.height

                MessageDialog {
                    id: errorDialog
                    title: "Error"
                    icon: StandardIcon.Critical
                }

                RowLayout {
                    Layout.alignment: Qt.AlignVCenter | Qt.AlignLeft
                    // anchors.fill: parent
                    spacing: 0
                    ColumnLayout {
                        Layout.fillHeight: true
                        spacing: 0
                        TableView {
                            id: devices
                            TableViewColumn {
                                role: "icon"
                                width: 16
                                delegate: Image {
                                    source: styleData.value
                                    fillMode: Image.Pad
                                }
                            }
                            TableViewColumn { role: "name"; title: "Name"; width: 220 }
                            model: deviceModel

                        }
                        Item {
                            width: processes.width
                            Layout.fillHeight: true

                            TableView {
                                id: processes
                                height: parent.height

                                TableViewColumn {
                                    role: "smallIcon"
                                    width: 16
                                    delegate: Image {
                                        source: styleData.value
                                        fillMode: Image.Pad
                                    }
                                }
                                TableViewColumn { role: "pid"; title: "Pid"; width: 50 }
                                TableViewColumn { role: "name"; title: "Name"; width: 150 }

                                model: processModel
                                onActivated: {
                                    deviceModel.get(devices.currentRow).inject( script, processModel.get(currentRow).pid);
                                }
                            }
                            BusyIndicator {
                                anchors.centerIn: parent
                                running: processModel.isLoading
                            }
                        }

                    }


                    ColumnLayout {
                        Layout.margins: 5

                        GroupBox{
                            title: "Setting"

                            Layout.fillWidth: true

                            Row{
                                Layout.fillWidth: true
                                Layout.alignment: Qt.AlignHCenter

                                Label {

                                    text:"Module : "
                                }
                                TextField{
                                    id : setting_module
                                    text:""
                                }
                                Label {
                                    text:"Address : "
                                }
                                TextField{
                                    id : setting_address
                                    text:""
                                }


                                ExclusiveGroup{
                                    id : exclusive
                                }

                                CheckBox{
                                    id : setting_argument
                                    text : "Argument"
                                    checked: true
                                    exclusiveGroup: exclusive

                                }

                                ComboBox{
                                    id: setting_args
                                    width: 40

                                    model : ListModel{
                                        ListElement{

                                            objectName:  "0"
                                        }
                                        ListElement{
                                            objectName: "1"
                                        }
                                        ListElement{
                                            objectName: "2"
                                        }
                                        ListElement{
                                            objectName: "3"
                                        }
                                        ListElement{
                                            objectName: "4"
                                        }
                                        ListElement{
                                            objectName: "5"
                                        }
                                        ListElement{
                                            objectName: "6"
                                        }
                                    }
                                }

                                CheckBox{
                                    id : setting_return
                                    text:"Return"
                                    exclusiveGroup: exclusive
                                }

                                Button{
                                    Layout.margins: 20
                                    Layout.alignment: Qt.AlignRight
                                    text: "Intercept"
                                    onClicked:{
                                        if ( setting_argument.checked) {

                                            // console.log("module : " + setting_module.text + ", address : " + setting_address.text + ", args : " + setting_args.currentText );
                                            script.post({
                                                command:"intercept",
                                                payload: {module : setting_module.text, address : setting_address.text, position : 'argument', args : setting_args.currentText }
                                            });

                                        }
                                        if ( setting_return.checked) {
                                            // console.log("module : " + setting_module.text + ", address : " + setting_address.text + ", args : " + setting_args.currentText );
                                            script.post({
                                                command:"intercept",
                                                payload: {module : setting_module.text, address : setting_address.text, position : 'return' }
                                            });

                                        }
                                    }
                                }

                                Button{
                                    Layout.margins: 20
                                    Layout.alignment: Qt.AlignRight
                                    text: "Release"
                                    onClicked:{
                                        // deatachAll
                                        script.post({ command:"release",payload: { } });

                                        // flush recv block after detachall
                                        editor.text = "" ;
                                        editor.editingFinished();
                                        script.post({ type:"editor", payload: { action : "flush", data : ""}});

                                        // deatachall for safe
                                        script.post({ command:"release",payload: { } });

                                    }
                                }
                            }
                        }


                        Label {
                            text : " Editor :"
                            Layout.fillHeight: false
                            Layout.fillWidth: true
                        }
                        RowLayout{


                            TextArea {
                                id: editor
                                Layout.fillWidth: true
                                Layout.fillHeight: true
                                readOnly: false
                                /*
                                background: Rectangle {
                                    border.color:"#AAAAAA"
                                }
                                */


                            }

                            ColumnLayout {
                                Layout.alignment: Qt.AlignTop

                                Button {
                                    Layout.alignment: Qt.AlignTop
                                    text: "Modify"
                                    onClicked: {
                                        editor.editingFinished();
                                        script.post({ type:"editor", payload: { action : "modify", data : editor.text}});
                                    }
                                }
                                Button {
                                    Layout.alignment: Qt.AlignTop
                                    text: "Pass"
                                    onClicked: {
                                        editor.editingFinished();

                                        script.post({ type:"editor", payload: { action : "pass", data : editor.text}});
                                    }
                                }

                                Button {
                                    Layout.alignment:  Qt.AlignTop
                                    text: "Flush"
                                    onClicked: {
                                        editor.editingFinished();
                                        script.post({ type:"editor", payload: { action : "flush", data : ""}});
                                    }
                                }

                                Button {
                                    Layout.alignment: Qt.AlignTop
                                    text: "Status"
                                    onClicked: {
                                        script.post({name: "request-status"});
                                    }
                                }
                            }
                        }


                    }

                }// Row

                ColumnLayout{
                    Label{
                        text: " Console :"
                    }
                    TextArea {
                        id: messages
                        Layout.alignment: Qt.AlignHCenter | Qt.AlignBottom
                        Layout.fillWidth: true
                        //Layout.fillHeight: true
                        height: parent.height-250
                        readOnly: true

                        /*
                        background: Rectangle {
                            border.color:"#AAAAAA"
                        }
                        */

                    }

                }

            } //ColumnLayout

/*
        }//Tab


        Tab{
            Layout.fillHeight: true
            Layout.fillWidth: true
            title:"Setting"

            RowLayout{
                Layout.alignment: Qt.AlignTop
                Column {
                    Layout.alignment: Qt.AlignTop


                    ButtonGroup {
                        id: childGroup
                        exclusive: false
                    }


                    GroupBox{
                        title: "1. Module + Address"

                        RowLayout{
                            CheckBox {
                                checked: true
                                //leftPadding: indicator.width
                                ButtonGroup.group: childGroup
                            }
                            Label{
                                text: "Module : "
                            }
                            TextField {
                                id : setting_module1
                                text:""
                            }
                            Label {
                                text: "Address : "
                            }
                            TextField {
                                id : setting_address1
                                text:""
                            }
                        }
                    }
                    GroupBox{
                        title: "2. Module + Name"
                        RowLayout{
                            CheckBox {
                                //leftPadding: indicator.width
                                ButtonGroup.group: childGroup
                            }
                            Label{
                                text: "Module : "
                            }
                            TextField {
                                id : setting_module2
                                text:""
                            }
                            Label {
                                text: "Name : "
                            }
                            TextField {
                                id : setting_name2
                                text:""
                            }
                        }
                    }


                } // Column



            }//Columnlayout

        }// Tab


    } // Tabveiw
*/

    ProcessListModel {
        id: processModel
        device: devices.currentRow !== -1 ? deviceModel.get(devices.currentRow) : null

        onError: {
            errorDialog.text = message;
            errorDialog.open();
        }
    }

    DeviceListModel {
        id: deviceModel
    }


    Script {
        id: script
        url: Qt.resolvedUrl("./agent.js")

         onMessage: {
            // console.log( JSON.stringify(object));
            if (object.type === "send") {

                if ( object.payload.to === "console"){
                    // QJsonObject returned
                    // var json_string = JSON.stringify(object) ;
                    // object { type, payload { name, type, data } }
                    messages.append(object.payload.data );

                }
                if ( object.payload.to === "editor"){
                    editor.text = "";
                    editor.append(object.payload.data) ;
                    editor.editingFinished();

                }
            }

        }

        onError: {
            errorDialog.text = message;
            errorDialog.open();
        }
    }//Script


} // Application



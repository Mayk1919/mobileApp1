import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Modal, Alert, KeyboardAvoidingView } from 'react-native';
import {TextInput, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { Camera as ExpoCamera } from "expo-camera";
import { roundToNearestPixel } from 'react-native/Libraries/Utilities/PixelRatio';

const CreateEmployee = ({navigation, route})=>{
    const getDetails = (type) => {
        if(route.params){
            switch(type){
                case "name":
                    return route.params.name
                case "phone":
                    return route.params.phone
                case "email":
                    return route.params.email
                case "salary":
                        return route.params.salary
                case "picture":
                        return route.params.picture
                case "position":
                        return route.params.position
            }
    }
    return ""
}
    if(route.params){
        console.log(route.params)
    }
    const [Name, setName] = useState(getDetails("name"))
    const [phone, setPhone] =useState(getDetails("phone"))
    const [email, setEmail] =useState(getDetails("email"))
    const [salary, setSalary] =useState(getDetails("salary"))
    const [picture, setPicture] =useState(getDetails("picture"))
    const [position, setPosition] =useState(getDetails("position"))
    const [modal, setModal] =useState(false)
    const [text, setText] = React.useState(false)
    const [enableshift, seenenableshift] = useState(false)


    const submitData = ()=>{
        fetch("http://10.0.2.2:3000/send-data",{
            method:"post",
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                name: Name,
                phone,
                email,
                salary,
                picture,
                position
                
            })
        })
        .then(res => res.json())
        .then(data => {
            //testfirst
            //console.log(data)
            Alert.alert(`${data.name} is saved`)
            navigation.navigate("Home")

        })
        .catch(err=>{
            Alert.alert("something went wrong")
        })
    }

    const updateDetails = () => {
        fetch("http://10.0.2.2:3000/update",{
            method:"put",
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                id: route.params._id,
                name: Name,
                phone,
                email,
                salary,
                picture,
                position
                
            })
        })
        .then(res => res.json())
        .then(data => {
      
            Alert.alert(`${data.name} is updated successfully`)
            navigation.navigate("Home")

        })
        .catch(err=>{
            Alert.alert("something went wrong")
        })
    }


    const pickFromGallery= async ()=>{
      
       const {granted} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    
        if(granted){
              let data = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes:ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1,1],
                    quality:0.5
        })
        if(!data.cancelled){
            let newfile ={ 
            uri:data.uri,
            type:`test/${data.uri.split(".")[1]}`, 
            name:`test/${data.uri.split(".")[1]}`
            
          }
            handleUpload(newfile)
          }
      
        }else{
                Alert.alert("you need to give us permission to work")

        }
    }
    const pickFromCamera = async ()=>{
       const {granted} = await Permissions.askAsync(Permissions.CAMERA)
        if(granted){
              let data = await ImagePicker.launchCameraAsync({
                    mediaTypes:ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1,1],
                    quality:0.5
        })
            if(!data.cancelled){
                let newfile ={ 
                uri:data.uri,
                type:`test/${data.uri.split(".")[1]}`, 
                name:`test/${data.uri.split(".")[1]}`
                
            }
                handleUpload(newfile)
            }
        }else{
                Alert.alert("you need to give us permission to work")
        }
    }

    const handleUpload =(image)=>{
        const data = new FormData()
        data.append('file', image)
        data.append('upload_preset', 'employeeApp')
        data.append("cloud_name", "florwinApp")

        fetch("https://api.cloudinary.com/v1_1/florwinapp/image/upload",{
            method: "post",
            body:data
    }).then(res=>res.json()).
    then(data=>{
        setPicture(data.url)
        setModal(false)
        })

        }

    return(
        <KeyboardAvoidingView 
            behavior="position" 
            style={styles.root} 
            enabled={enableshift}> 
          <View>
            <TextInput 
               style={styles.inputStyle}
                    label="Name"
                    value={Name}
                    theme={theme}
                    mode="outlined"
                    onChangeText={text => setName(text)}
               />  
               <TextInput 
               style={styles.inputStyle}
                    label="email"
                    value={email}
                    theme={theme}
                    mode="outlined"
                    onChangeText={text => setEmail(text)}
               />  
               <TextInput 
               style={styles.inputStyle}
                    label="phone"
                    value={phone}
                    theme={theme}
                    keyboardType= "number-pad"
                    mode="outlined"
                    onChangeText={text => setPhone(text)}
               />  
               <TextInput 
               style={styles.inputStyle}
                    label="salary"
                    value={salary}
                    theme={theme}
                    mode="outlined"
                    onChangeText={text => setSalary(text)}
               />  
               <TextInput 
               style={styles.inputStyle}
                    label="position"
                    value={position}
                    theme={theme}
                    mode="outlined"
                    onChangeText={text => setPosition(text)}
               />  
               <Button
                    style={styles.inputStyle} 
                    icon={picture==""?"upload":"check"} 
                    mode="contained" 
                    theme={theme}
                    onPress={() => setModal(true)}>
                            Upload Image
               </Button>
               {route.params 
                    ?
               <Button
                    style={styles.inputStyle} 
                    icon="content-save" 
                    mode="contained" 
                    theme={theme}
                    onPress={() => updateDetails()}>
                           Update Details
               </Button>
                    :
                <Button
                    style={styles.inputStyle} 
                    icon="content-save" 
                    mode="contained" 
                    theme={theme}
                    onPress={() => submitData()}>
                           Save
               </Button>

               }
               <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modal}
                    onRequestClose={()=>{
                        setModal(false)
                    }}
                >
                    <View style={styles.modalView}>
                    <View style={styles.modalButtonView}>
                        <Button 
                            icon="camera" 
                            mode="contained"
                            theme={theme} 
                              onPress={() => pickFromCamera()}>
                                Camera
                        </Button>  
                        <Button 
                            icon="image-area" 
                            mode="contained"
                            theme={theme} 
                            onPress={() => pickFromGallery()}>
                                Gallery
                        </Button> 
                    </View>
                        <Button  onPress={() => setModal(false)}>
                                Cancel
                        </Button>
                    </View>    
               </Modal>   
            
          </View> 
          </KeyboardAvoidingView>  
    )

}
const theme = {
    colors: {
        primary:"#006aff"
    }
}
const styles=StyleSheet.create({
    root:{
        flex:1
    },
    inputStyle:{
        margin: 5
    },
    modalButtonView:{
        flexDirection: "row",
        justifyContent: "space-around",
        padding:10
    },
    modalView:{
        position:"absolute",
        bottom:2,
        width:"100%",
        backgroundColor: "white",
    }
})


export default CreateEmployee
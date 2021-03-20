import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View, Image, Linking, Platform, Alert } from 'react-native';
import {Title, Card, Button} from 'react-native-paper';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';


const Profile = (props)=>{

    const {_id, name, picture, email, position, salary, phone } =props.route.params.item
    console.log(_id)
    const deleteEmployee = () => {
        fetch("http://10.0.2.2:3000/delete",{
            method:"put",
            headers:{
                'Content-Type': 'application/json',
        },
            body:JSON.stringify({
                id:_id

            })
        })
        .then(res => res.json())
        .then(deleteEmp=>{
           Alert.alert(`${deleteEmp.name} removed`) 
           props.navigation.navigate("Home")
        })
        .catch(err=>{
           Alert.alert("something went wrong")
        })

    }
    const openDial=()=>{
        if(Platform.OS === "android"){
            Linking.openURL(`tel:${phone}`)
        }else{
            Linking.openURL(`telprompt:${phone}`)
        }
    }
    return(
       <View style={styles.root}>
           <LinearGradient
             colors={["#0033ff", "#6bc1ff"]}
             style={{height: "20%"}}
            />
            <View style={{alignItems:"center"}}>
                <Image
                style={{width:100, height:100, borderRadius:50, marginTop:-50}}
                source={{ uri:picture}}
                />
            </View>
            <View style={{alignItems:"center", margin:15}}>
                <Title>{name}</Title>
                <Text style={{fontSize:18}}>{position}</Text>
            </View>
            <Card style={styles.myCard} onPress={()=>{
                Linking.openURL(`mailto:${email}`)
            }}>
                <View style={styles.cardContent}>
                    <MaterialIcons name="email" size={32} color="#006aff" />
                    <Text style={styles.mytext}>{email}</Text>
                </View>
            </Card>
            <Card style={styles.myCard} onPress={()=>openDial()}>
                <View style={styles.cardContent}>
                    <Entypo name="phone" size={32} color="#006aff" />
                    <Text style={styles.mytext}>{phone}</Text>
                </View>
            </Card>
            <Card style={styles.myCard}>
                <View style={styles.cardContent}>
                    <MaterialIcons name="attach-money" size={32} color="#006aff" />
                    <Text style={styles.mytext}>{salary}</Text>
                </View>
            </Card>
            
            <View style={{flexDirection:"row", justifyContent:"space-around", padding:10}}>
                <Button 
                    theme={theme} 
                    icon="account-edit" mode="contained" 
                     onPress={() => {
                        props.navigation.navigate("Create",
                        {_id, name, picture, email, position, salary, phone }
                        )
                     }}>
                        Edit
                </Button>
                <Button 
                    theme={theme} 
                    icon="delete" 
                    mode="contained" 
                    onPress={() => deleteEmployee()}>
                       End of Contract
                </Button>
            </View>
       </View>
    )
}
const theme = {
    colors: {
        primary:"#006aff"
    }
}
const styles = StyleSheet.create ({
    root:{
        flex:1
    },
    myCard:{
        margin: 3
    },
    cardContent:{
        flexDirection:"row",
        padding:8
    },
    mytext:{
        fontSize:18,
        marginTop:3,
        marginLeft:3
    }

})
export default Profile
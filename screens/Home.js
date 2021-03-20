import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Image, FlatList, ActivityIndicator } from 'react-native';
//import { State } from 'react-native-gesture-handler';
import {Card, FAB} from 'react-native-paper'
import {useSelector, useDispatch} from 'react-redux'


const Home=({navigation, route})=> {
    //const [data, setData] = useState([])
    //const [loading, setLoading] = useState(true)
   
    const dispatch = useDispatch()
    const {data, loading} = useSelector((state)=>{
        return state
    })

    const fetchData = () => {
        fetch("http://10.0.2.2:3000/")
        .then(res=>res.json())
        .then(results=>{
              //setData(results)
            //setLoading(false)
        dispatch({type:"ADD_DATA", payload:results})
        dispatch({type:"SET_LOADING", payload:false})

    }).catch(err=>{
        Alert.alert("error while uploading")
    })
}

    useEffect(()=>{
        fetchData()
    }, [])

    const renderList = ((item)=>{
        return (
           <Card style={styles.mycard}
            onPress={()=>navigation.navigate("Profile",{item})}
           >
           <View style={styles.cardView}> 
                
                <Image
                style={{width: 60, height:60, borderRadius:50}}
                source={{uri:item.picture}}
                />

                <View style={{marginLeft:10}}>
                    <Text style={styles.text}>My name is {item.name}.</Text>
                    <Text style={styles.text2}>{item.position}</Text>
                </View>                 
            </View>    
        </Card>
    
        )
       })
   

    return (
    <View style={{flex:1}}> 
            {
            loading
            ?
            <ActivityIndicator size="large" color="#0000ff" />
            :
            <FlatList 
                data={data}
                renderItem={({item})=>{
                return renderList(item)
            }}
                keyExtractor={item=>item._id}
                onRefresh={()=>fetchData()}
                refreshing={loading}
                />
            } 
    <FAB    onPress ={()=>navigation.navigate("Create")}
            style={styles.fab}
            small={false}
            icon="plus"
            theme={{colors:{accent:"#006aff"}}}
          />

    </View> 
    

  )         
}

const styles = StyleSheet.create({
    mycard:{
        margin: 5,
    },
    cardView:{
        flexDirection: "row",
        padding: 6,
    },
    text:{
        fontSize: 18,
    },
    text2:{
        fontSize:16,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
})

export default Home
import React, { useState, useEffect } from 'react';
import {
  View,
  ImageBackground,
  Dimensions,
  Text,
  FlatList,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Alert,
} from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import moment from 'moment';
import { RFValue } from "react-native-responsive-fontsize";
import firebase from 'firebase';
import db from '../config';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

// import { floatingButton } from './FloatingButton';
import { globalStyles } from './GlobalStyles';

// import AddTask from './AddTask'

export default function Home({ navigation }) {
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [tasks,setTasks]=useState([]);

  useEffect(() => {

    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    const datee = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = days[datee.getDay()];
   

    //Alert.alert(date + '-' + month + '-' + year);
    // You can turn it in to your desired format
    setCurrentDateTime( currentDay + " "+ date + '-' + month + '-' + year);//format: d-m-y;


    // const interval = setInterval(() => {
    //   const currentDate = new Date();

    //   setCurrentDateTime(currentDate.toLocaleString());
    // }, 1000);

    // return () => {
    //   clearInterval(interval);
    // };
  }, []);

  useEffect(()=>{
    getTasks();
  },[])

  const getTasks = async() => {
 

 db.collection(firebase.auth().currentUser.email).onSnapshot((snapshot) => {
  var allT = [];
  snapshot.docs.map((doc) => {
    var task = doc.data();
     task.id=doc.id;
    allT.push(task);
   
  })
 setTasks(allT);
 
 
});
}

const emptylist=()=>{
  return(
    <View style={{alignSelf:'center',justifyContent:'center',alignItems:'center',}}>
<Text style={{fontSize:20,fontWeight:'bold',textAlign:'center'}} > No orders at the moment</Text>
</View>
  ) 
}

const logout=()=>{
  firebase.auth().signOut().then(() => {
Alert.alert('You are successfully logged out.')
navigation.navigate('Splash')
}).catch((error) => {
Alert.alert('Something went wrong. Could you please try again later.')
});
}

const handleDelete = (postId) => {
  Alert.alert(
    'Delete post',
    'Are you sure?',
    [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed!'),
        style: 'cancel',
      },
      {
        text: 'Confirm',
        onPress: () => deleteTask(postId),
      },
    ],
    {cancelable: false},
  );
};

const deleteTask= async(id)=>{
 await db.collection(firebase.auth().currentUser.email).doc(id).delete().then(() => {
    alert("Task successfully deleted!");
   
}).catch((error) => {
    alert("Something went wrong!Try later");
});
getTasks();
}

const renderItem = ({item}) => {
  return(
    <View style={{backgroundColor:'#e75480',width:'90%',marginLeft:30,marginRight:13,borderRadius:20,flex:1}}>
      <View style = {{ 
        backgroundColor:'#f9ccca',borderRadius:10,marginLeft:20,padding:10,width:'95%',marginTop:10}}>
          <ScrollView>
          <Text style = {{
              fontSize : RFValue(15),
              marginLeft : RFValue(5)
          }}>Date : {item.date}</Text>
          <Text style = {{
              fontSize : RFValue(15),
              marginLeft : RFValue(5)
          }}>Time : {item.time}</Text>
          <Text style = {{
              alignSelf : "center",
              fontSize : RFValue(23)
          }}>{item.task}</Text>
            <Pressable style={{alignSelf:'flex-end',marginRight:10}} onPress={()=>handleDelete(item.id)}>
                 <MaterialCommunityIcons name="delete-empty" size={22} color="red" />
                 </Pressable>
         
          </ScrollView>
      </View>
  </View>
  )
}

  return (
    <View style={{ flex: 1 }}>
      <Text
        style={{
          fontSize: 20,
          alignSelf: 'flex-start',
          marginTop: 20,
          marginLeft: 20,
          fontWeight:'bold',
        }}>
        Today
      </Text>
      <View style={{flexDirection:'row',justifyContent:'space-between'}}>
      <Text
        style={{
          fontSize: 15,
          alignSelf: 'flex-start',
          marginLeft: 20,
          color:'grey'
        }}>
        {currentDateTime}
      </Text>

      <TouchableOpacity onPress={logout}
        style={{marginRight:20,width:40, height:40,alignItems:'center',backgroundColor:'#ec3151',borderRadius:100,alignSelf:'flex-end',justifyContent:'center'}}>
      
      <AntDesign name="logout" size={24} color="white" />
      </TouchableOpacity>
      </View>
      <CalendarStrip
        daySelectionAnimation={{
          type: 'border',
          duration: 100,
          borderWidth: 4,
          borderHighlightColor: 'pink',
        }}
        style={{
          height: '15%',
          fontSize: 40,
        }}
        calendarHeaderStyle={{
          color: '#de3161',
          fontSize: 18,
          marginTop: 20,
        }}
        dateNumberStyle={{ color: 'black' }}
        dateNameStyle={{ color: 'black' }}
        highlightDateNumberStyle={{ color: '##0d2e63' }}
        highlightDateNameStyle={{ color: '##0d2e63' }}
        selectedDate={moment()}
        scrollable={true}
        iconContainer={{ flex: 0.1 }}
      />
       


                        <FlatList 
                         ListEmptyComponent={emptylist}
                         scrollEnabled = {true}
                        data = {tasks}
                        renderItem={renderItem}
                        keyExtractor={(item, index)=>index.toString()}
                        style={{
                          marginBottom:20,
                         // marginTop:30
                        }}
                          />
              
              <TouchableOpacity
        onPress={()=>navigation.navigate('AddTask')}
        style={globalStyles.fab}>
        <AntDesign name="plus" size={32} color="white" />
      </TouchableOpacity>
     
    </View>
  );
}

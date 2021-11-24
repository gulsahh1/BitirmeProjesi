import React,{useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  FlatList,
  Keyboard,

} from 'react-native';
import { Icon, Avatar, Image, Input,ListItem } from 'react-native-elements';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import ImagePicker from 'react-native-image-crop-picker';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import 'moment/locale/tr';
import { selectUser } from "../redux/action";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const MyFollowers = (props) => {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.userData);
  const userFollowers = useSelector(state => state.userFollowers);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      setLoading(true);
  }, []);

  const skipUser = (item) => {
    if(userData.uid==item.uid){
      props.navigation.navigate("MyProfile");
    }else{
      firestore()
        .collection('Users')
        .where('uid','==',item.uid)
        .get()
        .then(querySnapshot => {
        var docArray = querySnapshot.docs.map(doc => doc.data());
        dispatch(selectUser(docArray[0]));
        props.navigation.navigate("UserProfile");
        });
    }
  }




  return(
    <View style={styles.container}>
    <View style={{height: 60, flexDirection: 'row'}}>
      <View style={{justifyContent:'center', flex:1}}>
        <Icon
          name='chevron-back'
          type='ionicon'
          color='black'
          size={38}
          containerStyle={{
            marginLeft: 10,
          }}
          onPress={() => props.navigation.goBack()} />
        </View>
        <View style={{flex:3, justifyContent:'center'}}>
          <Text style={{fontSize: 24, fontWeight: 'bold'}}>Takipçiler</Text>
        </View>
        <View style={{flex:1, justifyContent:'center'}}>
        </View>
    </View>
    <ScrollView>
    { loading ?
    (  userFollowers.map((l, i) => (
        <TouchableOpacity key={i} onPress={() => skipUser(l)}>
        <ListItem bottomDivider>
          <Avatar
          rounded
          size={50}
          source={{uri: l.pp}} />
          <ListItem.Content>
            <ListItem.Title style={{fontSize: 18}}>{l.name}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
        </TouchableOpacity>
      )) ) : (<></>)
    }
    </ScrollView>
    </View>
  );
}
export default MyFollowers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

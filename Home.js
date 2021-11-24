import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  FlatList,
  TouchableOpacity
} from 'react-native';
import GoogleFit, { Scopes } from 'react-native-google-fit';
import { Icon, Avatar, Image } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import 'moment/locale/tr';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { selectPost } from "../redux/action";


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Home = (props) => {
  const dispatch = useDispatch();
  const userFollowings = useSelector(state => state.userFollowings);
  const userData = useSelector(state => state.userData);
  const userFeeds = useSelector(state => state.userFeeds);
  const feedsLikes = useSelector(state => state.feedsLikes);
  const feedComments = useSelector(state => state.feedComments);
  const feedsIsLiked = useSelector(state => state.feedsIsLiked);
  const notifications = useSelector(state => state.notifications);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
    setTimeout(() => {
      setLoading(true);
    }, 500);
  },[]);


  const like = (item) => {

    firestore()
      .collection('Likes/'+item.id+'/Users')
      .doc(userData.uid)
      .set({
        uid: userData.uid,
        pp: userData.pp,
        name: userData.name,
        createdAt: new Date(),
      })
      .then(() => {
        console.log('like added!');

        firestore()
          .collection('Users/'+item.uid+'/Notifications')
          .add({
            uid: userData.uid,
            pp: userData.pp,
            name: userData.name,
            docid: item.id,
            createdAt: new Date(),
            type: 'like',
          })
          .then(() => {
            console.log('like added!');
          });

      });

  }

  const unlike = (item) => {

    firestore()
      .collection('Likes/'+item.id+'/Users')
      .doc(userData.uid)
      .delete()
      .then(() => {
        console.log('like deleted!');
      });

  }


  const renderItem = ({ item, index }) => {
    //var xid = "fryHe2caNuc2QoqMmOvZ";
    return(
      <View style={{margin: 10, backgroundColor: 'white', borderRadius: 5, paddingVertical: 10, paddingHorizontal: 10, elevation: 7}}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
          <Avatar
            rounded
            size={40}
            source={{
              uri:
                item.pp,
              }}
            />
          <View style={{flex:1, justifyContent: 'center', marginLeft: 15}}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>{item.name}</Text>
          </View>
        </View>
        <View>
          <Image
              source={{ uri: item.url }}
              style={{ width: windowWidth-40, height: (windowWidth-40)*3/4, borderRadius: 5}}
          />
        </View>
        <View style={{marginTop: 5, flexDirection: 'row'}}>
        <Icon
          name={feedsIsLiked[item.id] ? 'heart' : 'heart-outline'}
          type='ionicon'
          color={feedsIsLiked[item.id] ? 'red' : 'black'}
          size={30}
          containerStyle={{
            marginLeft: 5,
          }}
          onPress={() => {
            if(feedsIsLiked[item.id]){
              unlike(item);
            }else{
              like(item);
            }
          }} />
          <Icon
            name='chatbox-outline'
            type='ionicon'
            color='black'
            size={30}
            containerStyle={{
              marginLeft: 15,
            }}
            onPress={() => {
              dispatch(selectPost(item));
              props.navigation.navigate("Comments");
            }} />
        </View>
        {item.description!="" ? (
          <View style={{marginTop: 5, marginLeft: 7}}>
            <Text style={{fontSize: 14}}>{item.description}</Text>
          </View> ) : (<></>)
        }
        <View style={{marginTop: 5, marginLeft: 5}}>
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>{feedsLikes[item.id] ? feedsLikes[item.id].length : '0'} beğenme</Text>
        </View>
        <TouchableOpacity onPress={() => {
          dispatch(selectPost(item));
          props.navigation.navigate("Comments");
        }}>
          <View style={{marginLeft: 5}}>
            <Text style={{fontSize: 15, fontWeight: 'bold', color: '#A3A2B0'}}>{feedComments[item.id] && feedComments[item.id].length>0 ? feedComments[item.id].length+' yorumun tümünü gör' : ''}</Text>
          </View>
        </TouchableOpacity>
        <View style={{marginLeft: 5, marginTop: 5}}>
          <Text style={{fontSize: 12,color: '#A3A2B0'}}>{moment(item.createdAt.toDate()).fromNow()}</Text>
        </View>
      </View>
    );
}
  return(
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', flex:1}}>
          <View style={{flex: 4, justifyContent: 'center', marginLeft: 20}}>
            <Text style={{fontSize: 25, fontWeight: 'bold', color: 'white'}}>Formumu Koruyorum</Text>
          </View>
          <View style={{flex:1, justifyContent: 'center', alignItems: 'center',}}>
            <Icon
              name='notifications'
              type='ionicons'
              color='white'
              size={35}
              containerStyle={{
                marginLeft: 5,
              }}
              onPress={() => props.navigation.navigate("Notification")} />
          </View>
        </View>
      </View>
      {loading ? (
      <FlatList
        data={userFeeds}
        renderItem={renderItem}
        keyExtractor={(item, index) => index}
      />) : (<></>)}
    </View>
  );
}
export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    height: 60,
    backgroundColor: '#50d890',
  },
});

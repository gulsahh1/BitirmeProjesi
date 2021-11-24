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
import { Icon, Avatar, Image, Input, CheckBox, LinearProgress } from 'react-native-elements';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import ImagePicker from 'react-native-image-crop-picker';
import { useSelector, useDispatch } from 'react-redux';
import { fetchComments } from "../redux/action";
import moment from 'moment';
import 'moment/locale/tr';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const Comments = (props) => {
  const dispatch = useDispatch();
  const selectedPost = useSelector(state => state.selectedPost);
  const userData = useSelector(state => state.userData);
  const postComments = useSelector(state => state.postComments);

  const [comment, setComment] = useState("");

  useEffect(() => {
    const subscriber = firestore()
      .collection('Comments/'+selectedPost.id+'/users')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        dispatch(fetchComments(querySnapshot.docs.map(doc => doc.data())));
      });

    return () => subscriber();
  }, [selectedPost]);


  const createComment = () => {
    if(comment.length!=""){
      firestore()
      .collection('Comments/'+selectedPost.id+'/users')
      .add({
        comment: comment,
        name: userData.name,
        uid: userData.uid,
        pp: userData.pp,
        instructor: userData.instructor,
        createdAt: new Date(),
      })
      .then((docRef) => {
        console.log('comment added!');

        firestore()
        .collection('Comments/'+selectedPost.id+'/users')
        .doc(docRef.id)
        .update({
          id: docRef.id,
        })
        .then(() => {
          console.log('id added!');
        });

        firestore()
          .collection('Users/'+selectedPost.uid+'/Notifications')
          .add({
            uid: userData.uid,
            pp: userData.pp,
            name: userData.name,
            docid: selectedPost.id,
            createdAt: new Date(),
            type: 'comment',
          })
          .then(() => {
            console.log('notif added!');
          });

      });
    }
  }

  const renderItem = ({ item, index }) => {

    return(
      <View style={{flexDirection:'row', marginTop: index==0 ? 10 : 3, marginBottom: index==postComments.length-1 ? 10 : 2, marginHorizontal:5, paddingVertical: 10, backgroundColor:'white', paddingHorizontal: 5, elevation:7, borderRadius:5}}>
        <View style={{marginHorizontal: 5}}>
          <Avatar
          rounded
          size={50}
          source={{uri: item.pp}} />
        </View>
        <View style={{marginHorizontal: 5,flexShrink:1}}>
          <Text style={{fontWeight:'bold'}}>
          {item.name}
          </Text>
          <Text>
          {item.comment}
          </Text>
          <Text style={{color:'gray', fontSize: 12, marginTop:5}}>
          {moment(item.createdAt.toDate()).fromNow()}
          </Text>
        </View>
      </View>
      );
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
            <Text style={{fontSize: 24, fontWeight: 'bold'}}>Yorumlar</Text>
          </View>
          <View style={{flex:1, justifyContent:'center'}}>
          </View>
      </View>

        {true ? (
        <FlatList
          data={postComments}
          renderItem={renderItem}
          keyExtractor={(item, index) => index}
        />) : (<></>)}

      <View style={{flexDirection: 'row'}}>
      <TextInput
          style={styles.newInput}
          value={comment}
          onSubmitEditing={() => console.log("ok")}
          placeholder="Yorum Yaz..."
          returnKeyType="send"
          multiline
          //ref="newMessage"
          //onFocus={this.inputFocused.bind(this, "newMessage")}
          //onBlur={() => {this.refs.scrollView.scrollTo(0,0)}}
          onChangeText={setComment}
          />
          <Icon
            name='send'
            type='ionicon'
            color='black'
            size={35}
            containerStyle={{
              justifyContent: 'center',
              paddingHorizontal: 5,
              marginRight: 10
            }}
            onPress={() => {
              createComment();
              setComment("");
              Keyboard.dismiss();
              }} />
      </View>
    </View>
  );
}
export default Comments;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  newInput: {
    flex:1,
   fontSize: 16,
   padding:10,
   height:50,
 },
});

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { SearchBar, ListItem, Avatar, Badge } from 'react-native-elements';
import auth, {firebase} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useSelector, useDispatch } from 'react-redux';
import { selectMessageChannel } from "../redux/action";

const Chat = (props) => {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.userData);
  const [search, setSearch] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [messageUsers, setMessageUsers] = useState([]);

  const updateSearch = (search) => {
    setSearch(search);
  };

  const createChannel = (item) => {
    firestore()
      .collection('Users/'+userData.uid+'/messageChannels')
      .where('uid','==',item.uid)
      .get()
      .then(querySnapshot => {
        if(querySnapshot.docs.length>0){
          dispatch(selectMessageChannel(querySnapshot.docs[0].data()));
        //  console.log(querySnapshot.docs[0].data());
          props.navigation.navigate("Messages");
        }else{
          firestore()
            .collection('Users/'+userData.uid+'/messageChannels')
            .add({
              uid: item.uid,
              pp: item.pp,
              name: item.name,
              createdAt: new Date(),
            })
            .then((docRef) => {
              console.log('channel added!');
              firestore()
              .collection('Users/'+userData.uid+'/messageChannels')
              .doc(docRef.id)
              .update({
                channelid: docRef.id,
              })
              .then(() => {
                console.log("channelid added");

                firestore()
                  .collection('Users/'+item.uid+'/messageChannels')
                  .doc(docRef.id)
                  .set({
                    channelid: docRef.id,
                    uid: userData.uid,
                    pp: userData.pp,
                    name: userData.name,
                    lastmessage: "",
                    hasSeen: true,
                    createdAt: new Date(),
                  })
                  .then(() => {
                      firestore()
                        .collection('Users/'+userData.uid+'/messageChannels')
                        .where('uid','==',item.uid)
                        .get()
                        .then(querySs => {
                          if(querySs.docs.length>0){
                            dispatch(selectMessageChannel(querySs.docs[0].data()));
                          //  console.log(querySnapshot.docs[0].data());
                            props.navigation.navigate("Messages");
                          }
                          });
                  });

              });
            });

        }
      });
  }

  useEffect(() => {
    if(search!=""){
      firestore()
        .collection('Users')
        .orderBy('name')
        .startAt(search)
        .endAt(search + '\uf8ff')
        .where('name','!=',userData.name)
        .get()
        .then(querySnapshot => {
        setSearchData(querySnapshot.docs.map(doc => doc.data()));
        });
    }
  }, [search]);

  useEffect(() => {
    if(userData){
      const subscriber = firestore()
        .collection('Users/'+userData.uid+'/messageChannels')
        .orderBy('createdAt','desc')
        .onSnapshot(querySnapshot => {
        setMessageUsers(querySnapshot.docs.map(doc => doc.data()));
        });

        return () => subscriber();
    }
  }, []);

  return(
    <View style={styles.container}>
      <SearchBar
        platform='default'
        lightTheme={true}
        containerStyle={{
          backgroundColor: 'white'
        }}
        inputContainerStyle={{
          backgroundColor: '#ebedf0'
        }}
        placeholder="Ara..."
        onChangeText={updateSearch}
        value={search}
      />
      <View>
      <ScrollView>
      { search.length > 0 ?
      (  searchData.map((l, i) => (
          <TouchableOpacity key={i} onPress={() => {
            //dispatch(selectUser(l));
            createChannel(l);
            //props.navigation.navigate("Messages");
            }}>
          <ListItem bottomDivider containerStyle={{backgroundColor: '#f0f0f0'}}>
            <Avatar
            rounded
            size={50}
            source={{uri: l.pp}} />
            <ListItem.Content>
              <ListItem.Title>{l.name}</ListItem.Title>
              <ListItem.Subtitle>{l.email}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
          </TouchableOpacity>
        )) ) : (<></>)
      }
      { messageUsers.length > 0 ?
      (  messageUsers.map((l, i) => (
          <TouchableOpacity key={i} onPress={() => {
            createChannel(l);
            //props.navigation.navigate("Messages");
            }}>
          <ListItem bottomDivider>
            <Avatar
            rounded
            size={50}
            source={{uri: l.pp}} />
            <ListItem.Content>
              <ListItem.Title>{l.name}</ListItem.Title>
              <ListItem.Subtitle>{l.lastmessage}</ListItem.Subtitle>
            </ListItem.Content>
            {!l.hasSeen ? (
              <Badge status="success" badgeStyle={{width: 10, height: 10, borderRadius: 5}}/>
            ) : (<></>)
          }
          </ListItem>
          </TouchableOpacity>
        )) ) : (<></>)
      }
      </ScrollView>
      </View>
    </View>
  );
}
export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

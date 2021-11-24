import React, { useState, useCallback, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Clipboard,
  ActivityIndicator,
} from 'react-native';
import { GiftedChat, Bubble, Send, LoadEarlier  } from 'react-native-gifted-chat';
import { Icon, Avatar, Image, Input,ListItem } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import 'dayjs/locale/tr'

import auth, {firebase} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useSelector, useDispatch } from 'react-redux';

const Messages = (props) => {
  const [messages, setMessages] = useState([]);
  const selectedChannel = useSelector(state => state.selectedChannel);
  const userData = useSelector(state => state.userData);
  const [limit, setLimit] = useState(20);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading,setLoading] = useState(false);
  const [loadEarlier, setLoadEarlier] = useState(true);

  const loadEarlierTr = (props) => <LoadEarlier {...props} label="Önceki mesajları yükle" />;

  useEffect(() => {
    if(selectedChannel){

      const subscriber3 = firestore()
        .collection('Messages/'+selectedChannel.channelid+"/message")
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .onSnapshot(querySnapshot => {

          firestore()
            .collection('Users/'+userData.uid+'/messageChannels')
            .doc(selectedChannel.channelid)
            .update({
              hasSeen: true,
            })
            .then(() => {
              console.log('Channel updated!');
            });

          const messages = querySnapshot.docs.map((doc) => {
            //const firebaseData = doc.data();
              return {
                _id: doc.id,
                text: doc.data().text,
                createdAt: doc.data().createdAt.toDate(),
                user: {
                  _id: doc.data().senderid,
                  name: doc.data().sendername,
                  avatar: doc.data().pp,
                },
              };
          });
          setMessages(messages);
          setLastVisible(messages[messages.length-1].createdAt);
        });

        return () => subscriber3();
    }

    }, [])

    const onLoadEarlier = () => {
        setLoading(true);
        firestore()
        .collection('Messages/'+selectedChannel.channelid+"/message")
        .orderBy('createdAt', 'desc')
        .startAfter(lastVisible)
        .limit(limit)
        .get()
        .then(querySnapshot => {
          if(querySnapshot.docs.length<1){
            setLoadEarlier(false);
          }
          const newmessages = querySnapshot.docs.map((doc) => {
            //const firebaseData = doc.data();
              return {
                _id: doc.id,
                text: doc.data().text,
                createdAt: doc.data().createdAt.toDate(),
                user: {
                  _id: doc.data().senderid,
                  name: doc.data().sendername,
                  avatar: doc.data().pp,
                },
              };
          });
          setMessages(previousMessages => [...previousMessages, ...newmessages]);
          if(newmessages[newmessages.length-1]){
            setLastVisible(newmessages[newmessages.length-1].createdAt);
          }
          setLoading(false);
        });
    }

    const onSend = useCallback((messages = []) => {

      firestore()
        .collection('Messages/'+selectedChannel.channelid+'/message')
        .add({
          senderid: userData.uid,
          sendername: userData.name,
          receiverid: selectedChannel.uid,
          receivername: selectedChannel.name,
          text: messages[0].text,
          createdAt: new Date(),
          pp: userData.pp,
        })
        .then((docRef) => {
          console.log('message added!');

          firestore()
            .collection('Users/'+userData.uid+'/messageChannels')
            .doc(selectedChannel.channelid)
            .update({
              createdAt: new Date(),
              hasSeen: true,
              lastmessage: messages[0].text,
            })
            .then(() => {
              console.log('Channel updated!');
            });

          firestore()
            .collection('Users/'+selectedChannel.uid+'/messageChannels')
            .doc(selectedChannel.channelid)
            .update({
              createdAt: new Date(),
              hasSeen: false,
              lastmessage: messages[0].text,
            })
            .then(() => {
              console.log('Channel updated!');
            });

        });



    }, []);

    const renderBubble = (props) => {
      return (
        <Bubble
          {...props}
          wrapperStyle={{
            left: {
              backgroundColor: '#f2f1f2'
            },
            right: {
              backgroundColor: '#746cfc'
            }
          }}
        />
      )
    }


    const renderSend = (props) => {
      return (
        <Send
          {...props}
          containerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            marginRight: 20,
      }}
        >
        <FontAwesome
          name="paper-plane"
          color="#05375a"
          size={35}
          />
        </Send>
      );
    }

    const onLongPress = (context,message) => {
      if (props.onLongPress) {
        props.onLongPress(context, message);
      } else {
        if (message.text) {
          const options = [
            'Kopyala',
            'İptal',
          ];
          const cancelButtonIndex = options.length - 1;
          context.actionSheet().showActionSheetWithOptions({
            options,
            cancelButtonIndex,
          },
          (buttonIndex) => {
            switch (buttonIndex) {
              case 0:
                Clipboard.setString(message.text);
                break;
            }
          });
        }
      }
    }


    return (
      <View style={{flex:1, backgroundColor: 'white'}}>
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
              <Text style={{fontSize: 24, fontWeight: 'bold'}}>{selectedChannel.name}</Text>
            </View>
            <View style={{flex:1, justifyContent:'center'}}>
            </View>
        </View>
      <GiftedChat
        infiniteScroll={true}
        isLoadingEarlier={loading}
        loadEarlier={loadEarlier}
        renderLoading={() =>  <ActivityIndicator size="large" color="#0000ff" />}
        renderLoadEarlier={loadEarlierTr}
        renderBubble={renderBubble}
        renderSend={renderSend}
        onLongPress={onLongPress}
        onLoadEarlier={onLoadEarlier}
        renderUsernameOnMessage={true}
        alwaysShowSend={true}
        showUserAvatar = {true}
        placeholder= "Bir mesaj yazın..."
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: userData.uid,
          name: userData.name,
        }}
        locale = "tr"
      />
      </View>
    )

}
export default Messages;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

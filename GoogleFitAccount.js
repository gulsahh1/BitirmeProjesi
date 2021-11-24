import React,{useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { Icon, Avatar, Image, Input, CheckBox, LinearProgress, ListItem } from 'react-native-elements';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useSelector, useDispatch } from 'react-redux';
import GoogleFit, { Scopes } from 'react-native-google-fit';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const GoogleFitAccount = (props) => {
  const [isConnected,setIsConnected] = useState(false);
  const userData = useSelector(state => state.userData);

  const connect = () => {
    const options = {
        scopes: [
          Scopes.FITNESS_ACTIVITY_READ,
          Scopes.FITNESS_ACTIVITY_WRITE,
          Scopes.FITNESS_BODY_READ,
          Scopes.FITNESS_BODY_WRITE,
        ],
      }

      GoogleFit.authorize(options)
        .then(authResult => {
          if (authResult.success) {
            console.log("AUTH_SUCCESS");
            setIsConnected(authResult.success);
          } else {
            console.log("AUTH_DENIED", authResult.message);
          }
        })
        .catch(() => {
          console.log("AUTH_ERROR");
        });
  }

  const disconnect = () => {
    GoogleFit.disconnect();
    setIsConnected(false);
  }

  useEffect(() => {
    GoogleFit.checkIsAuthorized().then(() => {
            setIsConnected(GoogleFit.isAuthorized);
        })
  },[]);


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
            <Text style={{fontSize: 24, fontWeight: 'bold'}}>Google Fit Hesabı</Text>
          </View>
          <View style={{flex:1, justifyContent:'center'}}>
          </View>
      </View>
      <View style={{flex:1}}>
      <View style={{height: 50,justifyContent: 'center', alignItems: 'center'}}>
        {
          isConnected ? (
            <Text style={{fontWeight: 'bold', color: 'green'}}>Google Hesabı Bağlandı</Text>
          ) : (
            <Text style={{fontWeight: 'bold'}}>Bağlı Hesap Yok</Text>
          )
        }
      </View>
      {
        isConnected ? (
          <TouchableOpacity onPress={() => disconnect()}>
            <ListItem topDivider bottomDivider>
              <ListItem.Content style={{alignItems:'center'}}>
                <ListItem.Title style={{color:'red', fontWeight:'bold'}}>Google Fit Hesabını Kapat</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => connect()}>
            <ListItem topDivider bottomDivider>
              <Icon name='logo-google' type='ionicon' />
                <ListItem.Content>
                  <ListItem.Title>Google hesabı ile giriş yap</ListItem.Title>
                </ListItem.Content>
              <ListItem.Chevron size={25} color='black' />
            </ListItem>
          </TouchableOpacity>
        )
      }

      </View>

    </View>
  );
}
export default GoogleFitAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
});

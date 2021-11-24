/* @flow weak */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Icon, Avatar, Image, ListItem } from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import GoogleFit, { Scopes } from 'react-native-google-fit';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, selectPost } from "../redux/action";

const signOut = () => {
  auth()
  .signOut()
  .then(() => console.log('User signed out!'));
  GoogleFit.disconnect();
}

const Menu = (props) => {
  const userData = useSelector(state => state.userData);
  const dispatch = useDispatch();
  return(
    <View style={styles.container}>
      <View style={{flex:1,marginVertical:10}}>
        <TouchableOpacity onPress={() => props.navigation.navigate("Settings")}>
          <ListItem bottomDivider>
            <Icon name='settings' type='ionicon' />
              <ListItem.Content>
                <ListItem.Title>Profili Düzenle</ListItem.Title>
              </ListItem.Content>
            <ListItem.Chevron size={25} color='black' />
          </ListItem>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate("WeightChange")}>
          <ListItem bottomDivider>
            <Icon name='body' type='ionicon' />
              <ListItem.Content>
                <ListItem.Title>Aylık Kilo Değişimi Düzenle</ListItem.Title>
              </ListItem.Content>
            <ListItem.Chevron size={25} color='black' />
          </ListItem>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate("GoogleFitAccount")}>
          <ListItem bottomDivider>
            <Icon name='fitness' type='ionicon' />
              <ListItem.Content>
                <ListItem.Title>Google Fit Hesabı</ListItem.Title>
              </ListItem.Content>
            <ListItem.Chevron size={25} color='black' />
          </ListItem>
        </TouchableOpacity>
        {userData.instructor == true ? (
        <TouchableOpacity onPress={() => {
          dispatch(selectUser(userData));
          props.navigation.navigate("Ratings");
          }}>
          <ListItem bottomDivider>
            <Icon name='star' type='ionicon' />
              <ListItem.Content>
                <ListItem.Title>Oylamalar & Yorumlar</ListItem.Title>
              </ListItem.Content>
            <ListItem.Chevron size={25} color='black' />
          </ListItem>
        </TouchableOpacity> ) : (<></>)
        }
        <View style={{flex:1,flexDirection: 'column',justifyContent: 'flex-end',marginBottom: 10}}>
        <TouchableOpacity onPress={() => signOut()}>
          <ListItem topDivider bottomDivider>
            <ListItem.Content style={{alignItems:'center'}}>
              <ListItem.Title style={{color:'red', fontWeight:'bold'}}>Oturumu Kapat</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
export default Menu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

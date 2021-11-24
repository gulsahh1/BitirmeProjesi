import React,{useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Icon, Button, Input, Divider } from 'react-native-elements';
import auth, {firebase} from '@react-native-firebase/auth';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const ForgotPassword = (props) => {
  const[isLoading,setIsLoading] = useState(false);
  const[email, setEmail] = useState("");

  const resetHandle = () => {
    setIsLoading(true);
    if ( email.length == 0 ) {
      setIsLoading(false);
        Alert.alert('Hata!', 'Email boş olamaz.', [
            {text: 'Tamam'}
        ]);
        return;
    }

    auth().sendPasswordResetEmail(email)
    .then(function (user) {
      Alert.alert('Başarılı!', 'Mail adresinizi kontrol edin.', [
          {text: 'Tamam'}
      ]);
      setIsLoading(false);
      props.navigation.goBack();
    }).catch(function (e) {
      console.log(e);
      setIsLoading(false);
      return;
    })
}


  return(
    <View style={styles.container}>
    <ScrollView>
      <View style={{height: windowHeight/4, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize: 35, color:'white', fontWeight: 'bold'}}>Formumu Koruyorum</Text>
      </View>
      <View style={{height: windowHeight/2, paddingHorizontal: 10}}>
        <View style={{flex:1, backgroundColor: 'white',paddingHorizontal: 10, borderRadius: 10}}>
          <View style={{marginTop: 30}}>
            <Input
              placeholder='E-posta Adresi'
              keyboardType='email-address'
              onChangeText={setEmail}
              inputContainerStyle={{
                backgroundColor: '#eef0f2',
                borderRadius: 5,
                borderColor: '#a0a0a0',
                borderWidth: 1,
              }}
              inputStyle={{
                fontSize: 16
              }}
              leftIcon={
              <Icon
                name='mail'
                type='ionicon'
                style={{marginLeft: 10}}
                size={24}
                color='#a0a0a0'
              />
            }
            />
            <Button
              title="Gönder"
              onPress={() => resetHandle()}
              loading={isLoading}
              buttonStyle={{
                backgroundColor: '#009387',
              }}
              containerStyle={{
                marginTop: -10,
                marginHorizontal: 10,
              }}
            />
          </View>

          <View style={{flex:1,flexDirection: 'column',justifyContent: 'flex-end', marginBottom: 15, alignItems: 'center'}}>
          <View style={{height: 3, backgroundColor: '#009387', width: windowWidth, marginBottom: 15}}>
          </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={{textAlign: 'center', fontSize: 17, fontWeight: '100', color:'gray'}}>Hesabın yok mu?</Text>
              <TouchableOpacity activeOpacity={0.3} onPress={() => props.navigation.navigate("Signup")}>
                <Text style={{textAlign: 'center', fontSize: 17, fontWeight: 'bold', color:'#009387'}}> Kaydol</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <View style={{flex:1, marginTop: 20}}>
      </View>
      </ScrollView>
    </View>
  );
}
export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#009387'
  },
});

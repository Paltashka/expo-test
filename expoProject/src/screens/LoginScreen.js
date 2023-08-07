import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser'
import * as Facebook from 'expo-auth-session/providers/facebook'
import * as Google from 'expo-auth-session/providers/google'
import { fbClientId, iosClientId, webClientId, androidClientId } from '../../apiKeys';
import { storage } from '../utils/mmkv-storage';
import { useAuth } from '../utils/context';

WebBrowser.maybeCompleteAuthSession()

export default function Login({ navigation }) {
    const { authData, setAuthData } = useAuth();
    const [requestF, responseF, promptAsyncF] = Facebook.useAuthRequest({
        clientId: fbClientId
    })
    const [requestG, responseG, promptAsyncG] = Google.useAuthRequest({
        webClientId: webClientId,
        androidClientId: androidClientId,
        iosClientId: iosClientId,
    })

    async function getUserInfo(response, loginType) {
        if (response && response.type === 'success' && response?.authentication.accessToken) {
            (async () => {
                let userInfoResonse
                if (loginType === 'facebook') {
                    userInfoResonse = await fetch(`https://graph.facebook.com/me?access_token=${response.authentication.accessToken}&fields=id,email,name,picture.type(large)`)
                } else {
                    userInfoResonse = await fetch(`https://www.googleapis.com/userinfo/v2/me`, {
                        headers: { Authorization: `Bearer ${response.authentication.accessToken}` }
                    })
                }
                const userInfo = await userInfoResonse.json()
                storage.set('token', response.authentication.accessToken)
                storage.set('user', JSON.stringify(userInfo))
                setAuthData(response.authentication.accessToken)
                navigation.reset({ index: 0, routes: [{ name: 'Profile' }] })
            })()
        }
    }

    useEffect(() => {
        if (responseF && responseF.type === 'success') {
            getUserInfo(responseF, 'facebook')
        } else if (responseG && responseG.type === 'success') {
            getUserInfo(responseG, 'google')
        }
    }, [responseF, responseG])

    const handlePressAsync = async (loginType) => {
        let result
        if (loginType === 'facebook') {
            result = await promptAsyncF()
        } else {
            result = await promptAsyncG()
        }
        if (result.type !== 'success') {
            Alert.alert('Something went wrong')
            return
        }
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={() => handlePressAsync('facebook')}>
                <Text style={styles.text}> Sign In with Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handlePressAsync('google')}>
                <Text style={styles.text}>Sign In with Google</Text>
            </TouchableOpacity>
            <StatusBar style="auto" />
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: 200,
        height: 50,
        backgroundColor: '#6495ED',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    }
});
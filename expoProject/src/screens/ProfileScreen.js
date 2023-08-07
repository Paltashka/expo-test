import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useLayoutEffect, useState } from 'react';
import { storage } from '../utils/mmkv-storage';
import { useAuth } from '../utils/context';


export default function Profile() {
    const [user, setUser] = useState()
    const { authData, setAuthData } = useAuth();

    useLayoutEffect(() => {
        async function getData() {
            const userInfo = storage.getString('user');
            setUser(JSON.parse(userInfo))
        }
        getData()
    }, [])

    async function logOut() {
        storage.clearAll();
        setAuthData(null);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.userText}>Name: {user?.name}</Text>
            <Text style={styles.userText}>Email: {user?.email}</Text>

            <TouchableOpacity onPress={logOut} style={styles.button}>
                <Text style={styles.text}>Log Out</Text>
            </TouchableOpacity>
        </View>
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
    },
    userText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginTop: 10
    }
});
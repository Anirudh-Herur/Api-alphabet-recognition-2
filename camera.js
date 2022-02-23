import {
    StatusBar
} from 'expo-status-bar';
import {
    StyleSheet,
    Text,
    View,
    Button,
    Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default class App extends React.Component {
    constructor() {
        super()
        this.state = {
            image: null
        }
    }
    render() {
        return (<View style = { styles.container }><Button title = 'pick image' onPress = { this.pickImage }></Button></View>);
    }
    pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });
        console.log(result);
        if (!result.cancelled) {
            this.setState({
                image: result.data
            })
            this.uploadImage(result.uri)
        }
    }

    getPermissionAsync = async () => {
        if (Platform.OS === 'web') {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    }
    uploadImage = async (uri) => {
        const data = new FormData();
        let filename = uri.split('/')[uri.split('/').length - 1];
        let type = `image/${uri.split('.')[uri.split('.').length - 1]}`;
        const fileToUpload = {
            uri: uri,
            name: filename,
            type: type,
        };
        data.append('digit', fileToUpload);
        fetch('https://b3ce-2405-201-2003-6892-ddc4-af40-695b-39ec.ngrok.io/predict-data', {
            method: 'POST',
            body: data,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then((response) => response.json())
            .then((result) => {
                console.log(result)
            })
            .catch((error) => {
                console.error(error);
            });
        
        var response = await fetch(' https://b3ce-2405-201-2003-6892-ddc4-af40-695b-39ec.ngrok.io/predict-data', {
            method: 'POST',
            body: data,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        var resjson = await response.json()
        console.log(resjson)
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
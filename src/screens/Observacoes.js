import React, { Component } from 'react'
import {
   TouchableHighlight, Text, TextInput,
   StyleSheet, TouchableOpacity,
   KeyboardAvoidingView, ScrollView
} from 'react-native'
import { Icon } from 'react-native-elements'

export default class Observacoes extends Component {
   static navigationOptions = ({ navigation, navigationOptions }) => {
      return {
         title: 'Observações',
         headerStyle: {
            backgroundColor: navigationOptions.headerTintColor
         },
         headerTintColor: navigationOptions.headerStyle.backgroundColor,
         headerLeft: (
				<TouchableHighlight
					style={styles.back}
					underlayColor='#f1f1f1'
					onPress={() => navigation.goBack()}
				>
				  <Icon name='arrow-back' color='#00b38f' />
				</TouchableHighlight>
			 )
      }
   }

   state = {
      observacoes: ''
   }

   componentWillMount() {
      this.setState({ observacoes: this.props.navigation.getParam('text') })
   }

   render() {
      return (
         <KeyboardAvoidingView style={styles.container} behavior='padding'>
            <ScrollView>
               <TextInput
                  style={styles.input}
                  placeholder='Observações'
                  multiline
                  numberOfLines={4}
                  maxLength={512}
                  autoFocus
                  onChangeText={text => this.setState({ observacoes: text })}
                  value={this.state.observacoes}
               />

               <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                     this.props.navigation.navigate('AddJob', {
                        observacoes: this.state.observacoes
                     })
                  }}
               >
                  <Text style={styles.buttonText}>Concluir</Text>
               </TouchableOpacity>
            </ScrollView>
         </KeyboardAvoidingView>
      )
   }
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingTop: 10,
      paddingHorizontal: 15
   },
   input: {
      paddingVertical: 13,
      paddingHorizontal: 25,
      marginTop: 13,
      color: '#666',
      borderRadius: 30,
      borderWidth: 2,
      borderColor: '#e6e6e6',
      fontSize: 18
   },
   button: {
      width: '100%',
      padding: 13,
      marginVertical: 20,
      backgroundColor: '#00b38f',
      borderRadius: 5,
      alignSelf: 'center',
      alignItems: 'center'
   },
   buttonText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff'
   },
	back: {
		padding: 15,
		borderRadius: 50,
		marginLeft: 10
	}
})

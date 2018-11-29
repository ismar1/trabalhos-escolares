import React, { Component } from 'react'
import {
   View, Text, TextInput, StyleSheet,
   TouchableOpacity, AsyncStorage,
   Switch, Picker, Alert, DatePickerAndroid,
   TouchableHighlight, ScrollView
} from 'react-native'
import { Icon } from 'react-native-elements'

export default class AddJob extends Component {
   static navigationOptions = ({ navigation, navigationOptions }) => {
		return {
			title: 'Adicionar um trabalho',
				headerStyle: {
				backgroundColor: '#fff'
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
		materia: null,
		tema: null,
		data: 'Data da entrega',
		observacoes: '',
		chave: null,
		abnt: true,
		impresso: false,
		buttonText: 'Adicionar'
   }

   enviar = () => {
		if (this.state.materia && this.state.tema && this.state.data !== 'Data da entrega') {
			this.props.navigation.navigate('Home', {
			trabalho: {
				materia: this.state.materia,
				tema: this.state.tema,
				chave: this.state.chave,
				data: this.state.data,
				observacoes: this.state.observacoes,
				abnt: this.state.abnt,
				impresso: this.state.impresso
			}})
		} else
			Alert.alert(
				'Preencha os campos',
				'Os campos \'Matéria\', \'Tema\' e \'Data de entrega\' não podem ficar vazios'
			)
   }

   allKeys = async () => {
		const quantidadeKeys = (await AsyncStorage.getAllKeys()).length
		const lastKey = quantidadeKeys.toString()

		this.setState({ chave: lastKey })
   }

	componentWillReceiveProps(nextProps) {
		this.setState({ observacoes: nextProps.navigation.getParam('observacoes') })
	}

   componentWillMount() {
		const item = this.props.navigation.getParam('item')
				buttonText = this.props.navigation.getParam('buttonText')

		if (item && buttonText) {
			this.setState({
				...item,
				buttonText
			})
		} else {
			this.allKeys()
		}
   }

   abrirDate = async () => {   
		const { action, year, month, day } = await DatePickerAndroid.open()

		if (action === 'dateSetAction') {
			const dateString = [day, month + 1, year].join('/')

			this.setState({ data: dateString })
		}
   }

	exibeObservacoes = () => {
		const text = this.state.observacoes

		if (text !== 'Observações' && text) {
			const textArr = text.split(/\n/).join(' ').split('')
			let mais = ''

			console.log(textArr)
			console.log(textArr.slice(0, 25))

			if (textArr.length >= 21)
				mais = '...'

			return textArr.slice(0, 20).join('') + mais
		}

		return 'Observações'
	}

   render() {
		return (
			<ScrollView style={styles.container}>
				<View style={[styles.input, { paddingVertical: 3, paddingHorizontal: 15 }]}>
					<Picker
						onValueChange={itemValue => this.setState({ materia: itemValue })}
						selectedValue={this.state.materia}
						mode='dropdown'
					>
						<Picker.Item label='-- Matéria --' />
						<Picker.Item label='Matemática' value='Matemática' />
						<Picker.Item label='Inglês' value='Inglês' />
						<Picker.Item label='Geografia' value='Geografia' />
						<Picker.Item label='História' value='História' />
						<Picker.Item label='Português' value='Português' />
						<Picker.Item label='Sociologia' value='Sociologia' />
						<Picker.Item label='Filosofia' value='Filosofia' />
						<Picker.Item label='Artes' value='Artes' />
						<Picker.Item label='Química' value='Química' />
						<Picker.Item label='Biologia' value='Biologia' />
						<Picker.Item label='Física' value='Física' />
						<Picker.Item label='Educação Física' value='Educação Física' />
						<Picker.Item label='Técnicas de redação' value='Técnicas de redação' />
						<Picker.Item label='Educação Artística' value='Educação Artística' />
					</Picker>
				</View>

				<TextInput
					style={styles.input}
					placeholder='Tema'
					onChangeText={text => this.setState({ tema: text })}
					value={this.state.tema}
				/>

				<TouchableHighlight
					underlayColor='#f1f1f1'
					style={[styles.inputContainer, { width: '70%' }]}
					onPress={() => this.abrirDate(true)}
				>
					<Text style={[styles.inputText, { textAlign: 'center' }]}>{this.state.data}</Text>
				</TouchableHighlight>

				<TouchableHighlight
					underlayColor='#f1f1f1'
					style={styles.inputContainer}
					onPress={() => {
						if (this.state.observacoes == 'Observações') {
							this.props.navigation.navigate('Observacoes')
						} else {
							this.props.navigation.navigate('Observacoes', { text: this.state.observacoes })
						}
					}}
				>
					<Text style={styles.inputText}>{this.exibeObservacoes()}</Text>
				</TouchableHighlight>

				<View style={{ marginVertical: 15 }}>
					<View style={styles.switchs}>
					<Text style={styles.text}>Normas ABNT</Text>
					<Switch
						onValueChange={() => this.setState({ abnt: !this.state.abnt })}
						value={this.state.abnt}
					/>
					</View>

					<View style={styles.switchs}>
					<Text style={styles.text}>Pode ser impresso</Text>
					<Switch
						onValueChange={() => this.setState({ impresso: !this.state.impresso })}
						value={this.state.impresso}
					/>
					</View>
				</View>

				<TouchableOpacity
					style={styles.button}
					onPress={this.enviar}
				>
					<Text style={styles.buttonText}>{this.state.buttonText}</Text>
				</TouchableOpacity>
			</ScrollView>
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
	inputContainer: {
		paddingVertical: 13,
		paddingHorizontal: 25,
		marginTop: 13,
		borderRadius: 30,
		borderWidth: 2,
		borderColor: '#e6e6e6'
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
	inputText: {
		color: '#666',
		fontSize: 18
	},
   button: {
		width: '100%',
		padding: 13,
		marginVertical: 15,
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
   switchs: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		marginTop: 15
   },
   text: {
		color: '#555',
		fontSize: 17,
		marginRight: 8
	},
	back: {
		padding: 15,
		borderRadius: 50,
		marginLeft: 10
	}
})

import React, { Component } from 'react'
import {
	View, Text, FlatList, StyleSheet,
	TouchableOpacity, TouchableHighlight, Alert,
	AsyncStorage, Vibration
} from 'react-native'
import { Icon } from 'react-native-elements'

// TouchableNativeFeedback

export default class Home extends Component {
	static navigationOptions = ({ navigation }) => {
		return {
			title: 'Trabalhos',
			headerRight: (
				<TouchableHighlight
					underlayColor='#00997a'
					style={styles.apagarTodos}
					onPress={async () => {
						if ((await AsyncStorage.getAllKeys()).length >= 1) {
							Alert.alert(
								'Apagar todos os trabalhos',
								'Tem certeza que deseja apagar todos os trabalhos?',
								[
									{ text: 'Sim', onPress: navigation.getParam('refresh') },
									{ text: 'Não', onPress: () => false }
								])
						} else
							Alert.alert('Apagar todos os trabalhos', 'Você não tem trabalhos pra apagar')
					}}
				>
					<Icon name='clear-all' color='#fff' size={35} />
				</TouchableHighlight>
			)
		}
	}

	state = {
		dados: null
	}

	renderRow = item => {
		const abnt = () => {
			if (item.abnt) {
				return (
					<Text style={styles.requisito}>Nas normas ABNT</Text>
				)
			}
		}

		const impresso = () => {
			if (item.impresso) {
				return (
					<Text style={styles.requisito}>Impresso e/ou manuscrito</Text>
				)
			} else {
				return (
					<Text style={styles.requisito}>Manuscrito</Text>
				)
			}
		}

		const observacoes = () => {
			if (item.observacoes)
				return (
					<Text style={styles.observacoes}>Toque pra ver as observações</Text>
				)
		}

		return (
			<TouchableHighlight
				underlayColor='#f1f1f1'
				onPress={() => {
					if (item.observacoes)
						Alert.alert(`${item.materia}: ${item.tema}`, item.observacoes)
				}}
				onLongPress={() => {
					Vibration.vibrate(50)
					Alert.alert('', item.tema, [
						{ text: 'Editar', onPress: () => {
							this.props.navigation.navigate('AddJob', {
								item: item,
								buttonText: 'Editar'
							})
						} },
						{ color: 'red', text: 'Apagar', onPress: async () => {
							if ((await AsyncStorage.getAllKeys()).length === 1)
								this.refresh()
							else {
								AsyncStorage.removeItem(item.chave)
								this.componentWillMount()
							}
						}}
					])
			}}>
				<View style={styles.itemContainer}>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
						<Text style={[styles.itemCabecalho, { maxWidth: '60%' }]}>{item.materia}</Text>
						<Text style={[styles.itemCabecalho, { maxWidth: '40%' }]}>{item.data}</Text>
					</View>

					<Text style={styles.tema}>{item.tema}</Text>
					{abnt()}
					{impresso()}
					{observacoes()}
				</View>
			</TouchableHighlight>
		)
	}

	salvar = async (key, dados) => {
		AsyncStorage.mergeItem(key, JSON.stringify(dados))
		console.log('Dados salvos')
	}

	recuperar = async () => {
		let lista = []

		AsyncStorage.getAllKeys((_, keys) => {
			keys.forEach(async key => {
				await AsyncStorage.getItem(key)
					.then(value => lista.push(JSON.parse(value)))

					this.setState({ dados: lista })
			})
		})
	}

	// Acionado quando o componente recebe novas props (nesse caso, de AddJob)
	// Insere os novos dados e atualiza o FlatList
	componentWillReceiveProps(nextProps) {
		if (nextProps.navigation.getParam('trabalho')) {
			const trabalho = nextProps.navigation.getParam('trabalho') 

			this.salvar(trabalho.chave, trabalho)
			this.recuperar()
		}
	}

	// Acionado antes do componente ser montado
	// Recupera os dados locais
	componentWillMount() {
		this.recuperar()
	}

	componentDidMount() {
		this.props.navigation.setParams({ refresh: this.refresh })
	}

	refresh = async () => {
		AsyncStorage.clear()

		this.setState({ dados: null })
	}

	renderList = () => {
		if (this.state.dados) {
			return (
				<FlatList
					data={this.state.dados}
					renderItem={({item}) => this.renderRow(item)}
					keyExtractor={item => item.chave}
				/>
			)
		}

		return (
			<View style={{ paddingTop: 50, alignItems: 'center', marginHorizontal: 20 }}>
				<View style={{ flexDirection: 'row' }}>
					<Text style={styles.semTrabalhos}>Você não tem trabalhos </Text>
					<Icon name='insert-emoticon' color='#e6b800' />
				</View>

				<View style={{ flexDirection: 'row', marginVertical: 15 }}>
					<Text style={styles.semTrabalhos}>Toque em </Text>
					<Icon name='add-circle' color='#00b38f' />
					<Text style={styles.semTrabalhos}> para adicionar</Text>
				</View>

				<Text style={[styles.semTrabalhos, { textAlign: 'center' }]}>Mantenha pressionado em um trabalho para editar/apagar</Text>
			</View>
		)
	}

	render() {
		return (
			<View style={styles.container}>
				{this.renderList()}

				<TouchableOpacity
				style={styles.addTrabalho}
					onPress={() => this.props.navigation.navigate('AddJob')}
				>
					<Icon name='add-circle' color='#00b38f' size={75} />
				</TouchableOpacity>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	itemContainer: {
		padding: 20,
		borderBottomWidth: 2,
		borderBottomColor: '#e6e6e6'
	},
	itemText: {
		fontSize: 18
	},
	addTrabalho: {
		position: 'absolute',
		bottom: 30,
		right: 30
	},
	itemCabecalho: {
		fontSize: 16,
		color: '#777',
		fontWeight: 'bold'
	},
	tema: {
		fontSize: 18,
		fontWeight: 'bold',
		marginVertical: 25,
		textAlign: 'center',
		color: '#222'
	},
	requisito: {
		color: '#777',
		fontWeight: '100'
	},
	observacoes: {
		color: '#aaa',
		fontSize: 12,
		fontWeight: '100',
		fontStyle: 'italic',
		textAlign: 'center',
		marginTop: 25
	},
	semTrabalhos: {
		marginBottom: 5,
		alignSelf: 'center',
		color: '#aaa',
		fontSize: 19,
		fontWeight: '100'
	},
	apagarTodos: {
		padding: 7,
		borderRadius: 50,
		marginRight: 10
	}
})

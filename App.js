import { createStackNavigator } from 'react-navigation'

import Home from './src/screens/Home'
import AddJob from './src/screens/AddJob'
import Observacoes from './src/screens/Observacoes'

export default App = createStackNavigator(
  {
    Home: {
      screen: Home
    },
    AddJob: {
      screen: AddJob
    },
    Observacoes: {
      screen: Observacoes
    }
  },
  {
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#00b38f'
      },
      headerTintColor: '#fff'
    }
  }
)

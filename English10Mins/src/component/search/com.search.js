import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native'

import Styles from '../../assets/styles/search'

function Search() {

  return (
    <View>
      <View style={Styles.heaerMainSectin}>
        <View style={Styles.headerBackSection}>
          <TouchableOpacity>
            <Text>back</Text>
          </TouchableOpacity>
        </View>
        <View>

        </View>
        <View>

        </View>
      </View>
      <View style={Styles.searchBody}>

      </View>
      <Text>search</Text>
    </View>
  )
}

Search.navigationOptions = ({ navigation }) => ({
  headerShown: false
});

export default Search;
import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import colors from '../../constants/colors.json'
import { useNavigation } from '@react-navigation/native'

export default function Header({ title, goBack }) {
  const navigation = useNavigation()

  if (goBack) {
    return (
      <View
        style={styles.container}
      >
        <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={() => navigation.goBack()}>
          <FontAwesome5 name="chevron-left" size={20} color={colors["text"]} />
          <Text style={{ ...styles.title, marginLeft: 15, marginTop: -5 }}>{title}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <>
      <View
        style={{ ...styles.container, justifyContent: "space-between" }}
      >
        {/* <Text style={styles.title}>{title}</Text> */}
        <Image style={styles.logo} source={require('../../../assets/logo.png')}
        />
        <TouchableOpacity style={styles.button}>
          <FontAwesome5 name="ellipsis-v" size={20} color={colors["text"]} />
        </TouchableOpacity>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors["header"],
    width: "100%",
    height: "12%",
    minHeight: 80,
    maxHeight: 120,
    padding: 15,
    paddingBottom: 18,
    alignItems: "flex-end",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8,
    elevation: 2,
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
  },
  button: {
    flexDirection: "row",
    padding: 10,
    marginBottom: -10
  },
  title: {
    color: colors["text"],
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center"
  },
  logo: {
    height: 84,
    width: 138.6,
    marginBottom: -30
  }
})
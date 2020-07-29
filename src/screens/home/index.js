import React, { useState, useEffect } from 'react'
import { View, ActivityIndicator, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import { Header } from '../../components'
import { LinearGradient } from 'expo-linear-gradient'
import { FontAwesome5 } from '@expo/vector-icons'
import MapView, { Marker } from 'react-native-maps'
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location'
import colors from '../../constants/colors.json'

export default function Home() {
  const [currentRegion, setCurrentRegion] = useState(null)
  const [customRegion, setCustomRegion] = useState("")

  useEffect(() => {
    async function loadInitialPosition() {
      const { granted } = await requestPermissionsAsync()

      if (granted) {
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true
        })

        const { latitude, longitude } = coords

        setCurrentRegion({
          latitude,
          longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04
        })
      }
    }

    loadInitialPosition()
  }, [])

  const handleChange = (region) => setCustomRegion(region)

  const renderMap = () => {
    if (!currentRegion) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors["bg-dark"]} />
        </View>
      )
    }

    return (
      <MapView initialRegion={currentRegion} style={styles.mapContainer}>
        <Marker coordinate={{ latitude: currentRegion.latitude, longitude: currentRegion.longitude }} />
      </MapView>
    )
  }

  return (
    <>
      <Header title="Home" />

      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <View style={styles.inputContainer}>
            <FontAwesome5 style={styles.inputIcon} name="search" size={16} color={colors["text"]} />
            <TextInput
              style={styles.textField}
              onChangeText={text => handleChange(text)}
              placeholder="Search a custom region..."
              value={customRegion}
            />
          </View>
          <TouchableOpacity>
            <LinearGradient style={styles.buttonContainer} colors={colors.gradient}>
              <FontAwesome5 name="paper-plane" solid size={18} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
        {renderMap()}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  mapContainer: {
    flex: 1
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    top: 20,
    zIndex: 2
  },
  inputContainer: {
    flexDirection: "row",
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginHorizontal: 15,
    shadowOpacity: 0.5,
    shadowRadius: 3,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    elevation: 2
  },
  inputIcon: {
    alignSelf: "center"
  },
  textField: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  buttonContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center"
  }
})
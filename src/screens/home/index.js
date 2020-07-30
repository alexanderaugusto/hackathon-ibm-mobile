import React, { useState, useEffect } from 'react'
import { View, ActivityIndicator, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import { Header, Loading } from '../../components'
import { LinearGradient } from 'expo-linear-gradient'
import { FontAwesome5 } from '@expo/vector-icons'
import MapView, { Marker,Polygon } from 'react-native-maps'
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location'
import colors from '../../constants/colors.json'

export default function Home() {
  const [currentRegion, setCurrentRegion] = useState(null)
  const [polygonCoordinates, setPolygonCoordinates] = useState(null)
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

        setPolygonCoordinates(
          coordinates = [
              { latitude: -21.7608, longitude: -45.9975 },
              { latitude: -21.7782, longitude: -45.9816 },
              { latitude: -21.7762, longitude: -45.9565 },
              { latitude: -21.7610, longitude: -45.9542 }
          ]
        )
      }
    }

    loadInitialPosition()
  }, [])

  const handleChange = (region) => setCustomRegion(region)

  const renderMap = () => {
    if (!currentRegion) {
      return (
        <Loading isLoading={true} />
      )
    }

    return (
      <MapView initialRegion={currentRegion} style={styles.mapContainer}>
        <Polygon coordinates={polygonCoordinates} strokeColor={'rgba(255, 0, 0,0.9)'} fillColor={'rgba(255, 0, 0,0.4)'}/>
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
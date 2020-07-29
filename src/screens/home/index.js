import React, { useState, useEffect } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { Header } from '../../components'
import MapView, { Marker, Polygon } from 'react-native-maps'
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location'
import colors from '../../constants/colors.json'

export default function Home() {
  const [currentRegion, setCurrentRegion] = useState(null)
  const [polygonCoordinates, setPolygonCoordinates] = useState(null)

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

  console.log(polygonCoordinates)

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
        <Polygon coordinates={polygonCoordinates} strokeColor={'rgba(255, 0, 0,0.9)'} fillColor={'rgba(255, 0, 0,0.4)'}/>
        <Marker coordinate={{ latitude: currentRegion.latitude, longitude: currentRegion.longitude }} />
      </MapView>
    )
  }

  return (
    <>
      <Header title="Home" />

      <View style={styles.container}>
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
  }
})
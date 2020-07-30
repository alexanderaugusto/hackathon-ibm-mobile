import React, { useState, useEffect, useRef } from 'react'
import { Alert, View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import { Header, Loading } from '../../components'
import { LinearGradient } from 'expo-linear-gradient'
import { FontAwesome5 } from '@expo/vector-icons'
import MapView, { Marker, Polygon } from 'react-native-maps'
import {
  requestPermissionsAsync,
  getCurrentPositionAsync,
  geocodeAsync,
  reverseGeocodeAsync
} from 'expo-location'
import colors from '../../constants/colors.json'

const latitudeDelta =  0.04
const longitudeDelta = 0.04

export default function Home() {
  const [initialRegion, setInitialRegion] = useState({
    latitudeDelta,
    longitudeDelta
  })
  const [currentRegion, setCurrentRegion] = useState({
    latitudeDelta,
    longitudeDelta
  })
  const [polygonCoordinates, setPolygonCoordinates] = useState(null)
  const [customRegion, setCustomRegion] = useState("")
  const [loading, setLoading] = useState(false)
  const inputRef = useRef()

  useEffect(() => {
    async function loadInitialPosition() {
      setLoading(true)

      const { granted } = await requestPermissionsAsync()

      if (granted) {
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true
        })

        if(coords){
          const { latitude, longitude } = coords

          setInitialRegion({
            ...initialRegion,
            latitude,
            longitude
          })

          setPolygonCoordinates(
            coordinates = [
              { latitude: -21.7608, longitude: -45.9975 },
              { latitude: -21.7782, longitude: -45.9816 },
              { latitude: -21.7762, longitude: -45.9565 },
              { latitude: -21.7610, longitude: -45.9542 }
            ]
          )

          const region = await reverseGeocodeAsync({ latitude, longitude })

          if (region.length) {
            let { city, region: uf, street } = region[0]
            city = city ? (city + ", ") : ""
            uf = uf || ""
            street = street ? (street + ", ") : ""

            setCustomRegion(street + city + uf)
          }
        }
      }else{
        Alert.alert(
          'Sorry for this error',
          'You did not grant access to your location, so we will not be able to show results for your location.',
          [
            { text: 'OK', onPress: () => console.log('OK Pressed') }
          ],
          { cancelable: false }
        )
      }

      setLoading(false)
    }

    loadInitialPosition()
  }, [])

  const handleChange = (region) => setCustomRegion(region)

  const changeRegion = async () => {
    if(inputRef.current && inputRef.current.isFocused()){
      inputRef.current.blur()
    }

    setLoading(true)

    const region = await geocodeAsync(customRegion)

    if (region.length) {
      const { latitude, longitude } = region[0]
      setCurrentRegion({ ...currentRegion, latitude, longitude })
    }else{
      Alert.alert(
        'Sorry for this error',
        "We couldn't find a region with these characteristics, try to be more precise.",
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') }
        ],
        { cancelable: false }
      )
    }

    setLoading(false)
  }

  const renderMap = () => {
    if (!initialRegion.latitude || !initialRegion.longitude) {
      if(loading){
        return null
      }
      
      return (
        <Text>We can't connect to this location.</Text>
      )
    }

    return (
      <MapView initialRegion={initialRegion} region={currentRegion} style={styles.mapContainer}>
        {/* <Polygon coordinates={polygonCoordinates} strokeColor={'rgba(255, 0, 0,0.9)'} fillColor={'rgba(255, 0, 0,0.4)'} /> */}
        <Marker coordinate={{ latitude: initialRegion.latitude, longitude: initialRegion.longitude }} />
      </MapView>
    )
  }

  return (
    <>
      <Header title="Home" />

      <Loading isLoading={loading} />

      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <View style={styles.inputContainer}>
            <FontAwesome5 style={styles.inputIcon} 
              name="search" 
              size={16} 
              color={colors["text"]}
              onPress={() => changeRegion()} 
            />
            <TextInput
              ref={inputRef}
              style={styles.textField}
              onChangeText={text => handleChange(text)}
              placeholder="Search a custom region..."
              value={customRegion}
            />
            {customRegion.length > 0  && inputRef.current && inputRef.current.isFocused() && (
              <FontAwesome5 style={styles.inputIcon} 
              name="times" 
              size={16} 
              color={colors["text"]}
              onPress={() => setCustomRegion("")} 
            />
            )}    
          </View>
          <TouchableOpacity onPress={() => changeRegion()}>
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
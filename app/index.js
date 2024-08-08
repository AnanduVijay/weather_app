import {
  View,
  Text,
  Button,
  StatusBar,
  Image,
  SafeAreaView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  CalendarDaysIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/outline";
import { debounce } from "lodash";
import * as Progress from 'react-native-progress';
import { weatherImages } from "../assets/assets";
import { MapPinIcon } from "react-native-heroicons/solid";
import { fetchLocation, fetchweatherForecast } from "../api/weather";

export default function HomeSCreen() {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);
  const handleLocation = (loc) => {
    setLocations([]);
    toggleSearch(false);
    setLoading(true);
    fetchweatherForecast({
      cityName: loc.name,
      days: 7,
    }).then((data) => {
      setWeather(data);
      setLoading(false);
      console.log("data got#################################################", data);
    });
  };
  const handleSearch = (value) => {
    if (value.length > 2) {
      fetchLocation({ cityName: value }).then((data) => {
        setLocations(data);
      });
    }
  };
  useEffect(()=>{
    fetchmyweatherData();
  },[])
  const fetchmyweatherData=async () => {
      fetchweatherForecast({
        cityName:'Kozhikode',
        days:7
      }).then((data)=>{
        setWeather(data);
        setLoading(false);
      })
  }
  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);
  const { current, location } = weather;
  return (
    <View className="flex-1 relative">
      <StatusBar className="black" />
      <Image
        blurRadius={70}
        source={require("../assets/images/bg.png")}
        className="absolute h-full w-full"
      />
      {
        loading? (
              <View className='flex-1 flex-row justify-center items-center '>
                <Progress.CircleSnail thickness={10} size={140} color='#0bb3b2'/>
              </View>
        ):(
              <SafeAreaView className="flex flex-1">
              <View
                style={[
                  styles.searchContainer,
                  !showSearch && styles.hideSeachContainer,
                ]}
              >
                {showSearch ? (
                  <TextInput
                    onChangeText={handleTextDebounce}
                    style={styles.input}
                    placeholder="search city"
                    placeholderTextColor="lightgray"
                  />
                ) : null}
      
                <TouchableOpacity
                  onPress={() => toggleSearch(!showSearch)}
                  style={styles.searchIcon}
                  className="rounded-full"
                >
                  <MagnifyingGlassIcon size="25" color="white" />
                </TouchableOpacity>
              </View>
              <View>
                {locations.length > 0 && showSearch ? (
                  <View style={styles.locations}>
                    {locations.map((loc, index) => {
                      return (
                        <TouchableOpacity
                          onPress={() => handleLocation(loc)}
                          key={index}
                          style={styles.locationsContainer}
                        >
                          <MapPinIcon size="26" color="gray" />
                          <Text style={styles.locationsText}>
                            {loc?.name}, {loc?.country}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : null}
              </View>
              <View style={styles.forcastSection}>
                <Text style={styles.forcastCity}>
                  {location?.name},
                  <Text style={styles.forcastState}>{location?.country}</Text>
                </Text>
                <View style={styles.weatherImageConatiner}>
                  <Image
                    source={weatherImages[current?.condition?.text]}
                    style={styles.weatherImage}
                  />
                </View>
                <View className="space-y-2">
                  <Text className="text-center fond-bold text-white text-6xl ml-5">
                    {current?.temp_c}&#176;
                  </Text>
                  <Text className="text-center text-white text-xl tracking-widest">
                    {current?.condition?.text}
                  </Text>
                </View>
                <View className="flex-row justify-between mx-4">
                  <View className="flex-row space-x-2 item-center">
                    <Image
                      source={require("../assets/icons/wind.png")}
                      className="h-6 w-6"
                    />
                    <Text className="text-white font-semibold text-base">
                      {current?.wind_kph}km
                    </Text>
                  </View>
                  <View className="flex-row space-x-2 item-center">
                    <Image
                      source={require("../assets/icons/drop.png")}
                      className="h-6 w-6"
                    />
                    <Text className="text-white font-semibold text-base">
                      {current?.humidity}%
                    </Text>
                  </View>
                  <View className="flex-row space-x-2 item-center">
                    <Image
                      source={require("../assets/icons/sun.png")}
                      className="h-6 w-6"
                    />
                    <Text className="text-white font-semibold text-base">
                      8:00 AM
                    </Text>
                  </View>
                </View>
              </View>
              <View className="mb-2 space-y-3">
                <View className="flex-row items-center mx-5 space-x-2">
                  <CalendarDaysIcon size="22" color="white" />
                  <Text className="text-white text-base">Daily Forecast</Text>
                </View>
                <ScrollView
                  horizontal
                  contentContainerStyle={{ paddingHorizontal: 15 }}
                  showsHorizontalScrollIndicator={false}
                >
                  {weather?.forecast?.forecastday?.map((item, index) => {
                    let date = new Date(item.date);
                    let options = {weekda:'lomg'};
                    let dayName = date.toLocaleDateString('en-US', options);
                    dayName = dayName.split(',')[0]
                    return (
                      <View
                        key={index}
                        className="flex justify-center item-center w-24 rounded-3xl py-3 space-y-1 mr-4  "
                        style={{ backgroundColor: "rgba(255, 255,255, 0.15)" }}
                      >
                        <Image
                          source={weatherImages[item?.condition?.text]}
                          className="h-11 w-11"
                        />
                        <Text className="text-white">{dayName}</Text>
                        <Text className="text-white text-xl fond-semibold">
                          {item?.day?.avgtemp_c}&#176;
                        </Text>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            </SafeAreaView>
        ) 
      }
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255,255, 0.2)",
    height: "7%",
    margin: 10,
    borderRadius: 50,
    paddingLeft: 18,
  },
  hideSeachContainer: {
    backgroundColor: "transparent",
  },
  input: {
    flex: 1,
    height: 40,
    color: "#fff",
  },
  searchIcon: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    padding: 13,
    right: 2,
    position: "absolute",
  },
  locations: {
    position: "absolute",
    width: "94%",
    backgroundColor: "#fff",
    borderRadius: 9,
    marginLeft: 12,
    top: 15,
  },
  locationsContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.2,
    borderBottomColor: "#2e2e2e",
    padding: 3,
  },
  locationsText: {
    color: "black",
    fontWeight: "bold",
    marginLeft: 4,
  },
  forcastSection: {
    flex: 1,
    justifyContent: "space-around",
  },
  forcastCity: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 30,
  },
  forcastState: {
    color: "gray",
  },
  weatherImageConatiner: {
    flexDirection: "row",
    justifyContent: "center",
  },
  weatherImage: {
    width: 90,
    height: 90,
  },
});

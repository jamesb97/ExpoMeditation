import React, { useState } from "react";
import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { Audio } from "expo-av";

const MeditationApp: React.FC = () => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(300); // The default 5 min timer
  const [isRunning, setIsRunning] = useState<boolean>(false);
  let timerInterval: NodeJS.Timeout | null = null;

  async function playSound(type: "rain" | "ocean"): Promise<void> {
    if (sound) {
      await sound.unloadAsync();
    }
    const { sound: newSound } = await Audio.Sound.createAsync(
      type === "rain"
        ? require("../assets/rain.mp3")
        : require("../assets/ocean.mp3"),
      { shouldPlay: true, isLooping: true }
    );
    setSound(newSound);
  }

  async function stopSound(): Promise<void> {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
  }

  function startTimer(): void {
    setIsRunning(true);
    timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval!);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function stopTimer(): void {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    setIsRunning(false);
    setTimeLeft(300); // Reset back the timer
    stopSound();
  }

  return (
    <ImageBackground
      source={require("../assets/images/waves.jpg")}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 32, color: "white" }}>
          {Math.floor(timeLeft / 60)}:{("0" + (timeLeft % 60)).slice(-2)}
        </Text>
        <TouchableOpacity
          onPress={startTimer}
          style={{
            padding: 10,
            backgroundColor: "blue",
            margin: 10,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: "white" }}>Start Session</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={stopTimer}
          style={{
            padding: 10,
            backgroundColor: "blue",
            margin: 10,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: "white" }}>Stop Session</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => playSound("rain")}
          style={{
            padding: 10,
            backgroundColor: "gray",
            margin: 10,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: "white" }}>Play Rain</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => playSound("ocean")}
          style={{
            padding: 10,
            backgroundColor: "gray",
            margin: 10,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: "white" }}>Play Ocean</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default MeditationApp;

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Audio } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';

export default function VoiceRecorder() {
  const [recording, setRecording] = React.useState(undefined);
  const [recordings, setRecordings] = React.useState([]);
  const [recordingDuration, setRecordingDuration] = React.useState(0);
  const [sound, setSound] = React.useState(null);
  const [isPlaying, setIsPlaying] = React.useState({});
  const [searchText, setSearchText] = useState('');
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [editingName, setEditingName] = useState(null);
  const [newName, setNewName] = useState('');
  const intervalRef = React.useRef(null);

  // High-quality MP3 recording options
  const RECORDING_OPTIONS = {
    android: {
      extension: '.mp3',
      outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
      audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
      sampleRate: 48000,
      numberOfChannels: 2,
      bitRate: 320000,
    },
    ios: {
      extension: '.mp3',
      audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
      sampleRate: 48000,
      numberOfChannels: 2,
      bitRate: 320000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
  };

  // Filter recordings based on search text
  const filteredRecordings = recordings.filter(recording => 
    recording.filename.toLowerCase().includes(searchText.toLowerCase())
  );

  const speedOptions = [0.5, 1.0, 1.5, 2.0];

  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  React.useEffect(() => {
    loadSavedRecordings();
  }, []);

  async function loadSavedRecordings() {
    try {
      const recordingsDir = `${FileSystem.documentDirectory}recordings/`;
      const dirInfo = await FileSystem.getInfoAsync(recordingsDir);
      
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(recordingsDir, { intermediates: true });
      } else {
        const files = await FileSystem.readDirectoryAsync(recordingsDir);
        const recordingFiles = files.filter(file => file.endsWith('.mp3'));
        
        const loadedRecordings = await Promise.all(
          recordingFiles.map(async (filename) => {
            const uri = `${recordingsDir}${filename}`;
            const info = await FileSystem.getInfoAsync(uri);
            return {
              uri,
              filename,
              timestamp: info.modificationTime * 1000, 
              duration: 0 
            };
          })
        );
        
        setRecordings(loadedRecordings);
      }
    } catch (error) {
      console.error('Failed to load recordings:', error);
      Alert.alert('Error', 'Failed to load saved recordings');
    }
  }

  // Function to rename recording
  async function renameRecording(index, oldUri) {
    if (!newName) {
      Alert.alert('Error', 'Please enter a valid name');
      return;
    }

    try {
      const recordingsDir = `${FileSystem.documentDirectory}recordings/`;
      const newFileName = `${newName}.mp3`;
      const newUri = `${recordingsDir}${newFileName}`;

      // Check if file with new name already exists
      const fileInfo = await FileSystem.getInfoAsync(newUri);
      if (fileInfo.exists) {
        Alert.alert('Error', 'A recording with this name already exists');
        return;
      }

      // Move file to new location with new name
      await FileSystem.moveAsync({
        from: oldUri,
        to: newUri
      });

      // Update recordings array
      setRecordings(prev => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          uri: newUri,
          filename: newFileName
        };
        return updated;
      });

      setEditingName(null);
      setNewName('');
    } catch (error) {
      console.error('Error renaming file:', error);
      Alert.alert('Error', 'Failed to rename recording');
    }
  }

  function startTimer() {
    intervalRef.current = setInterval(() => {
      setRecordingDuration((prev) => prev + 1);
    }, 1000);
  }

  function stopTimer() {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  async function startRecording() {
    try {
      console.log('Requesting permission...');
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Permission to access microphone is required!');
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recordingsDir = `${FileSystem.documentDirectory}recordings/`;
      const dirInfo = await FileSystem.getInfoAsync(recordingsDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(recordingsDir, { intermediates: true });
      }

      console.log('Starting recording...');
      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(RECORDING_OPTIONS);
      await newRecording.startAsync();
      setRecording(newRecording);
      startTimer();
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Failed to start recording');
    }
  }

  async function stopRecording() {
    if (!recording) return;
    
    try {
      console.log('Stopping recording...');
      stopTimer();
      setRecording(undefined);
      await recording.stopAndUnloadAsync();
      
      const uri = recording.getURI();
      const timestamp = new Date().getTime();
      const filename = `recording_${timestamp}.mp3`;
      const newUri = `${FileSystem.documentDirectory}recordings/${filename}`;
      
      await FileSystem.moveAsync({
        from: uri,
        to: newUri
      });
      
      const newRecording = {
        uri: newUri,
        filename,
        timestamp,
        duration: recordingDuration
      };
      
      setRecordings(prev => [...prev, newRecording]);
      setRecordingDuration(0);
      
      console.log('Recording saved:', newUri);
    } catch (error) {
      console.error('Failed to stop recording:', error);
      Alert.alert('Error', 'Failed to save recording');
    }
  }

  async function changePlaybackSpeed(speed) {
    if (sound) {
      try {
        await sound.setRateAsync(speed, true);
        setPlaybackSpeed(speed);
      } catch (error) {
        console.error('Error changing playback speed:', error);
      }
    }
  }

  async function playSound(uri) {
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true, rate: playbackSpeed }
      );
      setSound(newSound);
      setIsPlaying({ ...isPlaying, [uri]: true });
      
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying({ ...isPlaying, [uri]: false });
        }
      });
      
      await newSound.playAsync();
    } catch (error) {
      console.error('Error playing sound:', error);
      Alert.alert('Error', 'Failed to play recording');
    }
  }

  async function pauseSound(uri) {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying({ ...isPlaying, [uri]: false });
    }
  }

  async function deleteRecording(index, uri) {
    Alert.alert(
      'Delete Recording',
      'Are you sure you want to delete this recording?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await FileSystem.deleteAsync(uri);
              setRecordings(prev => prev.filter((_, i) => i !== index));
            } catch (error) {
              console.error('Error deleting recording:', error);
              Alert.alert('Error', 'Failed to delete recording');
            }
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>QK Voice Recorder</Text>

      

      <TextInput
        style={styles.searchbar}
        placeholder="Search..." 
        placeholderTextColor="#A9A9A9"
        value={searchText}
        onChangeText={setSearchText}
      />

      <ScrollView style={styles.records}>
        {filteredRecordings.map(({ uri, timestamp, duration, filename }, index) => (
          <View key={index} style={styles.recordingItem}>
            <View style={styles.recordingInfo}>
              {editingName === index ? (
                <View style={styles.renameContainer}>
                  <TextInput
                    style={styles.renameInput}
                    value={newName}
                    onChangeText={setNewName}
                    placeholder="Enter new name"
                    placeholderTextColor="#A9A9A9"
                  />
                  <TouchableOpacity
                    style={styles.renameButton}
                    onPress={() => renameRecording(index, uri)}
                  >
                    <FontAwesome name="check" size={20} color="#4CAF50" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.renameButton}
                    onPress={() => {
                      setEditingName(null);
                      setNewName('');
                    }}
                  >
                    <FontAwesome name="times" size={20} color="#FF4444" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.titleContainer}>
                  <Text style={styles.recordingTitle}>{filename}</Text>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => {
                      setEditingName(index);
                      setNewName(filename.replace('.mp3', ''));
                    }}
                  >
                    <FontAwesome name="edit" size={20} color="#FFF" />
                  </TouchableOpacity>
                </View>
              )}
              <Text style={styles.recordingTimestamp}>
                {new Date(timestamp).toLocaleString()}
              </Text>
              <Text style={styles.recordingDuration}>
                Duration: {formatTime(duration)}
              </Text>
            </View>
            
            <View style={styles.controls}>
              {isPlaying[uri] ? (
                <>
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={() => pauseSound(uri)}
                  >
                    <FontAwesome name="pause" size={24} color="#FFF" />
                  </TouchableOpacity>
                  
                  <View style={styles.speedControls}>
                    {speedOptions.map((speed) => (
                      <TouchableOpacity
                        key={speed}
                        style={[
                          styles.speedButton,
                          playbackSpeed === speed && styles.speedButtonActive
                        ]}
                        onPress={() => changePlaybackSpeed(speed)}
                      >
                        <Text style={styles.speedButtonText}>{speed}x</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => playSound(uri)}
                >
                  <FontAwesome name="play" size={24} color="#FFF" />
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={[styles.controlButton, styles.deleteButton]}
                onPress={() => deleteRecording(index, uri)}
              >
                <FontAwesome name="trash" size={24} color="#FF4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.timmer}>
        <Text style={styles.time}>{formatTime(recordingDuration)}</Text>
      </View>

      <TouchableOpacity
        style={[styles.recButton, recording && styles.recordingActive]}
        onPress={recording ? stopRecording : startRecording}
      >
        <FontAwesome 
          name={recording ? "stop-circle" : "microphone"} 
          size={32} 
          color={recording ? "#FF4444" : "#FFF"} 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#2D2D30',
  },
  header: {
    marginTop: 16,
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'Orbitron',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  records: {
    flex: 1,
    paddingHorizontal: 16,
  },
  recordingItem: {
    backgroundColor: '#3D3D40',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  recordingInfo: {
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  recordingTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  editButton: {
    padding: 4,
  },
  renameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  renameInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#2D2D30',
    color: '#FFF',
    borderRadius: 4,
    paddingHorizontal: 12,
    marginRight: 8,
    fontSize: 16,
  },
  renameButton: {
    padding: 8,
    marginLeft: 4,
  },
  recordingTimestamp: {
    color: '#BBB',
    fontSize: 14,
    marginBottom: 4,
  },
  recordingDuration: {
    color: '#BBB',
    fontSize: 14,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  controlButton: {
    padding: 8,
    marginRight: 16,
  },
  deleteButton: {
    marginLeft: 'auto',
  },
  time: {
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'Orbitron',
    fontSize: 35,
    fontWeight: '700',
    marginBottom: 16,
  },
  recButton: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#444',
    marginBottom: 32,
  },
  recordingActive: {
    backgroundColor: '#662222',
  },
  searchbar: {
    
    alignSelf: 'center',
    width: '80%',
    height: 45,
    borderRadius: 10,
    backgroundColor: '#484848',
    color: 'white',
    fontSize: 20,
    paddingLeft: 20,
    marginBottom: 16,
  },
  speedControls: {
    flexDirection: 'row',
    marginLeft: 16,
    alignItems: 'center',
  },
  speedButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#444',
    marginRight: 8,
  },
  speedButtonActive: {
    backgroundColor: '#666',
  },
  speedButtonText: {
    color: '#FFF',
    fontSize: 12,
  },
  timmer: {
    marginVertical: 16,
  },
});
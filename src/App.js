import React, { useState, useEffect } from "react";
import api from './services/api';

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function App() {
  const [repositories, setRepositories] = useState([])

  const getRepositories = async () => {
    try {
      const response = await api.get('repositories')
      if (response.status !== 200) throw new Error('could not get the data')
      const { data } = response
      setRepositories(data)
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    getRepositories()
  }, [])

  const getIndexProjectInRepository = (id, repositories) =>
    repositories.findIndex(({ id: uuid }) => uuid === id)

  async function handleLikeRepository(id) {
    //try {
      const { data, status } = await api.post(`repositories/${id}/like`)
      //if (status !== 201) throw new Error('repository not found')
      const projectIndex = getIndexProjectInRepository(id, repositories)
      const newRepositories = repositories.map(repo => repo)
      newRepositories[projectIndex] = data
      setRepositories(newRepositories)
    //} catch (error) {
      //console.log(error.message)
    //}
  }

  const RepoItem = (({ id, url, title, techs, likes }) => (
    < View style={styles.repositoryContainer}>

      <Text style={styles.repository}>{title}</Text>

      <View style={styles.techsContainer}>
        {techs.map(tech => <Text style={styles.tech} key={tech}>
          {tech}
        </Text>)}
      </View>

      <View style={styles.likesContainer}>
        <Text
          style={styles.likeText}
          // Remember to replace "1" below with repository ID: {`repository-likes-${repository.id}`}
          testID={`repository-likes-${id}`}
        >
          {`${likes} curtidas`}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleLikeRepository(id)}
        // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
        testID={`like-button-${id}`}
      >
        <Text style={styles.buttonText}>Curtir</Text>
      </TouchableOpacity>
    </View>
  ))

  const renderItem = ({ item }) =>
    <RepoItem
      id={item.id}
      title={item.title}
      techs={item.techs}
      likes={item.likes}
    />

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keyExtractor={item => item.id}
          renderItem={renderItem}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});

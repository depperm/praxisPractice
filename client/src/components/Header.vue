<template>
  <v-toolbar class="green darken-2" fixed>
    <!-- <v-toolbar-side-icon></v-toolbar-side-icon> -->

    <v-toolbar-title class="mr-4">
      <router-link class='title' to="/">
        Praxis Practice - {{title}}
      </router-link>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items v-if="this.$route.name==='takeTest'">
      <v-btn flat dark
        @click="markQuestion()">
        Mark
      </v-btn>
      <v-btn flat dark
        @click="reviewQuestions()">
        Review
      </v-btn>
      <v-btn flat dark
        @click="prevQuestion()">
        <v-icon dark left>arrow_back</v-icon>Previous
      </v-btn>
      <v-btn flat dark
        @click="nextQuestion()">
        Next<v-icon dark right>arrow_forward</v-icon>
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import { serverBus } from '../main'
export default {
  data () {
    return {
      title: null
    }
  },
  methods: {
    markQuestion () {
      serverBus.$emit('markQuestion')
    },
    nextQuestion () {
      serverBus.$emit('nextQuestion')
    },
    prevQuestion () {
      serverBus.$emit('prevQuestion')
    },
    reviewQuestions () {
      serverBus.$emit('reviewQuestions')
    }
  },
  created () {
    // Using the server bus
    serverBus.$on('changeTest', (title) => {
      this.title = title
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.title{
  text-decoration: none;
  color:white;
}
.title:hover{
  color:#c9c9c9;
}
</style>

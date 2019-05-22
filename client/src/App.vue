<template>
  <div id="app">
    <v-app>
      <page-header />

      <main>
        <v-container fluid>
          <router-view></router-view>
        </v-container>
      </main>
    </v-app>
  </div>
</template>

<script>
import PageHeader from '@/components/Header.vue'
export default {
  name: 'App',
  components: {
    PageHeader
  }
}
</script>

<style>
/* @import "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700%7CMaterial+Icons" */
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.application--wrap{
  min-height: 0px !important;
}
table {
  border-collapse: collapse;
  border: 1px solid black;
}
th,td {
  border: 1px solid black;
  padding: 2px;
}
/* checkbox spacing */
.v-input--selection-controls{
  margin-top: 0px !important;
}
</style>

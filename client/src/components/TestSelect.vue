<template>
  <v-form
    v-model="valid"
    ref="form">
    <v-container>
      <v-layout>
        <v-flex xs8>
          <v-select
            :items="testNames"
            label="Tests"
            v-model="select"
            v-on:change="changeId()"
            :rules="[v => !!v || 'Test is required']"
            required
          ></v-select>
        </v-flex>

        <v-flex
          xs4
        >
          <v-text-field
            v-model="numQuestions"
            label="Number of Questions"
            required
          ></v-text-field>
        </v-flex>

        <br>
        <v-btn
          :disabled="!valid"
          color="success"
          @click="start"
        >
          Start
        </v-btn>

      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
import TestService from '@/services/TestService'
import { serverBus } from '../main'
export default {
  data () {
    return {
      select: null,
      numQuestions: 1,
      valid: true,
      testNums: ['5354', '5622', '5203', '7801', '5543'],
      testNames: ['Special Education: Core Knowledge and Applications', 'Principles of Learning and Teaching: Grades K-6', 'Teaching Reading: Elementary Education', 'Elementary Education: Content Knowledge for Teaching', 'Special Education: Core Knowledge and Mild to Moderate Applications'],
      selectedTest: null

    }
  },
  methods: {
    async start () {
      if (this.$refs.form.validate()) {
        this.snackbar = true
        console.log('valid:' + this.testNums[this.testNames.indexOf(this.select)] + ' ' + this.numQuestions)
        try {
          let info = {}
          info.id = this.testNums[this.testNames.indexOf(this.select)]
          serverBus.$emit('changeTest', this.select)
          info.q = this.numQuestions
          const response = (await TestService.get_test(info)).data
          console.log(this.testQs)
          this.$store.dispatch('setTest', response)
          this.$router.push({
            name: 'takeTest',
            params: {
              id: this.testNums[this.testNames.indexOf(this.select)]
            },
            query: {
              q: this.numQuestions
            }
          })
        } catch (error) {
          console.log('There was an error')
        }
      }
    },
    changeId () {
      this.selectedTest = this.testNums[this.testNames.indexOf(this.select)]
      console.log('changeId:' + this.selectedTest + ' ' + this.numQuestions)
    }
  },
  created () {
    serverBus.$emit('changeTest', '')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

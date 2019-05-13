<template>
  <v-layout>
    <v-navigation-drawer permanent class="questionSelect">
      <v-toolbar flat>
        <v-list>
          <v-list-tile>
            <v-list-tile-title class="title">
              {{ testName }}
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-divider></v-divider>
      <v-list dense class="pt-0" v-if="testQs">
        <v-list-tile
          v-for="(quest, index) in testQs"
          :key="index"
          @click="changeQuestion(index)"
          active-class="highlighted"
          :class="currentQuestionIndex === index ? 'highlighted' : ''"
        >
          <v-list-tile-action>
            <v-icon color="black" v-if="!allQuestionsAnswered&&!graded&&quest.selectedAnswer!==-1">check_circle</v-icon>
            <v-icon color="green" v-else-if="allQuestionsAnswered&&graded&&quest.correct">check_circle</v-icon>
            <v-icon color="red" v-else-if="allQuestionsAnswered&&graded&&!quest.correct">check_circle</v-icon>
            <v-icon v-else>check_circle</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Question {{ index + 1 }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-container v-if="currentQuestion">
      <p class="text-xs-left">
        {{ currentQuestion.question }}
      </p>
      <v-radio-group v-model="currentAnswer">
        <v-radio
          v-for="(answer, i) in currentQuestion.answers"
          :key="i"
          :label="`${i}) ${answer}`"
          :value="i"
        ></v-radio>
      </v-radio-group>
      <v-alert
        :value="graded"
        type="success"
      >
        You scored: {{ totalScore }}/ {{ totalQuestions }}
      </v-alert>
      <v-alert
        :value="graded"
        type="info"
      >
        {{ currentQuestion.explanation }}
      </v-alert>
      <v-btn
        v-if="currentQuestionIndex<(totalQuestions-1)"
        @click="next()">
        Next
      </v-btn>
      <v-btn
        v-if="allQuestionsAnswered"
        @click="grade()">
        Grade
      </v-btn>
    </v-container>
  </v-layout>
</template>

<script>
export default {
  data () {
    return {
      testName: null,
      currentQuestion: null,
      currentQuestionIndex: 0,
      currentAnswer: -1,
      testQs: null,
      allQuestionsAnswered: false,
      graded: false,
      totalScore: 0,
      totalQuestions: 30,
      tests: {}
    }
  },
  methods: {
    changeQuestion (index) {
      console.log('clicked: ' + index)
      this.currentQuestion = this.testQs[index]
      this.currentQuestionIndex = index
      this.currentAnswer = this.testQs[this.currentQuestionIndex]['selectedAnswer']
    },
    next () {
      this.currentQuestionIndex++
      this.changeQuestion(this.currentQuestionIndex)
    },
    grade () {
      // console.log('should score')
      this.totalScore = 0
      for (let i = 0; i < this.testQs.length; i++) {
        if (this.testQs[i].selectedAnswer === this.testQs[i].correct_answer) {
          this.testQs[i]['correct'] = true
          this.totalScore++
        } else {
          this.testQs[i]['correct'] = false
        }
      }
      this.graded = true
    }
  },
  watch: {
    currentAnswer: function (val) {
      // console.log('answer changed to: ' + val)
      this.testQs[this.currentQuestionIndex].selectedAnswer = val
      let t = this.testQs.filter(
        function (q) {
          return q.selectedAnswer !== -1
        }).length
      if (t === this.totalQuestions) {
        this.allQuestionsAnswered = true
      }
    }
  },
  mounted () { // when loads on page
    console.log('HERE: ' + JSON.stringify(this.$store.state.test))
    const testId = this.$route.params.id
    this.tests[testId] = this.$store.state.test
    this.totalQuestions = this.tests[testId]['questions'].length
    console.log(this.totalQuestions)
    // console.log('test id:' + testId)
    // console.log('num q:' + this.$route.query.q)
    // console.log(Object.keys(this.tests)[0])
    // console.log(typeof testId)
    // console.log(typeof Object.keys(this.tests)[0])
    // console.log(Object.keys(this.tests)[0] === testId)
    // console.log(JSON.stringify(this.tests[testId]))
    this.testName = this.tests[testId]['name']
    this.testQs = this.tests[testId]['questions']
    /* question object format
    {
      'question': 'Trish is a sixth-grade student who is diagnosed with autism spectrum disorder (ASD). She has difficulty maintaining eye contact and makes impulsive comments during lessons. Which of the following behavioral strategies would best help Trish?',
      'answers': ['Assigning Trish a peer buddy to help her keep on task', 'Providing Trish a visual menu of appropriate behaviors', 'Seating Trish next to the window so she can look outside', 'Giving Trish high-interest, low-readinglevel assignments'],
      'correct_answer': 1,
      'explanation': 'The correct answer is {1}. A visual reminder can increase appropriate behavior. {0} is not correct because a peer buddy should not be given the task of keeping another student on task. {2} is not correct because that is not an appropriate strategy for Trish. {3} is not correct because that strategy is not related to the behavior.'
    */
    this.currentQuestion = this.testQs[this.currentQuestionIndex]
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
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
.container {
  margin-top: 12px;
  margin-left: 300px;
  position: fixed;
}
.questionSelect {
  z-index: 0;
}
.highlighted {
  border-right: 4px solid orange;
}
</style>

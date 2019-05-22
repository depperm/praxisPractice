<template>
  <v-layout row wrap>
    <v-dialog
      v-model="reviewDialog"
      width="500"
      v-if="testQs"
    >

      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          Review Questions
        </v-card-title>

        <v-data-table
          :items="testQs"
          :headers="headers"
          :pagination.sync="pagination"
        >
          <template
            v-slot:items="props">
            <tr
              @click="switchQuestion((pagination.page-1) * pagination.rowsPerPage + props.index)">
              <td>{{ (pagination.page-1) * pagination.rowsPerPage + props.index + 1 }}</td>
              <td><v-icon color="black" v-if="props.item.review">check</v-icon></td>
              <td>{{ props.item.selectedAnswer===-1?('seen' in props.item && props.item.seen?'Not Answered':'Not Seen'):'Answered' }}</td>
            </tr>
          </template>
        </v-data-table>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            flat
            @click="reviewDialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="finishDialog"
      width="500"
      v-if="testQs"
    >

      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          End of Test
        </v-card-title>

        <v-card-text>
          Are you sure you want to finish you still have {{timeLeft}} time left, have marked {{questionsToReview}} questions for review, AND have {{unansweredQuestions}} unanswered questions.
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            flat
            @click="finishDialog = false;currentQuestionIndex--"
          >
            Go Back
          </v-btn>
          <v-btn
            color="primary"
            flat
            @click="finishDialog = false;grade()"
          >
            Continue
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-flex xs3 offset-xs4>
      <v-card class="text-xs-center" flat
        id="questionNum"
        v-if="testQs">
        <v-card-text>
          Question {{ (currentQuestionIndex + 1) &lt;= testQs.length ? currentQuestionIndex + 1 : testQs.length }} of {{ testQs.length }}
        </v-card-text>
        <v-icon color="green" v-if="allQuestionsAnswered&&graded&&currentQuestion.correct">check_circle</v-icon>
        <v-icon color="red" v-else-if="allQuestionsAnswered&&graded&&!currentQuestion.correct">block</v-icon>
      </v-card>
    </v-flex>
    <v-flex xs2 offset-xs3>
      <v-card
        id="timer" flat>
        <v-card-text class="text-xs-center">
          {{ currentTime }}
        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs8 offset-xs2>
      <v-card
        id="currentQuestion"
        v-if="currentQuestion" flat>
        <!-- <img src="../assets/7801_4_lang_image.png">
        <vue-markdown>![img]({{require('@/assets/7801_4_lang_image.png')}})</vue-markdown> -->
        <div class="text-xs-left" v-if="currentQuestion.pre_question_instruction">
          <h3>{{currentQuestion.pre_question_instruction}}</h3>
          <vue-markdown class="text-xs-left" :source="currentQuestion.pre_question_text"></vue-markdown>
        </div>
        <v-divider></v-divider>
        <div class="text-xs-left" id="questionNumber">
          {{currentQuestionIndex+1}}.
        </div>
        <vue-markdown class="text-xs-left" :source="currentQuestion.question"></vue-markdown>
        <v-radio-group v-model="currentAnswer" v-if="currentQuestion.qType==='SC'">
          <v-radio
            v-for="(answer, i) in currentQuestion.answers"
            :key="i"
            :label="`${i}) ${answer}`"
            :value="i"
            :disabled="graded"
            @click.native="clickRadio(i)"
          ></v-radio>
        </v-radio-group>
        <!-- <v-item-group fluid v-else-if="currentQuestion.qType==='MC'">
          <li
            v-for="(answer, i) in currentQuestion.answers"
            :key="i">
            <v-checkbox
              :value="i"
              :label="`${i}) ${answer}`"
              :disabled="graded"
              v-model="currentQuestion.selectedAnswer"
              hide-details
              @click.native="clickCheckbox(i)">
            </v-checkbox>
          </li>
        </v-item-group> -->
        <v-flex xs10>
          <v-alert
            :value="graded"
            type="info"
            outline
          >
            You scored: {{ totalScore }}/ {{ totalQuestions }}
          </v-alert>
        </v-flex>
        <v-flex xs10>
          <v-alert
            :value="graded"
            v-if="currentQuestion.correct"
            type="success"
          >
            {{ currentQuestion.explanation }}
          </v-alert>
          <v-alert
            :value="graded"
            v-if="!currentQuestion.correct"
            type="error"
          >
            {{ currentQuestion.explanation }}
          </v-alert>
        </v-flex>
        <v-btn
          v-if="allQuestionsAnswered"
          @click="grade()">
          Grade
        </v-btn>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { serverBus } from '../main'
import VueMarkdown from 'vue-markdown'
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
      tests: {},
      startTime: null,
      currentTime: '00:00:00',
      reviewDialog: false,
      finishDialog: false,
      maxTime: 0,
      timeLeft: '00:00:00',
      counter: null,
      questionsToReview: 0,
      unansweredQuestions: 0,
      headers: [
        {
          text: 'Question',
          sortable: false
        },
        {
          text: 'Review',
          align: 'center',
          sortable: false
        },
        {
          text: 'Status',
          align: 'center',
          sortable: false
        }
      ],
      pagination: {
        rowsPerPage: 5
      }
    }
  },
  created () {
    // serverBus.$emit('startTest', new Date().getTime())
    this.startTime = new Date().getTime()
    this.beginClock()
    serverBus.$on('nextQuestion', () => {
      this.currentQuestionIndex++
      // this.currentQuestionIndex %= this.testQs.length
      if (!this.graded && this.currentQuestionIndex >= this.testQs.length) {
        this.finishDialog = true
      } else if (this.graded && this.currentQuestionIndex >= this.testQs.length) {
        this.currentQuestionIndex = this.testQs.length - 1
      } else {
        this.changeQuestion()
      }
    })
    serverBus.$on('prevQuestion', () => {
      this.currentQuestionIndex--
      if (this.currentQuestionIndex < 0) {
        this.currentQuestionIndex = 0
      } else {
        this.changeQuestion()
      }
    })
    serverBus.$on('markQuestion', () => {
      // console.log(JSON.stringify(this.testQs[this.currentQuestionIndex].review))
      this.testQs[this.currentQuestionIndex].review = !this.testQs[this.currentQuestionIndex].review
      // console.log(JSON.stringify(this.testQs[this.currentQuestionIndex]))
      // console.log(JSON.stringify(this.testQs[this.currentQuestionIndex].review))
      let tmp = 0
      this.testQs.forEach(function (question) {
        console.log('here: ' + question.review)
        if (question.review) {
          tmp++
        }
      })
      this.questionsToReview = tmp
    })
    serverBus.$on('reviewQuestions', () => {
      this.reviewDialog = true
    })
  },
  methods: {
    countUnanswered () {
      let tmp = 0
      this.testQs.forEach(function (question) {
        if (question.selectedAnswer < 0) {
          tmp++
        }
      })
      // console.log(tmp)
      this.unansweredQuestions = tmp
    },
    clickRadio (ans) {
      console.log('radio change' + ans)
      this.testQs[this.currentQuestionIndex].selectedAnswer = ans
      this.currentAnswer = ans
      this.countUnanswered()
    },
    clickCheckbox (ans) {
      let tmp = ans + ') ' + this.testQs[this.currentQuestionIndex].answers[ans]
      let selAns = this.testQs[this.currentQuestionIndex].selectedAnswer
      console.log('selAns:' + JSON.stringify(selAns))
      console.log('checkbox changed' + tmp)
      if (selAns === -1) {
        this.testQs[this.currentQuestionIndex].selectedAnswer = [tmp]
      } else if (selAns.indexOf(tmp) >= 0) {
        // remove
        (this.testQs[this.currentQuestionIndex].selectedAnswer).splice(selAns.indexOf(tmp), 1)
      } else {
        // add
        this.testQs[this.currentQuestionIndex].selectedAnswer.push(tmp)
      }
      this.currentAnswer = this.testQs[this.currentQuestionIndex].selectedAnswer
      this.countUnanswered()
      console.log(this.testQs[this.currentQuestionIndex].selectedAnswer)
    },
    switchQuestion (i) {
      console.log('clicked ' + i)
      this.currentQuestionIndex = i
      this.changeQuestion()
    },
    beginClock () {
      this.counter = setInterval(() => {
        // this.test++
        // console.log(this.test)
        let now = new Date().getTime()
        let diff = now - this.startTime
        // check if times up
        let min = Math.floor(diff / 1000 / 60)
        if (min >= this.maxTime) {
          console.log('times up')
          this.grade()
        }

        let tmp = this.maxTime
        let hr = Math.floor(diff / 1000 / 60 / 60)
        let hrLeft = Math.floor(tmp / 60)
        tmp -= hrLeft * 60
        // console.log('tmp: ' + tmp)
        this.timeLeft = (hrLeft - hr).toString().padStart(2, '0')
        this.currentTime = hr.toString().padStart(2, '0')
        diff -= hr * 1000 * 60 * 60

        min = Math.floor(diff / 1000 / 60)
        let minLeft = tmp - 1
        this.currentTime += ':' + min.toString().padStart(2, '0')
        this.timeLeft += ':' + minLeft.toString().padStart(2, '0')
        diff -= min * 1000 * 60

        let sec = Math.floor(diff / 1000)
        let secLeft = 60 - sec
        this.timeLeft += ':' + secLeft.toString().padStart(2, '0')
        this.currentTime += ':' + sec.toString().padStart(2, '0')
        // if condition
        // clearInterval(this.counter)
      }, 1000)
    },
    changeQuestion () {
      this.pagination.page = Math.floor(this.currentQuestionIndex / this.pagination.rowsPerPage) + 1

      // console.log('clicked: ' + this.currentQuestionIndex)
      this.testQs[this.currentQuestionIndex].seen = true
      // update the review dialog
      this.$forceUpdate()
      console.log(JSON.stringify(this.testQs[this.currentQuestionIndex]))
      this.currentQuestion = this.testQs[this.currentQuestionIndex]
      // console.log(this.currentQuestion)
      this.currentAnswer = this.testQs[this.currentQuestionIndex].selectedAnswer
      console.log('selectedAnswer/currentAnswer:' + this.currentAnswer)
    },
    grade () {
      clearInterval(this.counter)
      // console.log('should score')
      this.totalScore = 0
      for (let i = 0; i < this.testQs.length; i++) {
        if (this.testQs[i].selectedAnswer === this.testQs[i].correct_answer) {
          this.testQs[i].correct = true
          this.totalScore++
        } else {
          this.testQs[i].correct = false
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
    // console.log('HERE: ' + JSON.stringify(this.$store.state.test))
    const testId = this.$route.params.id
    this.tests[testId] = this.$store.state.test
    this.totalQuestions = this.tests[testId].questions.length
    // console.log(this.totalQuestions)
    // console.log('test id:' + testId)
    // console.log('num q:' + this.$route.query.q)
    // console.log(Object.keys(this.tests)[0])
    // console.log(typeof testId)
    // console.log(typeof Object.keys(this.tests)[0])
    // console.log(Object.keys(this.tests)[0] === testId)
    // console.log(JSON.stringify(this.tests[testId]))
    this.testName = this.tests[testId].name
    serverBus.$emit('changeTest', this.testName)
    this.testQs = this.tests[testId].questions

    this.maxTime = this.testQs.length
    // console.log('max time:' + this.maxTime)
    console.log(this.testQs)
    this.testQs = this.testQs.map(function (el) {
      let o = Object.assign({}, el)
      o.seen = false
      o.review = false
      o.correct = false
      o.selectedAnswer = -1
      if (!('qType' in o)) {
        o.qType = 'SC'
      }
      return o
    })
    this.unansweredQuestions = this.testQs.length
    // console.log('done map')
    this.testQs[0].seen = true
    /* question object format
    {
      'question': 'What?',
      'answers': ['A0', 'B1', 'C2', 'D3'],
      'correct_answer': 1,
      'explanation': 'The correct answer is {}. Explanation',
      correct: false,
      seen: false,
      review: false,
      selectedAnswer: 0
    */
    this.currentQuestion = this.testQs[this.currentQuestionIndex]
  },
  components: {
    VueMarkdown
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
#timer {
  text-align: right;
  margin-top: 0px;
  padding-top: 0px;
  font-weight: bold;
  font-size: 20px;
}
#questionNumber{
  position: absolute;
  left: -35px;
  font-size: 20px;
}
#questionNum {
  text-align: right;
  margin-top: 0px;
  padding-top: 0px;
  font-weight: bold;
  font-size: 20px;
}
.questionSelect {
  z-index: 0;
}
.highlighted {
  border-right: 4px solid orange;
}
</style>

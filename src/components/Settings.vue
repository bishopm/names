<template>
  <div class="layout-padding">
    <h3 class="text-center">App settings</h3>
    <form>
      <q-field icon="fas fa-fw fa-church" label="Church" class="q-my-md">
        <q-select placeholder="Select church" v-model="church" :options="churchOptions"/>
      </q-field>
      <q-field icon="fas fa-fw fa-sitemap" label="District" class="q-my-md">
        <q-select @input="chooseDistrict" placeholder="Select a district" v-model="district" :options="districtOptions"/>
      </q-field>
      <q-field icon="fas fa-fw fa-users" label="Circuit" class="q-my-md">
        <q-select @input="chooseCircuit" placeholder="Select a circuit" v-model="circuit" :options="circuitOptions"/>
      </q-field>
      <q-field icon="fas fa-fw fa-map-marker-alt" label="Society" class="q-my-md">
        <q-select @input="chooseSociety" placeholder="Select a society" v-model="society" :options="societyOptions"/>
      </q-field>
      <q-field icon="fas fa-fw fa-key" label="Token" class="q-my-md">
        <q-input @input="setToken" v-model="token"/>
      </q-field>
      <q-field icon="fas fa-fw fa-chart-line" label="Track service attendance?" class="q-my-md">
        <q-radio @input="storeattendance" v-model="attendance" val="no" label="No" />
        <q-radio @input="storeattendance" class="q-ml-md" v-model="attendance" val="yes" label="Yes" />
      </q-field>
    </form>
    <div class="text-center" v-if="society > 0">
      <q-btn class="q-my-md" color="secondary" @click.native="goHome()">All done! Back to home page</q-btn>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      churchOptions: [{ label: 'Methodist Church of Southern Africa', value: 'mcsa' }],
      circuitOptions: [],
      districtOptions: [],
      societyOptions: [],
      church: 'mcsa',
      attendance: localStorage.getItem('NAMES_Attendance'),
      token: this.$store.state.token,
      district: null,
      circuit: {},
      society: {},
      phone: ''
    }
  },
  methods: {
    goHome () {
      this.$router.push('/')
    },
    storeattendance () {
      localStorage.setItem('NAMES_Attendance', this.attendance)
    },
    setToken () {
      localStorage.setItem('NAMES_Token', this.token)
    },
    populateDistricts () {
      this.$axios.get(process.env.API + '/districts')
        .then(response => {
          this.districtOptions = []
          for (var dkey in response.data) {
            var newitem = {
              label: response.data[dkey].district,
              value: response.data[dkey].id
            }
            this.districtOptions.push(newitem)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    chooseDistrict () {
      this.$axios.get(process.env.API + '/districts/' + this.district)
        .then(response => {
          this.circuitOptions = []
          for (var ckey in response.data) {
            var newitem = {
              label: response.data[ckey].circuitnumber + ' ' + response.data[ckey].circuit,
              value: response.data[ckey].id
            }
            this.circuitOptions.push(newitem)
          }
          localStorage.setItem('NAMES_District', this.district)
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    chooseCircuit () {
      localStorage.setItem('NAMES_Circuit', this.circuit)
      for (var ckey in this.circuitOptions) {
        if (this.circuit === this.circuitOptions[ckey].value) {
          localStorage.setItem('NAMES_Circuitname', this.circuitOptions[ckey].label)
        }
      }
      this.$axios.get(process.env.API + '/circuits/' + this.circuit + '/societies')
        .then(response => {
          this.societyOptions = []
          for (var skey in response.data) {
            var newitem = {
              label: response.data[skey].society,
              value: response.data[skey].id
            }
            this.societyOptions.push(newitem)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    chooseSociety () {
      localStorage.setItem('NAMES_Society', this.society)
      for (var skey in this.societyOptions) {
        if (this.society === this.societyOptions[skey].value) {
          localStorage.setItem('NAMES_Societyname', this.societyOptions[skey].label)
        }
      }
    }
  },
  async mounted () {
    if (localStorage.getItem('NAMES_District')) {
      this.populateDistricts()
      this.district = parseInt(localStorage.getItem('NAMES_District'))
      await this.chooseDistrict()
    }
    if (localStorage.getItem('NAMES_Circuit')) {
      this.circuit = parseInt(localStorage.getItem('NAMES_Circuit'))
      await this.chooseCircuit()
    }
    if (localStorage.getItem('NAMES_Society')) {
      this.society = parseInt(localStorage.getItem('NAMES_Society'))
      await this.chooseSociety()
    }
    if (!localStorage.getItem('NAMES_District')) {
      this.populateDistricts()
    }
  }
}
</script>

<style>
.layout-padding {
  padding-top:0;
}
p {
  margin-bottom: 0;
}
h3 {
  line-height:0px;
}
</style>

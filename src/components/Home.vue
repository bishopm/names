<template>
  <div>
    <q-list v-if="family.length" class="no-border">
      <div class="text-center">
        <p class="q-ma-md caption">Who needs a name tag today?</p>
        {{addressee}}
        <q-item v-for="member in family" :key="member.id" @click.native="togglesticker(member)" class="q-mx-md cursor-pointer text-center">
          <q-item-main>
            <span v-if="stickers.includes(member)">
              <q-icon color="green" name="fa fa-check"></q-icon>
            </span>
            <span v-else>
              <q-icon color="red" name="fa fa-times"></q-icon>
            </span>
            {{member.firstname}} {{member.surname}}
          </q-item-main>
        </q-item>
        <q-btn @click="print" class="q-ma-md" size="lg" icon="fa fa-print" color="primary">&nbsp;Print labels</q-btn><br>
        <q-btn @click="cancel" class="q-ma-sm" icon="fa fa-times" size="md" color="black">&nbsp;Cancel</q-btn>
        <q-btn @click="$router.push({name: 'edithousehold', params: { id: family[0].household_id }})" size="md" class="q-ma-sm" icon="fa fa-plus" color="grey">&nbsp;Add</q-btn>
      </div>
    </q-list>
    <q-list class="no-border">
      <q-search disable autocomplete=off v-if="!family.length" no-ripple id="searchbox" @input="searchdb" class="q-ma-md gt-xs" v-model="search" placeholder="search by name or cellphone" />
      <q-search autocomplete=off v-if="!family.length" no-ripple id="searchbox" @input="searchdb" class="q-ma-md lt-sm" v-model="search" placeholder="search by name or cellphone" />
      <keyboard class="gt-xs" v-if="!family.length" v-model="search" @input="searchdb" :layouts="['1234567890|qwertyuiop|asdfghjkl{❌:backspace}|zxcvbnm{space:space}']"></keyboard>
      <div class="q-ma-md text-center" v-if="!family.length">
        <q-btn color="primary" @click="$router.push('addnew')">Click here if we don't have your details</q-btn>
      </div>
      <br>
      <q-item v-for="household in households" :key="household.id" @click.native="showfamily(household)" class="cursor-pointer">
        {{household.addressee}}
      </q-item>
    </q-list>
    <q-list class="no-border text-center">
      <q-item v-for="(member, ndx) in newhousehold" :key="ndx" class="text-center">
        {{member.firstname}} {{member.surname}}
      </q-item>
    </q-list>
    <q-modal minimized v-model="addnewmodal" content-css="padding: 50px">
      <h4>Add a new person</h4>
      <div class="q-mx-md">
        <q-field :error="$v.newindiv.firstname.$error" error-label="The firstname field is required">
          <q-input float-label="First name" v-model="newindiv.firstname" @blur="$v.newindiv.firstname.$touch()" :error="$v.newindiv.firstname.$error" />
        </q-field>
      </div>
      <div class="q-mx-md">
        <q-field :error="$v.newindiv.surname.$error" error-label="The surname field is required">
          <q-input float-label="Surname" v-model="newindiv.surname" @blur="$v.newindiv.surname.$touch()" :error="$v.newindiv.surname.$error" />
        </q-field>
      </div>
      <div class="q-mx-md">
        <q-field :error="$v.newindiv.cellphone.$error" error-label="The cellphone must be numeric">
          <q-input float-label="Cellphone (optional)" v-model="newindiv.cellphone" @blur="$v.newindiv.cellphone.$touch()" :error="$v.newindiv.cellphone.$error" />
        </q-field>
      </div>
      <div class="q-mx-md">
        <q-field :error="$v.newindiv.sex.$error" error-label="Please choose male or female" class="text-center">
          <q-btn-toggle v-model="newindiv.memberstatus" toggle-color="primary" :options="[{label: 'Adult', value: 'non-member'},
            {label: 'Child', value: 'child'}, {label: 'Youth', value: 'youth'}]"/>
        </q-field>
      </div>
      <div class="q-mx-md">
        <q-field :error="$v.newindiv.sex.$error" error-label="Please choose male or female" class="text-center">
          <q-radio v-model="newindiv.sex" val="female" label="Female" />
          <q-radio class="q-ml-md" v-model="newindiv.sex" val="male" label="Male" />
        </q-field>
      </div>
      <div class="q-ma-lg text-center">
        <q-btn class="q-ml-md" color="primary" @click="submit">OK</q-btn>
        <q-btn class="q-ml-md" color="black" @click="addnewmodal = false">Cancel</q-btn>
      </div>
    </q-modal>
  </div>
</template>

<script>
import { required, minLength, numeric } from 'vuelidate/lib/validators'
import keyboard from 'vue-keyboard'
import jsPDF from 'jspdf'
export default {
  data () {
    return {
      family: {},
      stickers: [],
      households: [],
      addressee: '',
      search: '',
      society: parseInt(localStorage.getItem('NAMES_Society')),
      addnew: false,
      addnewmodal: false,
      pdf: '',
      newindiv: {
        firstname: '',
        surname: '',
        cellphone: '',
        memberstatus: 'non-member',
        sex: 'female'
      },
      newhousehold: [],
      now: ''
    }
  },
  components: { keyboard },
  validations: {
    newindiv: {
      surname: { required, minLength: minLength(2) },
      firstname: { required, minLength: minLength(2) },
      cellphone: { numeric },
      sex: { required }
    }
  },
  methods: {
    shownew () {
      this.addnew = true
      this.addnewmodal = true
      this.households = []
    },
    searchdb () {
      if (this.search.length >= 1) {
        this.family = []
        this.addnew = false
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
        this.$axios.post(process.env.API + '/householdstickers/stickers',
          {
            search: this.search,
            society: this.society,
            society_id: localStorage.getItem('NAMES_Society'),
            accesstype: 'nametags',
            token: this.$store.state.token
          })
          .then(response => {
            this.households = response.data
          })
          .catch(function (error) {
            console.log(error)
          })
      } else {
        this.households = []
        this.family = []
      }
    },
    submit () {
      this.newhousehold.push({ firstname: this.newindiv.firstname, surname: this.newindiv.surname, cellphone: this.newindiv.surname, sex: this.newindiv.sex })
      this.newindiv.firstname = ''
      this.newindiv.cellphone = ''
      this.newindiv.sex = ''
      this.addnewmodal = false
    },
    showfamily (household) {
      this.family = household.individuals
      this.search = ''
      this.households = []
      this.stickers = []
    },
    togglesticker (indiv) {
      var ndx = this.stickers.indexOf(indiv)
      if (ndx === -1) {
        this.stickers.push(indiv)
      } else {
        this.stickers.splice(ndx, 1)
      }
    },
    print () {
      if (localStorage.getItem('NAMES_Attendance') === 'yes') {
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
        this.$axios.post(process.env.API + '/attendances',
          {
            individuals: this.stickers,
            service_id: this.$store.state.service,
            society_id: localStorage.getItem('NAMES_Society'),
            accesstype: 'nametags',
            token: this.$store.state.token
          })
          .then(response => {
            this.printstickers()
          })
          .catch(function (error) {
            console.log(error)
          })
      } else {
        this.printstickers()
      }
    },
    printstickers () {
      this.pdf = new jsPDF({
        orientation: 'l',
        unit: 'mm',
        format: [62, 30]
      })
      for (var ikey in this.stickers) {
        if (ikey > 0) {
          this.pdf.addPage({
            format: [62, 30],
            orientation: 'l'
          })
        }
        this.pdf.setFontSize(12)
        this.pdf.text(this.stickers[ikey].firstname, 11, 5, {'align': 'center'})
        this.pdf.setFontSize(9)
        this.pdf.text(this.stickers[ikey].surname, 11, 9, {'align': 'center'})
      }
      cordova.plugins.brotherPrinter.sendUSBConfig(this.pdf.output())
      this.$q.notify('Your labels are ready!')
      this.family = []
      this.stickers = []
    },
    cancel () {
      this.family = []
    }
  },
  mounted () {
    this.$store.commit('setToken', localStorage.getItem('NAMES_Token'))
    if (this.$route.params.fam) {
      this.family = this.$route.params.fam
    }
  }

}
</script>

<style>
#searchbox {
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 10px;
    border-style: solid;
    padding: 15px;
    content: '';
    font-size: 125%;
    line-height: 400%;
}
.vue-keyboard-row {
  font-size: 150%;
  padding-top: 10px;
}
.vue-keyboard-key {
  margin-left:10px;
  background-color: #f4fff4;
  border: solid 1px #ddffdd;
}
.q-item, .caption {
  font-size: 125%;
  font-weight: bold;
}
h4 {
  margin-top: 0px;
  text-align: center;
}
</style>

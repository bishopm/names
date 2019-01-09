<template>
  <div>
    <q-list v-if="family.length" class="no-border">
      <div class="text-center">
        <p class="q-ma-md caption">Who needs a name tag today?</p>
        <q-item v-for="member in family" :key="member.id" @click.native="togglesticker(member.id)" class="q-mx-md cursor-pointer text-center">
          <q-item-main>
            <span v-if="stickers.includes(member.id)">
              <q-icon color="green" name="fa fa-check"></q-icon>
            </span>
            <span v-else>
              <q-icon color="red" name="fa fa-times"></q-icon>
            </span>
            {{member.firstname}} {{member.surname}}
          </q-item-main>
        </q-item>
        <q-btn @click="selectall" class="q-ma-md" icon="fa fa-check-circle" color="primary">&nbsp;Select all</q-btn>
        <q-btn @click="print" class="q-ma-md" icon="fa fa-print" color="primary">&nbsp;Print</q-btn>
      </div>
    </q-list>
    <q-list class="no-border">
      <q-search no-ripple id="searchbox" ref="search" @input="searchdb" class="q-ma-md" v-model="search" placeholder="search by name or cellphone" />
      <div class="q-ma-md text-center" v-if="search.length">
        <q-btn color="primary" @click="shownew">Don't see your name below? Add a new name</q-btn>
      </div>
      <q-item v-for="household in households" :key="household.id" @click.native="showfamily(household)" class="cursor-pointer">
        {{household.addressee}}
      </q-item>
    </q-list>
    <div v-if="addnew">
      <q-list>
        <q-item v-for="member in newhousehold" :key="member">
          {{member.firstname}} {{member.surname}}
        </q-item>
      </q-list>
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
      <div class="q-ma-lg text-center">
        <q-btn color="secondary" @click="another">Add another</q-btn>
        <q-btn class="q-ml-md" color="primary" @click="submit">OK</q-btn>
        <q-btn class="q-ml-md" color="black" @click="$router.back()">Cancel</q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { required, minLength, numeric } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      family: {},
      stickers: [],
      households: [],
      search: '',
      addnew: false,
      newindiv: {
        firstname: '',
        surname: '',
        cellphone: '',
        sex: 'female'
      },
      newhousehold: []
    }
  },
  validations: {
    newindiv: {
      surname: { required, minLength: minLength(2) },
      firstname: { required, minLength: minLength(2) },
      cellphone: { numeric }
    }
  },
  methods: {
    addHousehold () {
      this.$router.push({name: 'householdform', params: { action: 'add' }})
    },
    shownew () {
      this.addnew = true
      this.households = []
    },
    searchdb () {
      if (this.search.length >= 1) {
        this.family = []
        this.addnew = false
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
        this.$axios.post(process.env.API + '/households/stickers',
          {
            search: this.search,
            society: 667
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
      console.log('submitting')
    },
    another () {
      this.newhousehold.push({ firstname: this.newindiv.firstname, surname: this.newindiv.surname, cellphone: this.newindiv.surname, sex: this.newindiv.sex })
      this.newindiv.firstname = ''
      this.newindiv.cellphone = ''
    },
    showfamily (household) {
      this.family = household.individuals
      this.search = ''
      this.households = []
      this.stickers = []
    },
    selectall () {
      for (var fndx in this.family) {
        if (this.stickers.indexOf(this.family[fndx].id === -1)) {
          this.stickers.push(this.family[fndx].id)
        }
      }
    },
    togglesticker (id) {
      var ndx = this.stickers.indexOf(id)
      if (ndx === -1) {
        this.stickers.push(id)
      } else {
        this.stickers.splice(ndx, 1)
      }
    },
    print () {
      this.$q.notify('Your labels are ready!')
      this.family = []
      this.stickers = []
    }
  },
  mounted () {
    this.$store.commit('setToken', localStorage.getItem('CHURCHNET_Token'))
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
.q-item, .caption {
  font-size: 125%;
}
</style>
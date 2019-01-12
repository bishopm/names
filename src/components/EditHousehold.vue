<template>
  <div class="layout-padding">
    <div class="q-mx-md q-mt-md text-center caption">
      Update household
    </div>
    <div class="q-ma-md">
      <q-field :error="$v.form.addressee.$error" error-label="The addressee field is required">
        <q-input float-label="Addressee" v-model="form.addressee" @blur="$v.form.addressee.$touch()" :error="$v.form.addressee.$error" />
      </q-field>
    </div>
    <q-tabs color="secondary" no-pane-border align="justify" class="q-mt-md">
      <q-tab v-for="(indiv, ndx) in household.individuals" :default="!ndx" :key="indiv.id" slot="title" :name="'tab' + indiv.id" :label="indiv.firstname"/>
      <q-tab-pane v-for="indiv in household.individuals" :key="indiv.id" :name="'tab' + indiv.id">
        <q-icon v-if="indiv.surname" name="fas fa-fw fa-user" color="primary"></q-icon> <b>{{indiv.title}} {{indiv.firstname}} {{indiv.surname}}</b>&nbsp;<q-btn color="primary" round size="sm" @click.native="editIndividual(indiv)">edit</q-btn><br>
        <q-icon v-if="indiv.cellphone" name="fas fa-fw fa-mobile-alt" color="primary"></q-icon> {{indiv.cellphone}}<br>
        <q-icon v-if="indiv.email" name="fas fa-fw fa-envelope" color="primary"></q-icon> {{indiv.email}}<br>
        <q-icon v-if="indiv.birthdate" name="fas fa-fw fa-birthday-cake" color="primary"></q-icon> {{indiv.birthdate}}<br>
        <q-icon v-if="indiv.memberstatus" name="fas fa-fw fa-check-square" color="primary"></q-icon> {{indiv.memberstatus}}<br>
        <span v-if="indiv.memberstatus !== 'child'">
          <q-btn class="q-ma-md" @click.native="giver(indiv.id)">Planned Giving</q-btn>
        </span>
        <br>
      </q-tab-pane>
      <q-tab key="0" slot="title" name="tabadd" icon="fas fa-fw fa-plus-circle"/>
      <q-tab-pane name="tabadd">
        <q-btn @click.native="addIndividual()">Add a new member to this household</q-btn>
      </q-tab-pane>
    </q-tabs>
    <div class="q-ma-md text-center">
      <q-btn color="primary" @click="submit">OK</q-btn>
      <q-btn class="q-ml-md" color="secondary" @click="$router.back()">Cancel</q-btn>
      <q-btn class="q-ml-md" color="black">Delete</q-btn>
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
// https://github.com/monterail/vuelidate/tree/master/src/validators
export default {
  data () {
    return {
      form: {
        addressee: ''
      }
    }
  },
  validations: {
    form: {
      addressee: { required }
    }
  },
  methods: {
    submit () {
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        this.$q.notify('Please check for errors!')
      } else {
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
        this.$axios.post(process.env.API + '/households/' + this.form.id,
          {
            addressee: this.form.addressee
          })
          .then(response => {
            this.$q.loading.hide()
            this.$q.notify('Household updated')
            this.$router.push({ name: 'household', params: { id: response.data.id } })
          })
          .catch(function (error) {
            console.log(error)
            this.$q.loading.hide()
          })
      }
    }
  },
  mounted () {
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
    this.$axios.get(process.env.API + '/households/' + this.$route.params.id)
      .then((response) => {
        this.form = response.data
        for (var ikey in this.form.individuals) {
          var newitem = {
            label: this.form.individuals[ikey].firstname,
            value: this.form.individuals[ikey].id
          }
          if (this.form.individuals[ikey].cellphone) {
            this.housecellOptions.push(newitem)
          }
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  }
}
</script>

<style>
  a {
    text-decoration: none;
    color:white;
  }
</style>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar color="primary" :glossy="$q.theme === 'mat'" :inverted="$q.theme === 'ios'">
        <q-btn flat dense round @click="$router.push('/')" aria-label="Home">
          <q-icon name="fa fa-home" />
        </q-btn>
        <q-toolbar-title>
          Welcome to {{church}}
          <div slot="subtitle">Find your details and print a nametag</div>
        </q-toolbar-title>
        <q-btn flat dense round @click="$router.push('settings')" aria-label="Settings">
          <q-icon name="fa fa-cog" />
        </q-btn>
      </q-toolbar>
    </q-layout-header>

    <q-page-container>
      <router-view />
    </q-page-container>
    <q-layout-footer>
      <q-toolbar class="justify-around">
        {{now}}
      </q-toolbar>
    </q-layout-footer>
  </q-layout>
</template>

<script>
import { date } from 'quasar'

export default {
  name: 'MyLayout',
  data () {
    return {
      church: localStorage.getItem('NAMES_Societyname') + ' Methodist Church',
      services: [],
      now: ''
    }
  },
  mounted () {
    this.$store.commit('setNow', Date.now())
    this.getnow()
    this.$nextTick(function () {
      window.setInterval(() => {
        this.$store.commit('setNow', Date.now())
        this.getnow()
      }, 1000 * 60)
    })
    if (localStorage.getItem('NAMES_Society')) {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.get(process.env.API + '/services/' + localStorage.getItem('NAMES_Society'))
        .then(response => {
          this.services = response.data
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  },
  methods: {
    getnow () {
      this.now = date.formatDate(this.$store.state.now, 'd MMMM YYYY HH:mm')
    }
  }
}
</script>

<style>
</style>

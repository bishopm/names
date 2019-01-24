<template>
  <div class="layout-padding">
    <div class="q-mx-md q-mt-md text-center caption">
      Update household
    </div>
    <div class="q-ma-md">
      <q-field :error="$v.addressee.$error" error-label="The addressee field is required">
        <q-input float-label="Household name" v-model="addressee" @blur="$v.addressee.$touch()" :error="$v.addressee.$error" />
      </q-field>
    </div>
    <q-table :data="data" :columns="columns" row-key="firstname" hide-bottom>
      <q-tr slot="body" slot-scope="props" :props="props">
        <q-td class="nameinput" key="firstname" :props="props">
          {{ props.row.firstname }}
          <q-popup-edit v-model="props.row.firstname" buttons>
            <q-field count>
              <q-input @blur="checkrow('f')" v-model="props.row.firstname" />
            </q-field>
          </q-popup-edit>
        </q-td>
        <q-td class="nameinput" key="surname" :props="props">
          {{ props.row.surname }}
          <q-popup-edit v-model="props.row.surname" buttons>
            <q-input @blur="checkrow('s')" v-model="props.row.surname" />
          </q-popup-edit>
        </q-td>
        <q-td class="nameinput" key="sex" :props="props">
          {{ props.row.sex }}
          <q-popup-edit v-model="props.row.sex">
            <q-select v-model="props.row.sex" :options="[{ label: 'female', value: 'female' }, { label: 'male', value: 'male' }]"/>
          </q-popup-edit>
        </q-td>
        <q-td class="nameinput" key="cellphone" :props="props">
          {{ props.row.cellphone }}
          <q-popup-edit v-model="props.row.cellphone" buttons>
            <q-input v-model="props.row.cellphone" />
          </q-popup-edit>
        </q-td>
        <q-td class="nameinput" key="memberstatus" :props="props">
          {{ props.row.memberstatus }}
          <q-popup-edit v-model="props.row.memberstatus">
            <q-select v-model="props.row.memberstatus" :options="[{ label: 'Adult', value: 'adult' }, { label: 'Child', value: 'child' }, { label: 'Youth', value: 'youth' }]"/>
          </q-popup-edit>
        </q-td>
      </q-tr>
    </q-table>
    <div class="q-ma-md text-center">
      <q-btn color="primary" @click="update">OK</q-btn>
      <q-btn class="q-ml-md" color="secondary" @click="$router.back()">Cancel</q-btn>
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
// https://github.com/monterail/vuelidate/tree/master/src/validators
export default {
  data () {
    return {
      addressee: '',
      columns: [
        { name: 'firstname', required: true, label: 'First name', align: 'center', field: 'firstname' },
        { name: 'surname', required: true, label: 'Surname', align: 'center', field: 'surname' },
        { name: 'sex', required: true, label: 'Sex', align: 'center', field: 'sex' },
        { name: 'cellphone', required: false, label: 'Cellphone', align: 'center', field: 'cellphone' },
        { name: 'memberstatus', required: true, label: '', align: 'center', field: 'memberstatus' }
      ],
      data: []
    }
  },
  validations: {
    addressee: { required }
  },
  methods: {
    checkrow (ff) {
      if (((ff === 'f') && (this.data.length > 1)) || ((ff === 's') && (this.data.length === 1))) {
        var lastrow = this.data.slice(-1)[0]
        if (lastrow.firstname.length > 0) {
          this.data.push({ firstname: '', surname: lastrow.surname, sex: 'female', cellphone: '', memberstatus: 'adult' })
        }
      }
    },
    update () {
      this.$v.$touch()
      if (this.$v.$error) {
        this.$q.notify('Please check for errors!')
      } else {
        for (var ndx in this.data) {
          if (this.data[ndx].firstname === '') {
            this.data.splice(ndx, 1)
          } else if (this.data[ndx].surname === '') {
            this.$q.notify('Missing surname')
            break
          }
        }
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
        this.$axios.post(process.env.API + '/households/stickerupdate',
          {
            id: this.$route.params.id,
            addressee: this.addressee,
            individuals: this.data
          })
          .then(response => {
            this.$router.push({ name: 'home', params: { fam: response.data } })
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    }
  },
  mounted () {
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
    this.$axios.get(process.env.API + '/households/' + this.$route.params.id)
      .then((response) => {
        for (var ikey in response.data.individuals) {
          var newitem = {
            id: response.data.individuals[ikey].id,
            firstname: response.data.individuals[ikey].firstname,
            surname: response.data.individuals[ikey].surname,
            sex: response.data.individuals[ikey].sex,
            cellphone: response.data.individuals[ikey].cellphone,
            memberstatus: response.data.individuals[ikey].memberstatus
          }
          this.data.push(newitem)
        }
        this.addressee = response.data.addressee
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

<template>
  <main class="page admin">
    <div class="admin__createNewAccount">
      <h1>Create A New Admin Account</h1>
      <form @submit.prevent="makeNewUser">
        <input required v-model="newName" type="text" placeholder="Full Name (used for authorizing waivers)">
        <input required v-model="newEmail" type="email" placeholder="email">
        <input required v-model="newPass" type="password" @keypress.13="makeNewUser" placeholder="password">
        <p class="error" v-if="error">{{error}}</p>
        <button type="submit">LOGIN</button>
        <p class="support">Having trouble? Email <a href="mailto:ronan@hyphen-hacks.com">ronan@hyphen-hacks.com</a>
        </p>
      </form>
    </div>
    <div class="admin__ticketIdType">
      <h1>Ticket ID Types</h1>
      <button class="admin__ticketIdType__add" @click="editTicket('new')">ADD</button>
      <div class="admin__ticketIdType__tickets">
        <div class="ticket" :key="ticket.id" v-for="ticket in ticketTypes">
          <p class="ticket__name">{{ticket.name}}</p>
          <p class="ticket__id">{{ticket.id}}</p>
          <edit-button :ticket="ticket"/>
        </div>
      </div>

    </div>
    <div v-if="modal" class="centeredBox">
      <div v-if="modal" v-on-click-outside="closeModal" class="admin__ticketModal">
        <h1>Edit Ticket Type</h1>
        <form @submit.prevent="updateTicket">
          <input type="text" placeholder="Name" v-model="editTicketData.name" required>
          <input type="text" placeholder="Eventbrite ID" v-model="editTicketData.id" required>
          <button @click="deleteTicket" class="delete">DELETE</button>
          <button class=" submit" type="submit">UPDATE</button>
        </form>
      </div>
    </div>

  </main>
</template>

<script>
  import '@/assets/css/admin.scss'
  import CryptoJS from '../../node_modules/crypto-js/crypto-js'
  import editButton from '@/components/edit.vue'

  export default {
    name: 'admin',
    components: {
      "edit-button": editButton
    },
    data() {
      return {
        modal: false,
        newName: '',
        newEmail: '',
        newPass: '',
        error: '',
        apiKey: '',
        editTicketData: {}
      }
    },
    computed: {
      ticketTypes() {
        return this.$store.getters.getTicketTypes
      }
    },
    mounted() {
      this.updateApiKey()
    },
    methods: {
      deleteTicket() {
        this.$store.dispatch('updateTicket', {id: this.editTicketData.id, name: false})
        this.modal = false;
      },
      closeModal: function () {
        console.log(this.modal)
        if (this.modal) {
          this.modal = false
        }
      },
      editTicket(ticket) {
        if (ticket === 'new') {
          this.editTicketData = {
            id: '',
            name: ''
          };
        } else {
          this.editTicketData = ticket;
        }

        this.modal = true;
      },
      updateTicket() {
       // console.log(this.editTicketData, 'data to update')
        this.$store.dispatch('updateTicket', this.editTicketData)
        this.modal = false;
      },
      updateApiKey() {
        this.$firebase.firestore().collection('secrets').doc('apiKeyDashboard').get().then(doc => {
          this.apiKey = doc.data().key;
        })
      },
      makeNewUser() {
        this.updateApiKey()
        if (this.newName && this.newEmail && this.newPass) {
          this.error = ""
          let reqbody = CryptoJS.AES.encrypt(JSON.stringify({
            name: this.newName, email: this.newEmail, pass: this.newPass
          }), this.apiKey).toString()
          console.log(reqbody)
          const options = {
            method: 'post',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': this.apiKey
            },
            body: JSON.stringify({user: reqbody})

          }
          console.log(options)
          fetch('https://api.hyphen-hacks.com/api/v1/newAdminAccount', options).then(res => res.json()).then(res => {
            console.log(res)
            if (res.error) {
              this.$swal({
                icon: "error",
                title: "error",
                text: res.error.message
              })

            } else {
              this.$swal({
                icon: "success",
                title: "Success",
                text: `Successfully created user ${this.newName}`
              })
              this.newName = ''
              this.newEmail = ''
              this.newPass = ''
              this.error = ''
            }
          })
        } else {
          this.error = "all fields required"
        }
      }
    }

  }
</script>

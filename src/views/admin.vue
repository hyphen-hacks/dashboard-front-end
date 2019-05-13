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
          <p class="ticket__waiverRef">{{ticket.waiverRef}}</p>
          <edit-button :ticket="ticket"/>
        </div>
      </div>

    </div>
    <div class="admin__attendeeWaiver">
      <h1>Attendee Waiver</h1>
      <p>Download URL: <a target="_blank" :href="attendeeWaiver.download">{{attendeeWaiver.download}}</a></p>
      <p>Uploaded: {{timeStamp(attendeeWaiver.uploaded)}}</p>
      <p>Type: {{attendeeWaiver.type}}</p>
      <button class="upload" @click="openUploadWaiver('Attendee')">UPLOAD NEW</button>

    </div>
    <div class="admin__voulunteerWaiver">
      <h1>Volunteer Waiver</h1>
      <p>Download URL: <a target="_blank" :href="volunteerWaiver.download">{{volunteerWaiver.download}}</a></p>
      <p>Uploaded: {{timeStamp(volunteerWaiver.uploaded)}}</p>
      <p>Type: {{volunteerWaiver.type}}</p>
      <button class="upload" @click="openUploadWaiver('Volunteer')">UPLOAD NEW</button>
    </div>
    <div class="admin__judgeWaiver">
      <h1>Mentor/Judge Waiver</h1>
      <p>Download URL: <a target="_blank" :href="mentorWaiver.download">{{mentorWaiver.download}}</a></p>
      <p>Uploaded: {{timeStamp(mentorWaiver.uploaded)}}</p>
      <p>Type: {{mentorWaiver.type}}</p>
      <button class="upload" @click="openUploadWaiver('Mentor/Judge')">UPLOAD NEW</button>
    </div>
    <div v-if="modal" class="centeredBox">
      <div v-if="modal" v-on-click-outside="closeModal" class="admin__ticketModal">
        <h1>Edit Ticket Type</h1>
        <form @submit.prevent="updateTicket">
          <input type="text" placeholder="Name" v-model="editTicketData.name" required>
          <input type="text" placeholder="Eventbrite ID" v-model="editTicketData.id" required>
          <select @change.prevent="selectSubmit" v-model="editTicketData.waiverRef" name="waiverType"
                  @input.prevent="selectSubmit">
            <option value="attendeeWaiver">Attendee Waiver</option>
            <option value="mentorWaiver">Mentor/Judge Waiver</option>
            <option value="volunteerWaiver"> Volunteer Waiver</option>
          </select>

          <button @click="deleteTicket" class="delete">DELETE</button>
          <button class="submit" type="submit">UPDATE</button>
        </form>
      </div>
    </div>
    <div v-if="uploader" class="centeredBox">
      <div v-if="uploader" v-on-click-outside="closeUploader" class="admin__waiverModal">
        <h1>Upload Blank {{waiverType}} Waiver</h1>

        <form @hover="hovering = true" v-if="isInitial" :class="{hover: hovering}" enctype="multipart/form-data"
              novalidate class="uploader">
          <input @dragover="hovering = true" @dragenter="hovering = true" @dragleave="hovering = false"
                 @dragend="hovering = false" @drop="hovering = false" type="file" name="uploader" :disabled="!isInitial"
                 @change="fileChange($event)"
                 accept="application/pdf">
          <p v-if="isInitial" :class="{errorUpload: errorUploading}"><span>Add</span> or drag the waiver here</p>
          <p v-if="errorUploading" class="error">{{errorUploading}}</p>
          <a v-if="errorUploading" class="error">Contact Support</a>

        </form>
        <div v-if="!isInitial" class="uploading">
          <div v-if="uploading" class="sk-cube-grid">
            <div class="sk-cube sk-cube1"></div>
            <div class="sk-cube sk-cube2"></div>
            <div class="sk-cube sk-cube3"></div>
            <div class="sk-cube sk-cube4"></div>
            <div class="sk-cube sk-cube5"></div>
            <div class="sk-cube sk-cube6"></div>
            <div class="sk-cube sk-cube7"></div>
            <div class="sk-cube sk-cube8"></div>
            <div class="sk-cube sk-cube9"></div>
          </div>
          <p v-if="uploading">Uploading Waiver!</p>
          <p v-if="error" class="error">{{error}}</p>
          <a v-if="error" class="error">Contact Support</a>
        </div>
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
        loadingCounter: 0,
        modal: false,
        newName: '',
        newEmail: '',
        newPass: '',
        error: '',
        apiKey: '',
        hovering: false,
        editTicketData: {},
        mentorWaiver: false,
        volunteerWaiver: false,
        attendeeWaiver: false,
        attendeeWaiverFile: false,
        uploader: false,
        waiverType: false,
        isInitial: true,
        errorUploading: false,
        uploading: false,
        waiverFBref: false,
        loadingCount: 4,
        preventTicketUpdate: false
      }
    },
    computed: {
      ticketTypes() {
        return this.$store.getters.getTicketTypes
      }
    },
    mounted() {
      this.updateApiKey()
      this.$firebase.firestore().collection('publicRefs').doc('attendeeWaiver').get().then(snap => {
        this.attendeeWaiver = snap.data()
        this.loadingCounter++
        if (this.loadingCounter == this.loadingCount) {
          this.$parent.loading = false
        }
      })
      this.$firebase.firestore().collection('publicRefs').doc('mentorWaiver').get().then(snap => {
        this.mentorWaiver = snap.data()
        this.loadingCounter++
        if (this.loadingCounter == this.loadingCount) {
          this.$parent.loading = false
        }
      })
      this.$firebase.firestore().collection('publicRefs').doc('volunteerWaiver').get().then(snap => {
        this.volunteerWaiver = snap.data()
        this.loadingCounter++
        if (this.loadingCounter == this.loadingCount) {
          this.$parent.loading = false
        }
      })
    },
    methods: {
      selectSubmit() {
        //console.log('select submit', 'preventing')
        this.preventTicketUpdate = true
        this.modal = true
      },
      openUploadWaiver(type) {
        this.waiverType = type
        this.uploader = true
        if (type === 'Attendee') {
          this.waiverFBref = 'attendeeWaiver'
        } else if (type === 'Volunteer') {
          this.waiverFBref = 'volunteerWaiver'
        } else {
          this.waiverFBref = 'mentorWaiver'
        }
      },
      fileChange(e) {
        console.log(e.target.files)
        if (e.target.files.length === 1) {
          this.uploading = true;
          this.isInitial = false;
          const fileName = e.target.files[0].name
          this.$firebase.storage().ref('/public/').child(fileName).put(e.target.files[0]).then(e => {
            console.log(e, 'uploaded')
            const uploadedAt = Date.now()
            const type = e.metadata.contentType

            this.$firebase.storage().ref('/public/').child(fileName).getDownloadURL().then(downloadURL => {
              const waiverData = {
                download: downloadURL,
                uploaded: uploadedAt,
                type: type
              }
              console.log(waiverData)
              this.$firebase.firestore().collection('publicRefs').doc(this.waiverFBref).set(waiverData).then(e => {
                console.log(e)
                this[this.waiverFBref] = waiverData
                this.uploading = false
                this.uploader = false
                this.$swal({title: "Success!", text: "Blank waiver has been uploaded", icon: "success"})
              })
            })

          })
        }
      },
      timeStamp(time) {
        // console.log(time)
        return this.$moment(time).format('H:mm MMM Do, YYYY')
      },
      deleteTicket() {
        this.$store.dispatch('updateTicket', {id: this.editTicketData.id, name: false})
        this.modal = false;


      },
      closeModal: function () {
       // console.log(this.modal, this.preventTicketUpdate)
        if (this.modal && !this.preventTicketUpdate) {
          this.modal = false
        }
      },
      closeUploader: function () {
        console.log(this.uploader)
        if (this.uploader) {
          this.uploader = false
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
       // console.log(this.editTicketData, this.preventTicketUpdate, 'data to update')
        this.preventTicketUpdate = false
        this.$store.dispatch('updateTicket', this.editTicketData)
        this.modal = false;


      },
      updateApiKey() {
        this.$firebase.firestore().collection('secrets').doc('apiKeyDashboard').get().then(doc => {
          this.apiKey = doc.data().key;
          this.loadingCounter++
          if (this.loadingCounter == this.loadingCount) {
            this.$parent.loading = false
          }
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

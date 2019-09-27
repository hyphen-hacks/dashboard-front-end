<template>
  <main class="developer">
    <loader v-if="attendeeEmails.length < 1"></loader>
    <div v-if="downloading" class="downloading">
      <h1>Downloading, Please Don't Close this Window</h1>
      <h2>{{downloadingText}}</h2>
      <p>This is very much a beta feature expect long load times. If something breaks please immediately email Ronan @
        <a class="link" href="mailto:ronan.furuta@hyphen-hacks.com">ronan.furuta@hyphen-hacks.com</a></p>
    </div>
    <div class="card--light">
      <h1 class="card__heading">Download Completed Waivers</h1>
      <br>
      <p>This is still very much a beta feature expect long load times. If something breaks please immediately email
        Ronan @
        <a class="link" href="mailto:ronan.furuta@hyphen-hacks.com">ronan.furuta@hyphen-hacks.com</a></p>
      <button class="btn" @click="downloadWaiversVTwo">Download</button>
    </div>
    <h1 class="pageHeading">Emails</h1>
    <p class="pageDesc">Welcome to the emails page. The emails on this page are updated in realtime from each of their
      respected ticket
      types. <br><b class="red">Please try to not use these emails. Instead, ask Ronan to send "branded" emails from
        Sendgrid</b></p>
    <div class="card--light">
      <h1 class="card__heading">Mentor Emails <span class="secondaryHeading">({{mentorEmails.length}})</span></h1>

      <input id="mentorEmails" class="emails__input input copy" v-model="mentorEmails.text" readonly
             data-clipboard-target="#mentorEmails">
      <label class="emails__desc copy" for="mentorEmails" data-clipboard-target="#mentorEmails">Click To Copy</label>


    </div>
    <div class="card--light">
      <h1 class="card__heading">Volunteer Emails <span class="secondaryHeading">({{volunteerEmails.length}})</span></h1>
      <input id="volunteerEmails" class="emails__input input copy" readonly v-model="volunteerEmails.text"
             data-clipboard-target="#volunteerEmails">
      <label class="emails__desc copy" for="volunteerEmails" data-clipboard-target="#volunteerEmails">Click To
        Copy</label>
    </div>
    <div class="card--light">
      <h1 class="card__heading">Attendee Emails <span class="secondaryHeading">({{attendeeEmails.length}})</span></h1>
      <input id="attendeeEmails" class="emails__input input copy" readonly v-model="attendeeEmails.text"
             data-clipboard-target="#attendeeEmails">
      <label class="emails__desc copy" for="attendeeEmails" data-clipboard-target="#attendeeEmails">Click To
        Copy</label>
    </div>
    <div class="card--light">
      <h1 class="card__heading">All Emails <span class="secondaryHeading">({{allEmails.length}})</span></h1>
      <input id="allEmails" class="emails__input input copy" readonly v-model="allEmails.text"
             data-clipboard-target="#allEmails">
      <label class="emails__desc copy" for="allEmails" data-clipboard-target="#allEmails">Click To
        Copy</label>
    </div>
  </main>
</template>

<script>
  import CryptoJS from 'crypto-js'
  import Chart from 'chart.js'
  import moment from 'moment'
  import loader from '../components/loader'
  import draggable from 'vuedraggable'

  import DataStorage from '../dataStorage.js'
  import chart from '../components/chart.vue'
  import ClipboardJS from 'clipboard'

  Chart.defaults.global.defaultFontColor = "#fff";

  export default {
    name: 'emails',
    components: {chart, loader, draggable},

    data() {
      return {
        loadingData: true,
        downloading: false,
        md5Hash: '',
        downloadingText: 'Initializing Download Process...'
      }
    },
    mounted() {
      this.$firebase.firestore().collection('secrets').doc('apiKeyDashboard').get().then(doc => {
        this.$parent.apiKey = doc.data().key;
      })
      new ClipboardJS('.copy');

    },
    methods: {
      download(i, downloadInfo) {
        let element = document.createElement('a');
        element.setAttribute('href', i);
        element.setAttribute('download', 'completedWaivers.zip');
        element.setAttribute('target', '_blank');
        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
        this.$swal({
          title: "SUCCESS",
          text: `Waivers are being downloaded. Make sure you allow popups. MD5 Hash: ${downloadInfo.md5Hash}`,
          icon: "success",
          dangerMode: true,
        })
      },
      downloadWaivers() {
        this.downloading = true;
        fetch('https://api.hyphen-hacks.com/api/v2/getCompletedWaivers', {
          headers: {
            authorization: this.$parent.apiKey
          }
        }).then(res => res.json()).then(res => {
          //console.log(res)
          this.$firebase.storage().ref('private/completedWaivers.zip').getDownloadURL().then(i => {
            this.download(i)
            this.downloading = false;
          })

        })
      },
      downloadWaiversVTwo() {
        this.downloading = true;
        fetch('https://api.hyphen-hacks.com/api/v3/getCompletedWaivers', {
          headers: {
            authorization: this.$parent.apiKey
          }
        }).then(res => {
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let process = (result) => {
            if (result.done) return;
            const text = decoder.decode(result.value, {stream: true});
            console.log(text);
            let jsonResult
            try {
              jsonResult = JSON.parse(text)
            } catch {
              let arrayJSON = text.split('}')
              let lastStatement = arrayJSON[arrayJSON.length - 2] + "}"
              console.log(arrayJSON, lastStatement)
              jsonResult = JSON.parse(lastStatement)
            }
            if (jsonResult.error) {
              this.downloading = false
              this.$swal({
                title: "ERROR",
                text: `Error downloading waivers ${jsonResult.error}`,
                icon: "warning",
                dangerMode: true,
              })
              return;
            }
            if (jsonResult.status) {
              console.log(jsonResult.status)
              this.downloadingText = jsonResult.status
            }
            if (jsonResult.success) {
              this.downloadingText = 'Getting Download Reference'
              this.$firebase.storage().ref('private/completedWaivers.zip').getDownloadURL().then(i => {
                this.download(i, jsonResult.uploaded)
                this.downloading = false;
              })
            }


            return reader.read().then(process);
          }
          reader.read().then(process).then(() => {
            console.log('All done!');
          });
        }).catch(e => {
          this.downloading = false
          console.log(e)
          this.$swal({
            title: "ERROR",
            text: "Error downloading waivers",
            icon: "warning",
            dangerMode: true,
          })
        })
      },

      copy(id) {
        console.log('coppying')
        let elm = document.getElementById(id)
        elm.select();
        elm.setSelectionRange(0, 99999)
        document.execCommand("copy");
      }
    },
    computed: {
      roster() {
        let roster = []
        Object.keys(this.$store.state.roster).forEach(i => roster.push(this.$store.state.roster[i]))
        return roster
      },
      allEmails() {
        if (this.roster) {


          let mapped = this.roster.map(a => {
            return a.profile.email
          })
          //console.log(mentors, mapped)
          return {text: mapped.toString(), length: mapped.length}
        } else {
          return {text: null, length: -1}
        }

      },
      mentorEmails() {
        if (this.roster) {

          let mentors = this.roster.filter(i => {
            return i.ticket_class_id == '111414717'
          })

          let mapped = mentors.map(a => {
            return a.profile.email
          })
          //console.log(mentors, mapped)
          return {text: mapped.toString(), length: mapped.length}
        } else {
          return {text: null, length: -1}
        }

      },
      volunteerEmails() {
        if (this.roster) {

          let mentors = this.roster.filter(i => {
            return i.ticket_class_name == 'volunteer'
          })

          let mapped = mentors.map(a => {
            return a.profile.email
          })
          // console.log(mentors, mapped)
          return {text: mapped.toString(), length: mapped.length}
        } else {
          return {text: null, length: -1}
        }

      },
      attendeeEmails() {
        if (this.roster) {

          let mentors = this.roster.filter(i => {
            return i.ticket_class_id == '111244170'
          })

          let mapped = mentors.map(a => {
            return a.profile.email
          })
          // console.log(mentors, mapped)
          this.loadingData = false
          return {text: mapped.toString(), length: mapped.length}
        } else {
          return {text: null, length: -1}
        }

      }
    },


  }
</script>

<template>
  <button @click="$parent.editTicket(ticket)" class="ticket__edit">
    <p>Edit</p>
  </button>
</template>
<script>
  export default {
    "name": 'edit-button',
   props: [
     'ticket'
   ]
  }
</script>
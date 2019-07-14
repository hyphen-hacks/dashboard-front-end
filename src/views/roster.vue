<template>
  <main class="roster">
    <div class="roster__people">
      <nav class="people__nav">
        <p class="nav__name">Name</p>
        <p class="nav__role">Role</p>
        <p class="nav__school">School/Work</p>
        <p class="nav__waiver">Waiver</p>
        <p class="nav__checkedIn">Checked In</p>
        <p class="nav__onCampus">On Campus</p>
      </nav>
      <div class="person">
        <p class="person__name">Ronan Furuta</p>
        <p class="person__role">Mentor</p>
        <p class="person__school">Lick-Wilmerding HS</p>
        <p class="person__waiver">Accepted</p>
        <div class="person__checkedIn"></div>
        <div class="person__onCampus"></div>
      </div>
    </div>
    <div class="roster__info">
      <div class="info__nameRow">
        <div class="nameRow__nameContainer">
          <h1 class="nameRow__name">Ronan Furuta</h1>
          <p class="nameRow__school">Lick Wilmerding HS, 2022</p>
        </div>
        <p class="nameRow__role">Mentor</p>
      </div>
      <div class="info__statusButtons">
        <button class="statusButtons__checkmark">Checked In <span class="checkmark__mark"></span></button>
        <button class="statusButtons__checkmark">On Campus <span class="checkmark__mark"></span></button>
        <p class="statusButtons__waiverStatus">Waiver Status: <span class="green">Accepted</span></p>
      </div>
    </div>
  </main>
</template>

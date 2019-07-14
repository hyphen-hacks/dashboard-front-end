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
      <div class="info__contact">
        <p class="info__data">Email: <a href="mailto:rsf.sho@gmail.com" class="info__data__value">rsf.sho@gmail.com</a>
        </p>
        <p class="info__data">Phone: <a class="info__data__value" href="tel:5104092752">(510) 409-2752</a></p>
        <p class="info__data">Address: <span class="info__data__value">755 Ocean Ave, San Francisco</span></p>
      </div>
      <details class="info__card">
        <summary>Demographics</summary>
        <p class="info__data">Race/Ethnicity: <span class="info__data__value">Asian or Asian American</span></p>
        <p class="info__data">Gender: <span class="info__data__value">Male</span></p>
        <p class="info__data">Food Allergies: <span class="info__data__value">None</span></p>
        <p class="info__data">Dietary Restrictions: <span class="info__data__value">None</span></p>
        <p class="info__data">Special Needs: <span class="info__data__value">None</span></p>
      </details>
      <details class="info__card">
        <summary>Profile</summary>
        <p class="info__data">Why are you attending Hyphen-Hacks:</p>
        <p class="info__data__value">Sam told me I would get free candy, I didn't</p>
        <p class="info__data">Why are you attending Hyphen-Hacks:</p>
        <p class="info__data__value">Sam told me I would get free candy, I didn't</p>
      </details>
    </div>
  </main>
</template>

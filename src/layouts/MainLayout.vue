<template>
  <q-layout view="lHh Lpr lFf">
    <q-header bordered class="bg-blue-grey-10 text-white shadow-10">
      <q-toolbar>
        <q-toolbar-title class="text-center">
          <q-avatar>
            <img src="/src/assets/varandao-logo.png" />
          </q-avatar>
          Varandão BBQ
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-btn to="/" no-caps>
      <q-footer bordered class="bg-red text-white shadow-10">
        <q-toolbar class="justify-center"> Sair </q-toolbar>
      </q-footer>
    </q-btn>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts"></script>

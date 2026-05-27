<template>
  <div style="font-family: sans-serif; padding: 1rem">
    <nav style="margin-bottom: 1rem; display: flex; gap: 0.5rem">
      <router-link to="/editor">Editor</router-link>
      <router-link to="/editor-empty">Empty</router-link>
      <router-link to="/editor-selected">Pre-selected</router-link>
    </nav>
    <router-view />
  </div>
</template>

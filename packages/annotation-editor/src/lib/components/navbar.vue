<template>
  <div class="flex gap-1 py-1">
    <template
      v-for="item in actions"
      :key="item.label"
    >
      <div
        v-if="item.children?.length"
        class="dropdown"
      >
        <div
          tabindex="0"
          role="button"
          class="btn btn-sm btn-ghost tooltip tooltip-bottom"
          :class="{ 'btn-disabled': item.disabled }"
          :data-tip="item.label"
        >
          <Icon
            :icon="item.icon"
            size="sm"
          />
        </div>
        <ul
          tabindex="0"
          class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm z-20"
        >
          <li
            v-for="child in item.children"
            :key="child.label"
            :class="{ 'btn-disabled': item.disabled }"
          >
            <a @click="closeDropdown(child)">{{ child.label }}</a>
          </li>
        </ul>
      </div>

      <div
        v-else
        class="tooltip tooltip-bottom"
        :data-tip="item.label"
      >
        <button
          class="btn btn-sm btn-ghost"
          :class="{ 'btn-disabled': item.disabled }"
          :disabled="item.disabled"
          @click="onAction(item)"
        >
          <Icon
            :icon="item.icon"
            size="sm"
          />
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@ghentcdh/ui';
import { NavbarProperties, type NavbarAction, type NavbarChildAction } from './navbar.properties';

defineProps(NavbarProperties);

const onAction = (action: NavbarAction | NavbarChildAction) => {
  if (action.disabled) return;
  action.action?.();
};

const closeDropdown = (action: NavbarAction | NavbarChildAction) => {
  onAction(action);
  (document.activeElement as HTMLElement)?.blur();
};
</script>

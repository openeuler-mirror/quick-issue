<script lang="ts" setup>
import { computed } from 'vue';

import AppPull from '@/components/AppPull.vue';
import AppContent from '@/components/AppContent.vue';
import DocAnchor from '@/components/DocAnchor.vue';

import { useStoreData } from '@/shared/login';
import { ISSUE_TYPE } from '@/shared/issue-type';

import { hiddenMail } from '@/shared/utils';

const { guardAuthClient } = useStoreData();

const isPersonalShown = computed(() => {
  return (
    (guardAuthClient.value?.identities &&
      guardAuthClient.value?.identities[0]?.login_name) ||
    guardAuthClient.value?.email
  );
});

function getNameList(arr: any) {
  try {
    const giteeName = arr?.filter((item: any) => {
      return item.identity === 'gitee';
    })[0]?.login_name;
    if (giteeName) {
      return giteeName;
    }
  } catch (error) {
    return false;
  }
}
</script>
<template>
  <div class="issues">
    <AppContent>
      <DocAnchor v-if="isPersonalShown" />
      <AppPull
        v-if="isPersonalShown"
        :issue-type="ISSUE_TYPE.PENDING"
        :user-name="
          getNameList(guardAuthClient?.identities) ||
          hiddenMail(guardAuthClient?.email)
        "
      />
      <AppPull
        v-if="isPersonalShown"
        :issue-type="ISSUE_TYPE.SUBMITTED"
        :user-name="
          getNameList(guardAuthClient?.identities) ||
          hiddenMail(guardAuthClient?.email)
        "
      />

      <AppPull
        :user-name="
          getNameList(guardAuthClient?.identities) ||
          hiddenMail(guardAuthClient?.email)
        "
        :issue-type="ISSUE_TYPE.ALL"
      />
    </AppContent>
  </div>
</template>

<style scoped lang="scss">
:deep(.app-content) {
  @media screen and (max-width: 1620px) {
    width: calc(100% - 48px);
  }
}
</style>

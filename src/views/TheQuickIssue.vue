<script lang="ts" setup>
import AppIssue from '@/components/AppIssue.vue';
import AppContent from '@/components/AppContent.vue';
import DocAnchor from '@/components/DocAnchor.vue';
import { useStoreData } from '@/shared/login';

const { guardAuthClient } = useStoreData();

function getNameList(arr: any) {
  const targetArr: any = [];
  arr.forEach((item: any) => {
    targetArr.push(item.login_name);
  });
  return targetArr.join(',');
}
</script>
<template>
  <div class="issues">
    <AppContent>
      <DocAnchor
        v-if="
          (guardAuthClient?.identities &&
            guardAuthClient?.identities[0]?.login_name) ||
          guardAuthClient?.email
        "
      />
      <AppIssue
        v-if="
          (guardAuthClient?.identities &&
            guardAuthClient?.identities[0]?.login_name) ||
          guardAuthClient?.email
        "
        issue-type="pending"
        :user-name="
          `${getNameList(guardAuthClient?.identities)}` ||
          guardAuthClient?.email
        "
      />
      <AppIssue
        v-if="
          (guardAuthClient?.identities &&
            guardAuthClient?.identities[0]?.login_name) ||
          guardAuthClient?.email
        "
        issue-type="submitted"
        :user-name="
          `${getNameList(guardAuthClient?.identities)}` ||
          guardAuthClient?.email
        "
      />

      <AppIssue
        :user-name="
          (guardAuthClient?.identities &&
            guardAuthClient?.identities[0]?.login_name) ||
          guardAuthClient?.email
        "
        issue-type="all"
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

<script setup lang="ts">
import { ref, reactive, onMounted, watch, CSSProperties, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { debounce } from 'lodash-es';

import { useLangStore } from '@/stores';
import ISSUE_CONFIG from '@/data/quick-issue/quick-issue';
import { getPrSelectOption, getRepoPull } from '@/api/api-quick-issue';
import { OptionList } from '@/shared/@types/type-quick-issue';
import { isValidKey, scrollToTop } from '@/shared/utils';
import { useLabelColor } from '@/stores/index';

import IconTraingleUp from '~icons/app/icon-arrow-traingle-up.svg';
import IconTraingleDown from '~icons/app/icon-arrow-traingle-down.svg';
import IconFilter from '~icons/app/icon-filter.svg';
import IconTag from '~icons/app/icon-tag';
import IconRefresh from '~icons/app/icon-refresh';

import AppContent from '@/components/AppContent.vue';
import ODropdown from 'opendesign/dropdown/ODropdown.vue';
import OIcon from 'opendesign/icon/OIcon.vue';

const { t } = useI18n();
const labelColor = useLabelColor();
const isShowLabel = ref(false);
const inputValue = ref('');
const optionValue = ref('');
const openDropDown = ref('');
const isOpen = ref(false);
const issueData = ref([]);
const total = ref(0);
const currentPage = ref(1);
const totalPage = ref(0);
const layout = ref('sizes, prev, pager, next, slot, jumper');

const lang = computed(() => {
  return useLangStore().lang;
});
const keyArr = [
  'authorsList',
  'assigneesList',
  'labelsList',
  'exLabelsList',
  'refsList',
  'reposList',
  'sigsList',
];

const filterList = ref(new Map());
// 构造筛选条件数组
for (let i = 0; i < keyArr.length; i++) {
  filterList.value.set(keyArr[i], { page: 1, total: 0, keyword: '', data: [] });
}

const queryData = reactive({
  page: 1,
  per_page: 10,
  search: '',
  sig: '',
  state: [],
  direction: 'desc',
  create: '',
  author: '',
  sort: 'created_at',
  assignee: '',
  label: [],
  exclusion: [],
  ref: '',
  repo: '',
});

const activeSig = computed(() => {
  return queryData.sig;
});

const optionQuery = reactive({
  page: 1,
  per_page: 40,
  keyword: '',
  sig: activeSig,
});

const handleSizeChange = (val: number) => {
  queryData.per_page = val;
  totalPage.value = Math.ceil(total.value / val);
};

const handleCurrentChange = (val: number) => {
  scrollToTop();
  queryData.page = val;
  currentPage.value = val;
};

function searchValchange() {
  queryData.search = inputValue.value;
}

const valueChangeDebounced = debounce(
  (val) => {
    if (val !== optionQuery.keyword) {
      filterList.value.get(`${openDropDown.value}List`).data = [];
      filterList.value.get(`${openDropDown.value}List`).page = 1;
      optionQuery.keyword = val;
      optionQuery.page = 1;
    }
  },
  500,
  {
    trailing: true,
  }
);
function getRepoIssueData() {
  getRepoPull(queryData).then((res) => {
    if (res.data) {
      total.value = res.total;
      issueData.value = res.data;
      totalPage.value = Math.ceil(total.value / queryData.per_page);
    } else {
      total.value = 0;
      issueData.value = [];
    }
  });
}
function handleCommand(command: string | Array<string>, key: string) {
  if (isValidKey(key, queryData)) {
    (queryData as any)[key] = command;
  }
}
function getLabelColor(label: string) {
  const result: CSSProperties = {};
  result.color = `#${
    labelColor?.labelColor?.find((item) => {
      return item.name === label;
    })?.color
  }`;
  return result;
}
function getNextPage() {
  // page * per_page 大于 totle 不再请求
  filterList.value.get(`${openDropDown.value}List`).total >
  filterList.value.get(`${openDropDown.value}List`).page * optionQuery.per_page
    ? (optionQuery.page = ++filterList.value.get(`${openDropDown.value}List`)
        .page)
    : '';
}

function visibleChange(stash: boolean, type: string) {
  isOpen.value = stash;
  if (!stash) {
    optionQuery.page = 1;
    optionQuery.keyword = '';
    optionValue.value = '';
    openDropDown.value = '';
  } else {
    openDropDown.value = type;
    filterList.value.get(`${openDropDown.value}List`).page;
    if (filterList.value.get(`${openDropDown.value}List`).keyword) {
      filterList.value.get(`${openDropDown.value}List`).data = [];
      optionQuery.keyword = filterList.value.get(
        `${openDropDown.value}List`
      ).keyword;
    }
    // SIG 与仓库级联
    if (type === 'repos' && queryData.sig && !queryData.repo) {
      filterList.value.get('reposList').data = [];
      // 手动触发
      if (optionQuery.sig === queryData.sig) {
        optionQuery.page = 1;
        filterList.value.get(`${openDropDown.value}List`).page = 1;
        getOption(openDropDown.value);
      } else {
        optionQuery.sig = queryData.sig;
      }
    }
  }
}
function stateChange(state: string) {
  return ISSUE_CONFIG.PR_STATE.find((item) => {
    return item.VALUE === state;
  })?.TEXT;
}

function sortClick(sort: string) {
  if (queryData.sort === sort) {
    queryData.direction === 'desc'
      ? (queryData.direction = 'asc')
      : (queryData.direction = 'desc');
  }
  queryData.sort = sort;
}
function labelClick() {
  getOption('exLabels');
  isShowLabel.value = true;
}
function getOption(type: string) {
  getPrSelectOption(type, optionQuery)
    .then((res: OptionList) => {
      filterList.value.get(`${type}List`).data = [
        ...filterList.value.get(`${type}List`).data,
        ...res.data,
      ];
      filterList.value.get(`${type}List`).total = res.total;
    })
    .catch((err: any) => {
      throw new Error(err);
    });
}

onMounted(() => {
  getRepoIssueData();
  getOption('authors');
  getOption('assignees');
  getOption('labels');
  getOption('refs');
  getOption('repos');
  getOption('sigs');
});

watch(
  () => queryData,
  () => {
    getRepoIssueData();
  },
  {
    deep: true,
  }
);
watch(
  () => optionQuery,
  () => {
    if (isOpen.value) {
      getOption(openDropDown.value);
    }
  },
  {
    deep: true,
  }
);
</script>

<template>
  <AppContent>
    <div class="input-container">
      <OSearch
        v-model="inputValue"
        :placeholder="t('quickIssue.PLACEHOLDER_PR')"
        @change="searchValchange"
      ></OSearch>
    </div>
    <OTable
      class="quick-issue-table"
      :class="lang === 'en' ? 'en-table' : ''"
      :data="issueData"
      style="width: 100%"
    >
      <el-table-column width="150">
        <template #header>
          <span :class="queryData.sig ? 'active' : ''">{{
            queryData.sig || 'SIG'
          }}</span>

          <ODropdown
            :max-height="250"
            :listener-scorll="true"
            @scorll-bottom="getNextPage"
            @command="(val:string) => handleCommand(val, 'sig')"
            @visible-change="(val:boolean) => visibleChange(val, 'sigs')"
          >
            <OIcon class="filter-icon" :class="queryData.sig ? 'active' : ''">
              <IconFilter></IconFilter>
            </OIcon>

            <template #dropdown>
              <div class="search-box">
                <ODropdownItem v-if="queryData.sig" :command="''">{{
                  t('quickIssue.CANCEL')
                }}</ODropdownItem>
                <OSearch
                  v-model="filterList.get('sigsList').keyword"
                  :placeholder="t('quickIssue.SEARCH_PLACEHOLDER')"
                  @input="valueChangeDebounced"
                ></OSearch>
              </div>
              <ul v-if="filterList.get('sigsList').data.length">
                <ODropdownItem
                  v-for="item in filterList.get('sigsList').data"
                  :key="item"
                  :command="item"
                  :class="queryData.sig === item ? 'is-active' : ''"
                  >{{ item }}</ODropdownItem
                >
              </ul>
              <ODropdownItem v-else disabled class="empty-option"
                >No Data</ODropdownItem
              >
            </template>
          </ODropdown>
        </template>
        <template #default="scope">
          <span class="detail-page">
            {{ scope.row.sig }}
          </span>
        </template>
      </el-table-column>
      <el-table-column width="150">
        <template #header>
          <span :class="queryData.repo ? 'active' : ''">{{
            queryData.repo || t('quickIssue.REPO_NAME')
          }}</span>
          <ODropdown
            :max-height="250"
            :listener-scorll="true"
            @scorll-bottom="getNextPage"
            @command="(val:string) => handleCommand(val, 'repo')"
            @visible-change="(val:boolean) => visibleChange(val, 'repos')"
          >
            <OIcon class="filter-icon" :class="queryData.repo ? 'active' : ''">
              <IconFilter></IconFilter>
            </OIcon>

            <template #dropdown>
              <div class="search-box">
                <ODropdownItem v-if="queryData.repo" :command="''">{{
                  t('quickIssue.CANCEL')
                }}</ODropdownItem>
                <OSearch
                  v-model="filterList.get('reposList').keyword"
                  :placeholder="t('quickIssue.SEARCH_PLACEHOLDER')"
                  @input="valueChangeDebounced"
                ></OSearch>
              </div>
              <ul v-if="filterList.get('reposList').data.length">
                <ODropdownItem
                  v-for="item in filterList.get('reposList').data"
                  :key="item"
                  :command="item"
                  :class="queryData.repo === item ? 'is-active' : ''"
                  >{{ item }}</ODropdownItem
                >
              </ul>
              <ODropdownItem v-else disabled class="empty-option"
                >No Data</ODropdownItem
              >
            </template>
          </ODropdown>
        </template>
        <template #default="scope">
          <span class="detail-page">
            {{ scope.row.repo }}
          </span>
        </template>
      </el-table-column>
      <el-table-column>
        <template #header>
          <span>{{ t('quickIssue.TITLE') }}</span>
        </template>
        <template #default="scope">
          <span class="detail-page">
            <a :href="scope.row.link" target="_blank">{{ scope.row.title }}</a>
          </span>
        </template>
      </el-table-column>
      <el-table-column width="100">
        <template #header>
          <span :class="queryData.ref ? 'active' : ''">{{
            queryData.ref || t('quickIssue.BRANCH')
          }}</span>

          <ODropdown
            :max-height="250"
            :listener-scorll="true"
            @scorll-bottom="getNextPage"
            @command="(val:string) => handleCommand(val, 'ref')"
            @visible-change="(val:boolean) => visibleChange(val, 'refs')"
          >
            <OIcon class="filter-icon" :class="queryData.ref ? 'active' : ''">
              <IconFilter></IconFilter>
            </OIcon>
            <template #dropdown>
              <div class="search-box">
                <ODropdownItem v-if="queryData.ref" :command="''">{{
                  t('quickIssue.CANCEL')
                }}</ODropdownItem>
                <OSearch
                  v-model="filterList.get('refsList').keyword"
                  :placeholder="t('quickIssue.SEARCH_PLACEHOLDER')"
                  @input="valueChangeDebounced"
                ></OSearch>
              </div>
              <ul v-if="filterList.get('refsList').data.length">
                <ODropdownItem
                  v-for="item in filterList.get('refsList').data"
                  :key="item"
                  :command="item"
                  :class="queryData.ref === item ? 'is-active' : ''"
                  >{{ item }}</ODropdownItem
                >
              </ul>
              <ODropdownItem v-else disabled class="empty-option"
                >No Data</ODropdownItem
              >
            </template>
          </ODropdown>
        </template>
        <template #default="scope">
          <span class="detail-page">
            {{ scope.row.ref }}
          </span>
        </template>
      </el-table-column>
      <el-table-column width="100">
        <template #header>
          <span :class="queryData.state.length ? 'active' : ''">
            <template v-if="queryData.state.length">
              <span v-for="item in queryData.state" :key="item">
                {{ stateChange(item) }}
              </span>
            </template>
            <template v-else>
              {{ t('quickIssue.STATE') }}
            </template>
          </span>
          <ODropdown
            :max-height="250"
            @command="(val:string) => handleCommand(val, 'state')"
          >
            <OIcon
              class="filter-icon"
              :class="queryData.state.length ? 'active' : ''"
            >
              <IconFilter></IconFilter>
            </OIcon>
            <template #dropdown>
              <el-dropdown-menu>
                <OCheckboxGroup v-model="queryData.state">
                  <OCheckbox
                    v-for="item in ISSUE_CONFIG.PR_STATE"
                    :key="item.VALUE"
                    :value="item.VALUE"
                  >
                    {{ item.TEXT }}
                  </OCheckbox>
                </OCheckboxGroup>
              </el-dropdown-menu>
            </template>
          </ODropdown>
        </template>
        <template #default="scope">
          <span class="detail-page">
            {{ stateChange(scope.row.state) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column width="130">
        <template #header>
          <span :class="queryData.author ? 'active' : ''">{{
            queryData.author || t('quickIssue.SUBMITTER')
          }}</span>

          <ODropdown
            :max-height="250"
            :listener-scorll="true"
            @scorll-bottom="getNextPage"
            @command="(val:string) => handleCommand(val, 'author')"
            @visible-change="(val:boolean) => visibleChange(val, 'authors')"
          >
            <OIcon
              class="filter-icon"
              :class="queryData.author ? 'active' : ''"
            >
              <IconFilter></IconFilter>
            </OIcon>

            <template #dropdown>
              <div class="search-box">
                <ODropdownItem v-if="queryData.author" :command="''">{{
                  t('quickIssue.CANCEL')
                }}</ODropdownItem>
                <OSearch
                  v-model="filterList.get('authorsList').keyword"
                  :placeholder="t('quickIssue.SEARCH_PLACEHOLDER')"
                  @input="valueChangeDebounced"
                ></OSearch>
              </div>
              <ul v-if="filterList.get('authorsList').data.length">
                <ODropdownItem
                  v-for="item in filterList.get('authorsList').data"
                  :key="item"
                  :command="item"
                  :class="queryData.author === item ? 'is-active' : ''"
                  >{{ item }}</ODropdownItem
                >
              </ul>
              <ODropdownItem v-else disabled class="empty-option"
                >No Data</ODropdownItem
              >
            </template>
          </ODropdown>
        </template>
        <template #default="scope">
          <span class="detail-page">
            <a
              :key="scope.row.author"
              :href="`https://gitee.com/${scope.row.author}`"
              :title="scope.row.author"
              target="_blank"
            >
              {{ scope.row.author }}
            </a>
          </span>
        </template>
      </el-table-column>
      <el-table-column width="130">
        <template #header>
          <span :class="queryData.assignee ? 'active' : ''">{{
            queryData.assignee || t('quickIssue.ASSIGNER')
          }}</span>

          <ODropdown
            :max-height="250"
            :listener-scorll="true"
            @scorll-bottom="getNextPage"
            @command="(val:string) => handleCommand(val, 'assignee')"
            @visible-change="(val:boolean) => visibleChange(val, 'assignees')"
          >
            <OIcon
              class="filter-icon"
              :class="queryData.assignee ? 'active' : ''"
            >
              <IconFilter></IconFilter>
            </OIcon>
            <template #dropdown>
              <div class="search-box">
                <ODropdownItem v-if="queryData.assignee" :command="''">{{
                  t('quickIssue.CANCEL')
                }}</ODropdownItem>
                <OSearch
                  v-model="filterList.get('assigneesList').keyword"
                  :placeholder="t('quickIssue.SEARCH_PLACEHOLDER')"
                  @input="valueChangeDebounced"
                ></OSearch>
              </div>
              <ul v-if="filterList.get('assigneesList').data.length">
                <ODropdownItem
                  v-for="item in filterList.get('assigneesList').data"
                  :key="item"
                  :command="item"
                  :class="queryData.assignee === item ? 'is-active' : ''"
                  >{{ item }}</ODropdownItem
                >
              </ul>
              <ODropdownItem v-else disabled class="empty-option"
                >No Data</ODropdownItem
              >
            </template>
          </ODropdown>
        </template>
        <template #default="scope">
          <span class="detail-page">
            <a
              v-for="item in scope.row.assignees?.split(',')"
              :key="item"
              :href="`https://gitee.com/${item}`"
              :class="item === queryData.assignee ? 'active' : ''"
              :title="item"
              class="link"
              target="_blank"
            >
              {{ item }}
            </a>
          </span>
        </template>
      </el-table-column>
      <el-table-column width="200">
        <template #header>
          <div
            class="filter-box"
            :class="
              queryData.label.length || queryData.exclusion.length
                ? 'active'
                : ''
            "
          >
            <p v-if="queryData.label.length || queryData.exclusion.length">
              <span class="label-title" :title="queryData.label.join(',')">{{
                queryData.label.join(',')
              }}</span>
              <span
                class="label-title label-exclusion"
                :title="queryData.exclusion.join(',')"
                >{{ queryData.exclusion.join(',') }}</span
              >
            </p>
            <span v-else>{{ t('quickIssue.LABEL') }}</span>
          </div>
          <OIcon
            class="filter-icon"
            :class="queryData.label.length ? 'active' : ''"
            @click="labelClick()"
          >
            <IconFilter></IconFilter>
          </OIcon>
        </template>
        <template #default="scope">
          <span class="detail-page">
            <p
              v-for="item in scope.row.labels?.split(',')"
              :key="item"
              :title="item"
              :style="getLabelColor(item)"
            >
              <OIcon v-if="item">
                <IconTag></IconTag>
              </OIcon>
              {{ item }}
            </p>
          </span>
        </template>
      </el-table-column>
      <el-table-column width="120">
        <template #header>
          <span>{{ t('quickIssue.CREATED_AT') }}</span>
          <div class="sort-time" @click="sortClick('created_at')">
            <OIcon
              class="icon-up"
              :class="
                queryData.direction === 'asc' && queryData.sort === 'created_at'
                  ? 'slot-active'
                  : ''
              "
            >
              <IconTraingleUp></IconTraingleUp>
            </OIcon>
            <OIcon
              class="icon-down"
              :class="
                queryData.direction === 'desc' &&
                queryData.sort === 'created_at'
                  ? 'slot-active'
                  : ''
              "
            >
              <IconTraingleDown></IconTraingleDown>
            </OIcon>
          </div>
        </template>
        <template #default="scope">
          <span class="detail-page">
            <p>{{ scope.row.created_at?.split(' ')[0] }}</p>
            <p>{{ scope.row.created_at?.split(' ')[1] }}</p>
          </span>
        </template>
      </el-table-column>
      <el-table-column width="120">
        <template #header>
          <span>{{ t('quickIssue.UPDATE_AT') }}</span>
          <div class="sort-time" @click="sortClick('updated_at')">
            <OIcon
              class="icon-up"
              :class="
                queryData.direction === 'asc' && queryData.sort === 'updated_at'
                  ? 'slot-active'
                  : ''
              "
            >
              <IconTraingleUp></IconTraingleUp>
            </OIcon>
            <OIcon
              class="icon-down"
              :class="
                queryData.direction === 'desc' &&
                queryData.sort === 'updated_at'
                  ? 'slot-active'
                  : ''
              "
            >
              <IconTraingleDown></IconTraingleDown>
            </OIcon>
          </div>
        </template>
        <template #default="scope">
          <span class="detail-page">
            <p>{{ scope.row.updated_at?.split(' ')[0] }}</p>
            <p>{{ scope.row.updated_at?.split(' ')[1] }}</p>
          </span>
        </template>
      </el-table-column>
    </OTable>
    <OPagination
      v-model:page-size="queryData.per_page"
      v-model:currentPage="queryData.page"
      class="pagination"
      :page-sizes="[10, 20, 40, 80]"
      :layout="layout"
      :total="total"
      :background="true"
      :hide-on-single-page="true"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <span class="slot-content">{{ currentPage }}/{{ totalPage }}</span>
    </OPagination>
    <ODialog v-model="isShowLabel" :show-close="true" :lock-scroll="true">
      <h1 class="title">{{ t('quickIssue.LABEL') }}</h1>
      <div class="label-select">
        <span class="label">{{ t('quickIssue.SELECT_LABEL') }}</span>
        <OSelect
          v-model="queryData.label"
          multiple
          :placeholder="t('quickIssue.SELECT')"
          popper-class="remove-scrollbar"
          :listener-scorll="true"
          @scorll-bottom="getNextPage"
          @visible-change="(val:boolean) => visibleChange(val, 'labels')"
        >
          <OSearch
            v-model="filterList.get('labelsList').keyword"
            :placeholder="t('quickIssue.SEARCH_PLACEHOLDER')"
            style="padding: 0 8px"
            @input="valueChangeDebounced"
          ></OSearch>
          <el-scrollbar class="Escrollbar">
            <ElOption
              v-if="!filterList.get('labelsList').data.length"
              :key="''"
              :label="'no date'"
              :value="''"
              :disabled="true"
              style="text-align: center"
            />
            <ElOption
              v-for="item in filterList.get('labelsList').data"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-scrollbar>
        </OSelect>
        <OIcon class="icon-refresh" @click="queryData.label = []">
          <IconRefresh> </IconRefresh>
        </OIcon>
      </div>
      <p class="label-tip">{{ t('quickIssue.LABER_TIP') }}</p>
      <div class="label-select">
        <span class="label">{{ t('quickIssue.EXCLUDE') }}</span>
        <OSelect
          v-model="queryData.exclusion"
          multiple
          :placeholder="t('quickIssue.SELECT')"
          popper-class="remove-scrollbar"
          :listener-scorll="true"
          @scorll-bottom="getNextPage"
          @visible-change="(val:boolean) => visibleChange(val, 'exLabels')"
        >
          <OSearch
            v-model="filterList.get('exLabelsList').keyword"
            :placeholder="t('quickIssue.SEARCH_PLACEHOLDER')"
            style="padding: 0 8px"
            @input="valueChangeDebounced"
          ></OSearch>
          <ElOption
            v-if="!filterList.get('exLabelsList').data.length"
            :key="''"
            :label="'no date'"
            :value="''"
            :disabled="true"
            style="text-align: center"
          />
          <ElOption
            v-for="item in filterList.get('exLabelsList').data"
            :key="item"
            :label="item"
            :value="item"
          />
        </OSelect>
        <OIcon class="icon-refresh" @click="queryData.exclusion = []">
          <IconRefresh> </IconRefresh>
        </OIcon>
      </div>
      <p class="label-tip">{{ t('quickIssue.LABER_TIP1') }}</p>
    </ODialog>
  </AppContent>
</template>

<style lang="scss" scoped>
.el-popper.el-select__popper {
  --el-popper-border-radius: 0;
  .el-input {
    position: relative;
    padding: 0px 8px;
    position: sticky;
    top: 8px;
    background-color: var(--o-color-bg2);
    z-index: 1;
    &::before {
      position: absolute;
      content: '';
      height: 10px;
      width: 100%;
      top: -10px;
      left: 0;
      background-color: var(--o-color-bg2);
    }
  }
  .el-input__wrapper {
    padding: 0 32px 0 20px;
    box-shadow: 0 0 0 1px var(--o-color-border1) inset;
    &:hover {
      box-shadow: 0 0 0 1px var(--o-color-border1) inset;
    }
  }
}
.issue-btn {
  border-color: var(--o-color-white);
  color: var(--o-color-white);
  @media (max-width: 767px) {
    padding: 3px 16px;
    font-size: var(--o-font-size-text);
    line-height: var(--o-line-height-text);
  }
}
.active {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: var(--o-color-brand1);
  .label-title {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
  .label-exclusion {
    text-decoration: line-through;
  }
}
:deep(.quick-issue-table) {
  margin-top: var(--o-spacing-h2);
  tr {
    .cell {
      display: flex;
      align-items: center;
      .detail-page {
        p,
        .link {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          .o-icon {
            display: inline-block;
          }
        }
        .active {
          color: var(--o-color-warning1);
        }
      }
      .filter-icon {
        cursor: pointer;
        flex-shrink: 0;
        margin-left: 5px;
        color: var(--o-color-text1);
      }
      .select-icon {
        font-size: 24px;
      }
      .sort-time {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        color: #999;
        .icon-up {
          margin-bottom: -4px;
        }
        .icon-down {
          margin-top: -4px;
        }
        .slot-active {
          color: var(--o-color-text1);
        }
      }
    }
  }
}
:deep(.en-table) {
  thead {
    tr {
      .cell {
        font-size: 12px;
        .o-icon {
          font-size: 14px;
        }
      }
    }
  }
  tr {
    .cell {
      padding: 0 12px;
    }
  }
}
.input-container {
  @media screen and (max-width: 768px) {
    margin-bottom: var(--o-spacing-h5);
  }
  :deep(.o-search) {
    height: 48px;
    @media screen and (max-width: 768px) {
      height: 36px;
    }
  }
}
:deep(.pagination) {
  margin-top: var(--o-spacing-h2);
  .el-pager {
    .is-active {
      background-color: var(--o-color-brand2) !important;
    }
    .number:hover,
    .more:hover {
      background-color: var(--o-color-brand2);
    }
  }
  .slot-content {
    color: var(--o-color-white);
  }
}

.el-dropdown__popper {
  .o-dropdown-item:empty {
    display: none;
  }
  .o-checkbox-group {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }
  .o-checkbox {
    display: flex;
    align-items: center;
    margin: 5px 16px;
  }
  .el-checkbox {
    display: flex;
    align-items: center;
    margin: 5px 16px;
    height: 22px;

    :deep(.el-checkbox__label) {
      color: var(--o-color-text1);
    }
  }
}
</style>
<style lang="scss">
.o-dialog {
  max-width: 500px;
  width: 100%;
  border-radius: 0;
  .el-dialog__header {
    padding: 0;
    .el-dialog__headerbtn {
      top: var(--o-spacing-h4);
      right: var(--o-spacing-h4);
      font-size: var(--o-font-size-h5);
      width: fit-content;
      height: fit-content;
      z-index: 10;
      .el-dialog__close {
        color: var(--o-color-text1);
      }
    }
  }
  .el-dialog__body {
    padding: var(--o-spacing-h4);
    .title {
      font-weight: 500;
      line-height: var(--o-line-height-h8);
      font-size: var(--o-font-size-h8);
    }
    .label-select {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .label {
        margin-right: var(--o-spacing-h6);
        word-break: break-word;
        min-width: 58px;
      }
      .icon-refresh {
        cursor: pointer;
        margin-left: var(--o-spacing-h8);
        font-size: var(--o-font-size-h7);
        color: var(--o-color-text1);
      }
    }
    .label-tip {
      margin: 12px 0 0 68px;
      color: var(--o-color-brand1);
    }
    .label-select:nth-of-type(1) {
      margin-top: var(--o-spacing-h4);
    }
    .label-tip:nth-of-type(1) {
      margin-bottom: 24px;
    }
    .o-select {
      .el-input__wrapper {
        min-width: 350px;
        box-shadow: 0 0 0 1px var(--o-color-border1) inset;
        &:hover {
          box-shadow: 0 0 0 1px var(--o-color-border1) inset;
        }
        .o-icon {
          font-size: var(--o-font-size-h7);
        }
      }
    }
  }
}
</style>

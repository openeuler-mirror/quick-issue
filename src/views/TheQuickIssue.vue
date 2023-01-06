<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed, CSSProperties } from 'vue';
import { useI18n } from 'vue-i18n';
import { debounce } from 'lodash-es';
import { useLabelColor } from '@/stores/index';

import { useLangStore } from '@/stores';

import ISSUE_CONFIG from '@/data/quick-issue/quick-issue';
import {
  getRepoIssue,
  getIssueSelectOption,
  getReposData,
} from '@/api/api-quick-issue';
import { OptionList } from '@/shared/@types/type-quick-issue';

import { scrollToTop } from '@/shared/utils';

import IconTraingleUp from '~icons/app/icon-arrow-traingle-up.svg';
import IconTraingleDown from '~icons/app/icon-arrow-traingle-down.svg';
import IconFilter from '~icons/app/icon-filter.svg';
import IconTag from '~icons/app/icon-tag';
import IconRefresh from '~icons/app/icon-refresh';
import IconSetting from '~icons/app/icon-setting';

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
const checkAll = ref(false);
const isIndeterminate = ref(true);
const layout = ref('sizes, prev, pager, next, slot, jumper');
const lang = computed(() => {
  return useLangStore().lang;
});

const keyArr = [
  'authorsList',
  'assigneesList',
  'labelsList',
  'branchesList',
  'reposList',
  'typesList',
  'exLabelsList',
];

const filterList = ref(new Map());
// 构造筛选条件数组
for (let i = 0; i < keyArr.length; i++) {
  filterList.value.set(keyArr[i], { page: 1, total: 0, keyword: '', data: [] });
}

const titleList = ref(
  new Map([
    [
      'id',
      {
        value: 'ID',
      },
    ],
    [
      'repo',
      {
        value: computed(() => {
          return t('quickIssue.REPO_NAME');
        }),
      },
    ],
    [
      'title',
      {
        value: computed(() => {
          return t('quickIssue.TITLE');
        }),
      },
    ],
    [
      'state',
      {
        value: computed(() => {
          return t('quickIssue.STATE');
        }),
      },
    ],
    [
      'type',
      {
        value: computed(() => {
          return t('quickIssue.TYPE');
        }),
      },
    ],
    [
      'author',
      {
        value: computed(() => {
          return t('quickIssue.SUBMITTER');
        }),
      },
    ],
    [
      'assignee',
      {
        value: computed(() => {
          return t('quickIssue.ASSIGNER');
        }),
      },
    ],
    [
      'priority',
      {
        value: computed(() => {
          return t('quickIssue.PRIORITY');
        }),
      },
    ],
    [
      'label',
      {
        value: computed(() => {
          return t('quickIssue.LABEL');
        }),
      },
    ],
    [
      'branch',
      {
        value: computed(() => {
          return t('quickIssue.BRANCH');
        }),
      },
    ],
    [
      'create_at',
      {
        value: computed(() => {
          return t('quickIssue.CREATED_AT');
        }),
      },
    ],
    [
      'updata_at',
      {
        value: computed(() => {
          return t('quickIssue.UPDATE_AT');
        }),
      },
    ],
  ])
);
const checkedTitle = ref([
  'id',
  'repo',
  'type',
  'title',
  'state',
  'author',
  'label',
  'create_at',
]);

const queryData = reactive({
  page: 1,
  per_page: 10,
  search: '',
  issue_type: '',
  priority: '',
  direction: 'desc',
  create: '',
  author: '',
  sort: 'created_at',
  assignee: '',
  label: [],
  branch: '',
  repo: '',
  issue_state: [],
  exclusion: [],
});

const optionQuery = reactive({
  page: 1,
  per_page: 40,
  keyword: '',
  mode: 'local',
});

const handleTitleClick = (title: string) => {
  if (checkedTitle.value.includes(title)) {
    const index = checkedTitle.value.indexOf(title);
    checkedTitle.value.splice(index, 1);
  } else {
    checkedTitle.value.push(title);
  }
};

const handleCheckedValueChange = (value: string[]) => {
  const checkedCount = value.length;
  checkAll.value = checkedCount === ISSUE_CONFIG.ISSUE_STATE.length;
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < ISSUE_CONFIG.ISSUE_STATE.length;
};

const handleSizeChange = (val: number) => {
  queryData.per_page = val;
  totalPage.value = Math.ceil(total.value / val);
};

const handleCheckAllChange = (val: any) => {
  (queryData.issue_state as Array<string>) = val
    ? ISSUE_CONFIG.ISSUE_STATE
    : [];
  isIndeterminate.value = false;
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

function getLabelColor(label: string) {
  const result: CSSProperties = {};
  result.color = `#${
    labelColor?.labelColor?.find((item) => {
      return item.name === label;
    })?.color
  }`;
  return result;
}

function getRepoIssueData() {
  getRepoIssue(queryData).then((res) => {
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
  (queryData as any)[key] = command;
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
    if (filterList.value.get(`${openDropDown.value}List`).keyword) {
      filterList.value.get(`${openDropDown.value}List`).data = [];
      optionQuery.keyword = filterList.value.get(
        `${openDropDown.value}List`
      ).keyword;
    }
  }
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
  if (type === 'repos') {
    getReposData(optionQuery)
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
  } else {
    getIssueSelectOption(type, optionQuery)
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
}
onMounted(() => {
  if (window.localStorage?.getItem('title')) {
    checkedTitle.value = JSON.parse(
      window.localStorage.getItem('title') as any
    );
  }
  getRepoIssueData();
  getOption('authors');
  getOption('assignees');
  getOption('labels');
  getOption('branches');
  getOption('types');
  getOption('repos');
});
watch(
  () => checkedTitle,
  () => {
    window.localStorage.setItem('title', JSON.stringify(checkedTitle.value));
  },
  {
    deep: true,
  }
);
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
        :placeholder="t('quickIssue.PLACEHOLDER')"
        @change="searchValchange"
      ></OSearch>
    </div>
    <OTable
      class="quick-issue-table"
      :class="lang === 'en' ? 'en-table' : ''"
      :data="issueData"
      style="width: 100%"
    >
      <transition-group name="hello">
        <el-table-column
          v-if="checkedTitle.includes('id')"
          key="id"
          min-width="90"
        >
          <template #header>
            <span>{{ t('quickIssue.ID') }}</span>
          </template>
          <template #default="scope">
            <span class="detail-page">
              {{ scope.row.number }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="checkedTitle.includes('repo')"
          key="repo"
          min-width="110"
        >
          <template #header>
            <span :class="queryData.repo ? 'active' : ''">{{
              queryData.repo || t('quickIssue.REPO_NAME')
            }}</span>

            <ODropdown
              :max-height="250"
              :listener-scorll="true"
              @scorll-bottom="getNextPage"
              @command="(val: string) => handleCommand(val, 'repo')"
              @visible-change="(val: boolean) => visibleChange(val, 'repos')"
            >
              <OIcon
                class="filter-icon"
                :class="queryData.repo ? 'active' : ''"
              >
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
                    :key="item.repo"
                    :command="item.repo"
                    :class="queryData.repo === item.repo ? 'is-active' : ''"
                    >{{ item.repo }}</ODropdownItem
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
        <el-table-column
          v-if="checkedTitle.includes('title')"
          key="title"
          min-width="350"
        >
          <template #header>
            <span>{{ t('quickIssue.TITLE') }}</span>
          </template>
          <template #default="scope">
            <span class="detail-page">
              <a :href="scope.row.link" target="_blank">{{
                scope.row.title
              }}</a>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="checkedTitle.includes('type')"
          key="type"
          min-width="80"
        >
          <template #header>
            <span :class="queryData.issue_type ? 'active' : ''">{{
              queryData.issue_type || t('quickIssue.TYPE')
            }}</span>
            <ODropdown
              :max-height="250"
              @command="(val: string) => handleCommand(val, 'issue_type')"
            >
              <OIcon
                class="filter-icon"
                :class="queryData.issue_type ? 'active' : ''"
              >
                <IconFilter></IconFilter>
              </OIcon>
              <template #dropdown>
                <ODropdownItem v-if="queryData.issue_type" :command="''">{{
                  t('quickIssue.CANCEL')
                }}</ODropdownItem>
                <ODropdownItem
                  v-for="item in filterList.get('typesList').data"
                  :key="item.name"
                  :command="item.name"
                  :class="queryData.issue_type === item.name ? 'is-active' : ''"
                  >{{ item.name }}</ODropdownItem
                >
              </template>
            </ODropdown>
          </template>
          <template #default="scope">
            <span class="detail-page">
              {{ scope.row.issue_type }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="checkedTitle.includes('state')"
          key="state"
          min-width="100"
        >
          <template #header>
            <span :class="queryData.issue_state.length ? 'active' : ''">{{
              queryData.issue_state.join(', ') || t('quickIssue.STATE')
            }}</span>
            <ODropdown
              :max-height="250"
              @command="(val: string) => handleCommand(val, 'issue_state')"
            >
              <OIcon
                class="filter-icon"
                :class="queryData.issue_state.length ? 'active' : ''"
              >
                <IconFilter></IconFilter>
              </OIcon>
              <template #dropdown>
                <el-dropdown-menu>
                  <ElCheckbox
                    v-model="checkAll"
                    :indeterminate="isIndeterminate"
                    class="o-checkbox"
                    @change="handleCheckAllChange"
                    >{{ t('quickIssue.SELECT_ALL') }}</ElCheckbox
                  >
                  <OCheckboxGroup
                    v-model="queryData.issue_state"
                    @change="handleCheckedValueChange"
                  >
                    <OCheckbox
                      v-for="item in ISSUE_CONFIG.ISSUE_STATE"
                      :key="item"
                      :value="item"
                    >
                      {{ item }}
                    </OCheckbox>
                  </OCheckboxGroup>
                </el-dropdown-menu>
              </template>
            </ODropdown>
          </template>
          <template #default="scope">
            <span class="detail-page">
              {{ scope.row.issue_state }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="checkedTitle.includes('author')"
          key="author"
          min-width="130"
        >
          <template #header>
            <span :class="queryData.author ? 'active' : ''">{{
              queryData.author || t('quickIssue.SUBMITTER')
            }}</span>

            <ODropdown
              :max-height="250"
              :listener-scorll="true"
              @scorll-bottom="getNextPage"
              @command="(val: string) => handleCommand(val, 'author')"
              @visible-change="(val: boolean) => visibleChange(val, 'authors')"
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
              <template v-if="scope.row.reporter">
                {{ scope.row.reporter }}
              </template>
              <a
                v-else-if="scope.row.author"
                :key="scope.row.author"
                :href="`https://gitee.com/${scope.row.author}`"
                :title="scope.row.author"
                class="link"
                target="_blank"
              >
                {{ scope.row.author }}
              </a>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="checkedTitle.includes('assignee')"
          key="assignee"
          min-width="110"
        >
          <template #header>
            <span :class="queryData.assignee ? 'active' : ''">{{
              queryData.assignee || t('quickIssue.ASSIGNER')
            }}</span>

            <ODropdown
              :max-height="250"
              :listener-scorll="true"
              @scorll-bottom="getNextPage"
              @command="(val: string) => handleCommand(val, 'assignee')"
              @visible-change="(val: boolean) => visibleChange(val, 'assignees')"
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
                v-if="scope.row.assignee"
                :key="scope.row.assignee"
                :href="`https://gitee.com/${scope.row.assignee}`"
                :title="scope.row.assignee"
                class="link"
                target="_blank"
              >
                {{ scope.row.assignee }}
              </a>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="checkedTitle.includes('priority')"
          key="priority"
          min-width="100"
        >
          <template #header>
            <span :class="queryData.priority ? 'active' : ''">{{
              queryData.priority || t('quickIssue.PRIORITY')
            }}</span>
            <ODropdown
              @command="(val: string) => handleCommand(val, 'priority')"
            >
              <OIcon
                class="filter-icon"
                :class="queryData.priority ? 'active' : ''"
              >
                <IconFilter></IconFilter>
              </OIcon>
              <template #dropdown>
                <el-dropdown-menu>
                  <ODropdownItem v-if="queryData.priority" :command="''">{{
                    t('quickIssue.CANCEL')
                  }}</ODropdownItem>
                  <ODropdownItem
                    v-for="item in ISSUE_CONFIG.PRIORITY"
                    :key="item.value"
                    :command="item.value"
                    :class="
                      queryData.priority === item.value ? 'is-active' : ''
                    "
                    >{{ item.value }}</ODropdownItem
                  >
                </el-dropdown-menu>
              </template>
            </ODropdown>
          </template>
          <template #default="scope">
            <span class="detail-page">
              {{ scope.row.priority }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="checkedTitle.includes('label')"
          key="label"
          min-width="180"
        >
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
        <el-table-column
          v-if="checkedTitle.includes('branch')"
          key="branch"
          min-width="100"
        >
          <template #header>
            <span :class="queryData.branch ? 'active' : ''">{{
              queryData.branch || t('quickIssue.BRANCH')
            }}</span>

            <ODropdown
              :max-height="250"
              :listener-scorll="true"
              @scorll-bottom="getNextPage"
              @command="(val: string) => handleCommand(val, 'branch')"
              @visible-change="(val: boolean) => visibleChange(val, 'branches')"
            >
              <OIcon
                class="filter-icon"
                :class="queryData.branch ? 'active' : ''"
              >
                <IconFilter></IconFilter>
              </OIcon>
              <template #dropdown>
                <div class="search-box">
                  <ODropdownItem v-if="queryData.branch" :command="''">{{
                    t('quickIssue.CANCEL')
                  }}</ODropdownItem>
                  <OSearch
                    v-model="filterList.get('branchesList').keyword"
                    :placeholder="t('quickIssue.SEARCH_PLACEHOLDER')"
                    @input="valueChangeDebounced"
                  ></OSearch>
                </div>
                <ul v-if="filterList.get('branchesList').data.length">
                  <ODropdownItem
                    v-for="item in filterList.get('branchesList').data"
                    :key="item"
                    :command="item"
                    :class="queryData.branch === item ? 'is-active' : ''"
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
              {{ scope.row.branch }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="checkedTitle.includes('create_at')"
          key="create_at"
          min-width="120"
        >
          <template #header>
            <span>{{ t('quickIssue.CREATED_AT') }}</span>
            <div class="sort-time" @click="sortClick('created_at')">
              <OIcon
                class="icon-up"
                :class="
                  queryData.direction === 'asc' &&
                  queryData.sort === 'created_at'
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
        <el-table-column
          v-if="checkedTitle.includes('updata_at')"
          key="updata_at"
          min-width="120"
        >
          <template #header>
            <span>{{ t('quickIssue.UPDATE_AT') }}</span>
            <div class="sort-time" @click="sortClick('updated_at')">
              <OIcon
                class="icon-up"
                :class="
                  queryData.direction === 'asc' &&
                  queryData.sort === 'updated_at'
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
        <el-table-column
          key="setting"
          width="50"
          fixed="right"
          class-name="setting-title"
        >
          <template #header>
            <el-popover width="286" trigger="click">
              <template #reference>
                <OIcon :class="queryData.assignee ? 'active' : ''">
                  <IconSetting></IconSetting>
                </OIcon>
              </template>
              <div class="filter-title">
                <OTag
                  v-for="(item, index) in titleList"
                  :key="index"
                  checkable
                  checked
                  :type="checkedTitle.includes(item[0]) ? 'primary' : 'text'"
                  @click="handleTitleClick(item[0])"
                >
                  {{ item[1].value }}
                </OTag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
      </transition-group>
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
          @visible-change="(val: boolean) => visibleChange(val, 'labels')"
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
          @visible-change="(val: boolean) => visibleChange(val, 'exLabels')"
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
.hello-enter-from,
.hello-leave-to {
  transform: translateX(-100%);
}
.hello-enter-active,
.hello-leave-active {
  transition: 0.5s linear;
}
/* 进入的终点、离开的起点 */
.hello-enter-to,
.hello-leave-from {
  transform: translateX(0);
}

.app-content {
  position: relative;
}

.el-popper.el-select__popper {
  --el-popper-border-radius: 0;

  .el-input {
    position: relative;
    padding: 0px 8px;
    position: sticky;
    top: 8px;
    background-color: #fff;
    z-index: 1;

    &::before {
      position: absolute;
      content: '';
      height: 10px;
      width: 100%;
      top: -10px;
      left: 0;
      background-color: #fff;
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
:deep(.el-popover.el-popper) {
  border-radius: 0;
}
.filter-title {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  width: 260px;
  background-color: #fff;
}
.active {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  word-spacing: 100vw;
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

  .el-table__body-wrapper {
    transform: scaleY(-1);

    .el-scrollbar__view {
      transform: scaleY(-1);
    }
  }

  .el-table__inner-wrapper {
    width: 100%;
  }

  tr {
    .cell {
      display: flex;
      align-items: center;

      .detail-page {
        p {
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
  .setting-title {
    .cell {
      justify-content: center;
      padding: 0;
    }

    .o-icon {
      cursor: pointer;
      font-size: 20px;
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

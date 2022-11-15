import { defineStore } from 'pinia';
interface LabelColor {
  color: string;
  name: string;
}

// 语言
export const useLangStore = defineStore('lang', {
  state: () => {
    return {
      lang: '',
    };
  },
});
// 标签颜色
export const useLabelColor = defineStore('color', {
  state: () => {
    return {
      labelColor: [] as Array<LabelColor>,
    };
  },
  actions: {
    setLabelColor(data: Array<LabelColor>) {
      this.labelColor = data;
    },
  },
});
